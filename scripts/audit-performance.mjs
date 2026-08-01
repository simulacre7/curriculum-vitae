import { spawn } from 'node:child_process';
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { findChrome, root, startPreviewServer } from './audit-utils.mjs';

const FONT_FILE = 'PretendardVariable.v1.3.9.cv-subset.woff2';
const FONT_PATH = `/fonts/${FONT_FILE}`;
const MAX_FONT_BYTES = 150 * 1024;
const MAX_FCP_MS = 2500;

const routes = [
  {
    path: '/ko/',
    name: 'cv-ko',
    expectedFontRequests: 1,
    minTextLength: 4000,
    maxCls: 0.001,
    expectedHtml: '김기환',
  },
  {
    path: '/en/',
    name: 'cv-en',
    expectedFontRequests: 1,
    minTextLength: 4000,
    maxCls: 0.001,
    expectedHtml: 'I have worked as a frontend engineer since 2020',
  },
  {
    path: '/bash/ko/',
    name: 'bash-ko',
    expectedFontRequests: 0,
    minTextLength: 250,
    maxCls: 0.02,
    expectedHtml: 'Terminal CV',
  },
];

const sleep = (ms) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const getJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
};

const connectToChrome = async (port) => {
  for (let i = 0; i < 80; i += 1) {
    try {
      await getJson(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await sleep(100);
    }
  }

  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const target = targets.find((item) => item.type === 'page') ?? targets[0];
  if (!target?.webSocketDebuggerUrl) {
    throw new Error('Chrome did not expose a debuggable page target.');
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolvePromise, reject) => {
    ws.addEventListener('open', resolvePromise, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  return ws;
};

const runRouteAudit = async (url) => {
  const userDataDir = await rmTempDir();
  const port = 9444 + Math.floor(Math.random() * 1000);
  const chrome = spawn(
    findChrome(),
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    const ws = await connectToChrome(port);
    let id = 0;
    const pending = new Map();
    const events = [];
    const requests = [];

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.id && pending.has(message.id)) {
        const { resolve: resolvePromise, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolvePromise(message.result);
        return;
      }

      if (message.method === 'Network.requestWillBeSent') {
        requests.push(message.params.request.url);
      }
      events.push(message);
    });

    const send = (method, params = {}) =>
      new Promise((resolvePromise, reject) => {
        const messageId = ++id;
        pending.set(messageId, { resolve: resolvePromise, reject });
        ws.send(JSON.stringify({ id: messageId, method, params }));
      });

    const waitForEvent = (method, timeoutMs = 15000) =>
      new Promise((resolvePromise, reject) => {
        const startedAt = Date.now();
        const timer = setInterval(() => {
          const index = events.findIndex((event) => event.method === method);
          if (index >= 0) {
            clearInterval(timer);
            resolvePromise(events.splice(index, 1)[0]);
            return;
          }
          if (Date.now() - startedAt > timeoutMs) {
            clearInterval(timer);
            reject(new Error(`Timed out waiting for ${method}`));
          }
        }, 50);
      });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.__cls = 0;
        window.__shifts = [];
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__cls += entry.value;
              window.__shifts.push({ value: entry.value, startTime: entry.startTime });
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      `,
    });

    events.length = 0;
    await send('Page.navigate', { url });
    await waitForEvent('Page.loadEventFired');
    const metrics = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `new Promise(async (resolve) => {
        const start = performance.now();
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]);
        await new Promise((r) => setTimeout(r, 500));
        const resources = performance.getEntriesByType('resource').map((entry) => ({
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize,
          encodedBodySize: entry.encodedBodySize,
        }));
        resolve({
          cls: window.__cls,
          shifts: window.__shifts,
          fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
          fontsDone: performance.now() - start,
          rootTextLength: document.querySelector('#root')?.textContent?.length ?? 0,
          localeFetches: resources.filter((entry) => entry.name.includes('/locales/')),
          fontRequests: resources.filter((entry) => entry.name.includes('${FONT_FILE}') || entry.name.includes('/fonts/')),
          jsdelivrRequests: resources.filter((entry) => entry.name.includes('cdn.jsdelivr')),
          fontFaces: document.fonts.size,
          fontStatus: document.fonts.status,
        });
      })`,
    });

    ws.close();
    return { ...metrics.result.value, requests };
  } finally {
    chrome.kill('SIGTERM');
    await sleep(300);
    await rm(userDataDir, { recursive: true, force: true });
  }
};

const rmTempDir = async () => {
  const dir = await import('node:fs/promises').then(({ mkdtemp }) =>
    mkdtemp(path.join(os.tmpdir(), 'cv-audit-chrome-'))
  );
  return dir;
};

const assertStaticBuild = async () => {
  const failures = [];
  const fontStat = await stat(path.join(root, 'dist', 'fonts', FONT_FILE));

  if (fontStat.size > MAX_FONT_BYTES) {
    failures.push(
      `font subset is too large: ${fontStat.size} > ${MAX_FONT_BYTES}`
    );
  }

  const [koHtml, enHtml, bashHtml] = await Promise.all([
    readFile(path.join(root, 'dist', 'ko', 'index.html'), 'utf8'),
    readFile(path.join(root, 'dist', 'en', 'index.html'), 'utf8'),
    readFile(path.join(root, 'dist', 'bash', 'ko', 'index.html'), 'utf8'),
  ]);

  if (!koHtml.includes(FONT_PATH) || !enHtml.includes(FONT_PATH)) {
    failures.push('CV HTML must preload the self-hosted Pretendard subset.');
  }
  if (bashHtml.includes(FONT_PATH)) {
    failures.push('Bash HTML should not preload the CV Pretendard subset.');
  }
  if (!koHtml.includes('<div id="root"><style') || !koHtml.includes('김기환')) {
    failures.push('/ko is not prerendered with Korean CV content.');
  }
  if (
    !enHtml.includes('<div id="root"><style') ||
    !enHtml.includes('I have worked as a frontend engineer since 2020')
  ) {
    failures.push('/en is not prerendered with English CV content.');
  }

  const assetDir = path.join(root, 'dist', 'assets');
  const jsFiles = (await readdir(assetDir))
    .filter((file) => file.endsWith('.js'))
    .map((file) => path.join(assetDir, file));
  const forbiddenPatterns = [
    'translation.json',
    'i18next-http-backend',
    'i18next-browser-languagedetector',
    'loadPath',
    'fetch("/locales/',
  ];

  for (const file of jsFiles) {
    const source = await readFile(file, 'utf8');
    for (const pattern of forbiddenPatterns) {
      if (source.includes(pattern)) {
        failures.push(
          `forbidden locale loading pattern found in ${path.basename(file)}: ${pattern}`
        );
      }
    }
  }

  return failures;
};

const audit = async () => {
  const failures = await assertStaticBuild();
  const preview = await startPreviewServer();

  try {
    for (const route of routes) {
      const url = `${preview.baseUrl}${route.path}`;
      const html = await fetch(url).then((response) => response.text());
      const metrics = await runRouteAudit(url);
      const fontBytes = metrics.fontRequests.reduce(
        (sum, entry) =>
          sum + (entry.encodedBodySize || entry.transferSize || 0),
        0
      );

      console.log(
        [
          `[${route.name}]`,
          `fcp=${Math.round(metrics.fcp ?? -1)}ms`,
          `cls=${metrics.cls.toFixed(6)}`,
          `fontRequests=${metrics.fontRequests.length}`,
          `fontBytes=${fontBytes}`,
          `locales=${metrics.localeFetches.length}`,
          `jsdelivr=${metrics.jsdelivrRequests.length}`,
        ].join(' ')
      );

      if (!html.includes(route.expectedHtml)) {
        failures.push(
          `${route.path} HTML did not include expected text: ${route.expectedHtml}`
        );
      }
      if (metrics.rootTextLength < route.minTextLength) {
        failures.push(
          `${route.path} rendered too little text: ${metrics.rootTextLength}`
        );
      }
      if (metrics.localeFetches.length > 0) {
        failures.push(`${route.path} requested locale files at runtime.`);
      }
      if (metrics.jsdelivrRequests.length > 0) {
        failures.push(`${route.path} requested jsdelivr resources.`);
      }
      if (metrics.fontRequests.length !== route.expectedFontRequests) {
        failures.push(
          `${route.path} expected ${route.expectedFontRequests} font requests, got ${metrics.fontRequests.length}`
        );
      }
      if (route.expectedFontRequests > 0 && fontBytes > MAX_FONT_BYTES) {
        failures.push(
          `${route.path} transferred too much font data: ${fontBytes}`
        );
      }
      if (metrics.cls > route.maxCls) {
        failures.push(`${route.path} CLS too high: ${metrics.cls}`);
      }
      if (metrics.fcp === null || metrics.fcp > MAX_FCP_MS) {
        failures.push(`${route.path} FCP too slow: ${metrics.fcp}`);
      }
    }
  } finally {
    await preview.stop();
  }

  if (failures.length > 0) {
    console.error('\nPerformance audit failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\nPerformance audit passed.');
};

await audit();

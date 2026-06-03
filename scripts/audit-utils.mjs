import { execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const sleep = (ms) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const commandPath = (command) => {
  try {
    return execFileSync('which', [command], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

export const findChrome = () => {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    commandPath('google-chrome-stable'),
    commandPath('google-chrome'),
    commandPath('chromium'),
    commandPath('chromium-browser'),
    commandPath('chrome'),
  ].filter(Boolean);

  const chrome = candidates.find((candidate) => existsSync(candidate));
  if (!chrome) {
    throw new Error(
      'Chrome was not found. Set CHROME_PATH to a Chrome executable.'
    );
  }

  return chrome;
};

export const getAvailablePort = () =>
  new Promise((resolvePromise, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => {
        if (!address || typeof address === 'string') {
          reject(new Error('Failed to allocate a local port.'));
          return;
        }
        resolvePromise(address.port);
      });
    });
  });

export const waitForServer = async (targetUrl, timeoutMs = 15000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await sleep(250);
  }

  throw new Error(`Timed out waiting for ${targetUrl}`);
};

export const startPreviewServer = async () => {
  const port = Number(process.env.AUDIT_PORT ?? (await getAvailablePort()));
  const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const child = spawn(
    pnpm,
    ['exec', 'vite', 'preview', '--host', '127.0.0.1', '--port', String(port)],
    {
      cwd: root,
      env: { ...process.env, BROWSER: 'none' },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  const output = [];
  child.stdout.on('data', (chunk) => output.push(chunk.toString()));
  child.stderr.on('data', (chunk) => output.push(chunk.toString()));

  try {
    await waitForServer(`http://127.0.0.1:${port}/ko/`);
  } catch (error) {
    child.kill('SIGTERM');
    throw new Error(`${error.message}\n${output.join('')}`);
  }

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    stop: async () => {
      if (child.killed || child.exitCode !== null) return;
      child.kill('SIGTERM');
      await Promise.race([
        new Promise((resolvePromise) => child.once('exit', resolvePromise)),
        sleep(2000),
      ]);
    },
  };
};

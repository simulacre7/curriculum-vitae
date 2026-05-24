import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import QRCode from 'qrcode';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = resolve(root, '.tmp-bash-pdf');
const outputDir = resolve(root, 'dist', 'downloads');
const outputPdf = resolve(outputDir, 'kihwan-kim-terminal-cv.pdf');
const tempHtml = resolve(tempDir, 'terminal-cv.html');
const bashUrl = 'https://kihwan.kim/bash';

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/opt/google/chrome/chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  process.env.CHROME_PATH,
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chrome) {
  throw new Error(
    'Chrome, Chromium, or Edge was not found. Set CHROME_PATH to a browser executable.'
  );
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatList = (items, prefix = '- ') =>
  items.map((item) => `${prefix}${item}`).join('\n');

const getProjectText = (resume, matcher) => {
  const matches = resume.experience.flatMap((job) =>
    (job.projects ?? [])
      .filter(matcher)
      .map((project) => ({ ...project, company: job.company }))
  );

  if (!matches.length) return '관련 프로젝트를 찾지 못했습니다.';

  return matches
    .map((project) =>
      [
        `${project.title} / ${project.company}`,
        project.period,
        project.summary ?? '',
        project.details?.length ? formatList(project.details) : '',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n');
};

const commandOutputs = (resume) => ({
  about: [
    resume.name,
    '',
    resume.summary,
    '',
    'focus: Agentic UI, Browser Agent, Server-Driven UI, frontend architecture',
  ].join('\n'),
  work: resume.experience
    .map((item) =>
      [
        `${item.company} / ${item.role} / ${item.period}`,
        item.summary,
        item.projects?.length
          ? formatList(
              item.projects.map((project) => project.title),
              '  - '
            )
          : '',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n'),
  agent: getProjectText(resume, (project) =>
    /agent|generative|pageagent|자동화|browser|ui/i.test(
      `${project.title} ${project.summary ?? ''}`
    )
  ),
  stack: Array.from(
    new Set(resume.experience.flatMap((item) => item.stack ?? []))
  ).join('  '),
  papers: resume.publications
    .map((publication) =>
      [
        publication.title,
        publication.conference,
        publication.points?.[0] ? `- ${publication.points[0]}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n'),
});

const lineBlock = (text) =>
  escapeHtml(text)
    .split('\n')
    .map((line) => `<div class="line">${line || '&nbsp;'}</div>`)
    .join('');

const commandBlock = (command, output) => `
  <section class="command-block">
    <div class="prompt"><span>kihwan@cv:~$</span> ${escapeHtml(command)}</div>
    <div class="output">${lineBlock(output)}</div>
  </section>
`;

const createBackgroundDataUrl = async () => {
  const svg = `<svg width="1240" height="1754" viewBox="0 0 1240 1754" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="green" cx="12%" cy="0%" r="52%">
        <stop offset="0%" stop-color="#123f25" stop-opacity="1"/>
        <stop offset="58%" stop-color="#070907" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="magenta" cx="100%" cy="18%" r="46%">
        <stop offset="0%" stop-color="#28101d" stop-opacity="1"/>
        <stop offset="64%" stop-color="#070907" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1240" height="1754" fill="#070907"/>
    <rect width="1240" height="1754" fill="url(#green)"/>
    <rect width="1240" height="1754" fill="url(#magenta)"/>
  </svg>`;
  const png = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  return `data:image/png;base64,${png.toString('base64')}`;
};

const createHtml = async () => {
  const resume = JSON.parse(
    await readFile(resolve(root, 'public/locales/ko/common.json'), 'utf8')
  );
  const backgroundDataUrl = await createBackgroundDataUrl();
  const qrDataUrl = await QRCode.toDataURL(bashUrl, {
    color: {
      dark: '#0b1f12',
      light: '#e8f2ea',
    },
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
  });
  const outputs = commandOutputs(resume);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>김기환 Terminal CV</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        color: #e8f2ea;
        background: #070907;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 9.4pt;
        line-height: 1.48;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        min-height: 100vh;
        padding: 12mm;
        background:
          #070907 url("${backgroundDataUrl}") center top / cover no-repeat;
      }

      .terminal {
        min-height: calc(297mm - 24mm);
        border: 0.3mm solid #314239;
        border-radius: 3mm;
        background: #020807;
      }

      .titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8mm;
        min-height: 12mm;
        padding: 0 5mm;
        border-bottom: 0.3mm solid #203027;
        border-radius: 2.7mm 2.7mm 0 0;
        background: #0b100d;
      }

      .lights {
        display: flex;
        gap: 2mm;
      }

      .lights span {
        width: 3mm;
        height: 3mm;
        border-radius: 999px;
      }

      .lights span:nth-child(1) {
        background: #ff5f57;
      }

      .lights span:nth-child(2) {
        background: #febc2e;
      }

      .lights span:nth-child(3) {
        background: #28c840;
      }

      .title {
        flex: 1;
        color: #a8b9ad;
        text-align: center;
      }

      .content {
        padding: 6mm;
      }

      .hero {
        margin: 0 0 7mm;
        page-break-after: avoid;
      }

      .hero .path {
        color: #82f6a3;
        font-size: 17pt;
        font-weight: 700;
      }

      h1 {
        margin: 5mm 0 1.5mm;
        color: #f1fff4;
        font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
        font-size: 28pt;
        line-height: 1.08;
      }

      .subtitle {
        color: #a8b9ad;
        font-size: 12pt;
      }

      .command-block {
        margin: 0 0 5mm;
        padding-top: 7mm;
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .prompt {
        margin-bottom: 1.5mm;
        color: #f1fff4;
        font-weight: 700;
      }

      .prompt span {
        color: #82f6a3;
      }

      .output {
        color: #d8e8db;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .line {
        min-height: 1.48em;
      }

      .contact {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 38mm;
        align-items: center;
        gap: 7mm;
        margin-top: 2mm;
        padding-top: 4mm;
        border-top: 0.3mm solid #203027;
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .contact-lines {
        color: #d8e8db;
      }

      .qr-card {
        display: grid;
        justify-items: center;
        gap: 2mm;
        color: #82f6a3;
        text-align: center;
        font-size: 7.5pt;
      }

      .qr-card img {
        width: 34mm;
        height: 34mm;
        border: 1.3mm solid #e8f2ea;
        border-radius: 2mm;
        background: #e8f2ea;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="terminal">
      <header class="titlebar">
        <div class="lights" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="title">kihwan.kim/bash</div>
        <div>Terminal CV</div>
      </header>
      <div class="content">
        <section class="hero">
          <div class="path">kihwan.kim/bash</div>
          <h1>김기환</h1>
          <div class="subtitle">Terminal CV · Software Engineer</div>
        </section>
        ${commandBlock('about', outputs.about)}
        ${commandBlock('work', outputs.work)}
        ${commandBlock('agent', outputs.agent)}
        ${commandBlock('stack', outputs.stack)}
        ${commandBlock('papers', outputs.papers)}
        <section class="command-block contact">
          <div>
            <div class="prompt"><span>kihwan@cv:~$</span> contact</div>
            <div class="contact-lines">
              ${lineBlock(
                [
                  'email    juljin1875@gmail.com',
                  'linkedin https://www.linkedin.com/in/1875/',
                  'github   https://github.com/simulacre7/',
                  'web      https://kihwan.kim',
                ].join('\n')
              )}
            </div>
          </div>
          <a class="qr-card" href="${bashUrl}">
            <img src="${qrDataUrl}" alt="QR code for ${bashUrl}" />
            <div>$ open kihwan.kim/bash</div>
          </a>
        </section>
      </div>
    </main>
  </body>
</html>`;
};

await mkdir(tempDir, { recursive: true });
await mkdir(outputDir, { recursive: true });
await writeFile(tempHtml, await createHtml());

execFileSync(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-pdf-header-footer',
    '--print-to-pdf-no-header',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${outputPdf}`,
    pathToFileURL(tempHtml).href,
  ],
  { cwd: root, stdio: 'inherit' }
);

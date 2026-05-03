import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const submissionDir = resolve(root, 'submission');
const tempDir = resolve(root, '.tmp-submission');
const coverHtml = resolve(tempDir, 'cover.html');
const coverPdf = resolve(tempDir, 'KihwanKim_Cover.pdf');
const cvPdf = resolve(tempDir, 'KihwanKim_CV.pdf');
const portfolioPdf = resolve(
  root,
  '..',
  'pageagent-generative-ui-case-study',
  'submission',
  'KihwanKim_PageAgent_InternalOps_CaseStudy.pdf'
);
const outputPdf = resolve(
  submissionDir,
  'KihwanKim_CV_PageAgent_Portfolio.pdf'
);
const port = Number(process.env.CV_PDF_PORT ?? 4177);
const url = `http://127.0.0.1:${port}/?lng=ko`;

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  process.env.CHROME_PATH,
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chrome) {
  throw new Error(
    'Chrome, Chromium, or Edge was not found. Set CHROME_PATH to a browser executable.'
  );
}

if (!existsSync(portfolioPdf)) {
  throw new Error(`Portfolio PDF was not found: ${portfolioPdf}`);
}

mkdirSync(submissionDir, { recursive: true });
mkdirSync(tempDir, { recursive: true });

const run = (command, args, options = {}) => {
  execFileSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    ...options,
  });
};

const waitForServer = async (targetUrl, timeoutMs = 15000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }

  throw new Error(`Timed out waiting for ${targetUrl}`);
};

const createCoverHtml = () => {
  writeFileSync(
    coverHtml,
    `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #000000;
        background: #ffffff;
        font-family:
          Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue",
          "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
      }

      .page {
        position: relative;
        width: 210mm;
        height: 297mm;
        padding: 52mm 18mm 24mm;
      }

      .eyebrow {
        color: #3eb489;
        font-size: 10pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 20px 0 0;
        font-size: 34pt;
        line-height: 1.15;
      }

      .role {
        margin-top: 14px;
        font-size: 17pt;
      }

      .summary {
        margin-top: 38px;
        max-width: 680px;
        color: #5e5e5e;
        font-size: 11pt;
        line-height: 1.6;
      }

      .rule {
        margin-top: 64px;
        border-top: 1px solid rgba(62, 180, 137, 0.26);
      }

      .section {
        display: grid;
        grid-template-columns: 44px 1fr;
        gap: 18px;
        margin-top: 34px;
      }

      .number {
        color: #3eb489;
        font-size: 11pt;
        font-weight: 700;
      }

      .title {
        font-size: 15pt;
        font-weight: 700;
      }

      .description {
        margin-top: 8px;
        color: #5e5e5e;
        font-size: 10.5pt;
        line-height: 1.5;
      }

      .site {
        position: absolute;
        left: 18mm;
        bottom: 13.4mm;
      }

      .site a {
        color: #5e5e5e;
        font-size: 10pt;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="eyebrow">Curriculum Vitae · Portfolio Submission</div>
      <h1>김기환 · Kihwan Kim</h1>
      <div class="role">Software Engineer</div>
      <p class="summary">
        이력서와 포트폴리오를 하나로 묶어, 경력과 연구 이력은 물론 제품 개발 과정에서 다룬
        운영 자동화, Server Driven UI, 렌더링 최적화, AI 제품/XAI 사례를 함께 정리했습니다.
      </p>

      <div class="rule"></div>

      <section class="section">
        <div class="number">01</div>
        <div>
          <div class="title">Curriculum Vitae · 이력서</div>
          <div class="description">경력, 프로젝트, 학력, 연구 및 논문 이력</div>
        </div>
      </section>

      <section class="section">
        <div class="number">02</div>
        <div>
          <div class="title">Portfolio Case Studies · 포트폴리오</div>
          <div class="description">
            PageAgent 운영 자동화, RiGrid Server Driven UI, 렌더링 최적화, AutoML XAI
          </div>
        </div>
      </section>

      <div class="site"><a href="https://kihwan.kim">https://kihwan.kim</a></div>
    </main>
  </body>
</html>`
  );
};

const printPdf = (targetUrl, output) => {
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
      `--print-to-pdf=${output}`,
      targetUrl,
    ],
    { stdio: 'inherit' }
  );
};

const drawPageNumbers = async (pdf) => {
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pdf.getPageCount();

  pdf.getPages().forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${totalPages}`;
    page.drawText(label, {
      x: width - 52 - font.widthOfTextAtSize(label, 8),
      y: 38,
      size: 8,
      font,
      color: rgb(0.58, 0.58, 0.58),
    });
  });
};

const mergePdfs = async () => {
  const mergedPdf = await PDFDocument.create();

  for (const sourcePdf of [coverPdf, cvPdf, portfolioPdf]) {
    const pdf = await PDFDocument.load(readFileSync(sourcePdf));
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  await drawPageNumbers(mergedPdf);

  writeFileSync(outputPdf, await mergedPdf.save());
};

run('pnpm', ['build']);
createCoverHtml();

const server = spawn(
  'pnpm',
  [
    'exec',
    'vite',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
    '--strictPort',
  ],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  }
);

server.stdout.on('data', (data) => process.stdout.write(data));
server.stderr.on('data', (data) => process.stderr.write(data));

try {
  await waitForServer(url);
  printPdf(pathToFileURL(coverHtml).href, coverPdf);
  printPdf(url, cvPdf);
  await mergePdfs();
  console.log(`Wrote ${outputPdf}`);
} finally {
  server.kill('SIGTERM');
}

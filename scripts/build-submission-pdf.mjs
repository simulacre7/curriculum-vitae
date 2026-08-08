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
const portfolioCoverHtml = resolve(tempDir, 'portfolio-cover.html');
const portfolioCoverPdf = resolve(tempDir, 'KihwanKim_Portfolio_Cover.pdf');
const cvPdf = resolve(tempDir, 'KihwanKim_CV.pdf');
const portfolioPdf = resolve(
  tempDir,
  'KihwanKim_PageAgent_InternalOps_CaseStudy.pdf'
);
const combinedOutputPdf = resolve(
  submissionDir,
  'KihwanKim_CV_and_Portfolio.pdf'
);
const cvOutputPdf = resolve(submissionDir, 'KihwanKim_CV.pdf');
const portfolioOutputPdf = resolve(submissionDir, 'KihwanKim_Portfolio.pdf');
const port = Number(process.env.CV_PDF_PORT ?? 4177);
const url = `http://127.0.0.1:${port}/ko`;

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

const createCoverHtml = (totalPages) => {
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
        color: #5e5e5e;
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
        margin-top: 24px;
      }

      .number {
        color: #3eb489;
        font-size: 11pt;
        font-weight: 700;
      }

      .title {
        font-size: 13.5pt;
        font-weight: 700;
      }

      .description {
        margin-top: 6px;
        color: #5e5e5e;
        font-size: 10.5pt;
        line-height: 1.5;
      }

      .cover-footer {
        position: absolute;
        left: 18mm;
        right: 18mm;
        bottom: 24mm;
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
      }

      .cover-footer span {
        color: #5e5e5e;
        font-size: 10pt;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="eyebrow">Curriculum Vitae · Portfolio</div>
      <h1><span style="color: #3eb489;">&lt;</span>김기환<span style="color: #5e5e5e;">&nbsp;/&nbsp;</span><span style="color: #3eb489;">&gt;</span></h1>
      <div class="role">Frontend Engineer</div>
      <p class="summary">
        이력서와 포트폴리오를 하나로 묶어, HCI와 Visual Analytics 연구에서 시작해 AI 시스템,
        제품 플랫폼, 내부 운영 자동화로 이어진 작업을 정리했습니다. 복잡한 시스템을 사람이
        이해하고 사용할 수 있게 만든 프론트엔드 구현과 브라우저 자동화 작업을 중심으로
        담았습니다.
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
          <div class="title">Portfolio · 포트폴리오</div>
          <div class="description">
            내부 운영 자동화, 서버 주도 UI, 렌더링 최적화, AutoML·예측 설명 UI, 추천 시스템 실험
          </div>
        </div>
      </section>

      <div class="cover-footer">
        <span>1 / ${totalPages}</span>
      </div>
    </main>
  </body>
</html>`
  );
};

const createPortfolioCoverHtml = (totalPages) => {
  writeFileSync(
    portfolioCoverHtml,
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
        color: #5e5e5e;
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

      .cover-footer {
        position: absolute;
        left: 18mm;
        right: 18mm;
        bottom: 24mm;
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
      }

      .cover-footer span {
        color: #5e5e5e;
        font-size: 10pt;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="eyebrow">Portfolio</div>
      <h1><span style="color: #3eb489;">&lt;</span>김기환<span style="color: #5e5e5e;">&nbsp;/&nbsp;</span><span style="color: #3eb489;">&gt;</span></h1>
      <div class="role">Frontend Engineer</div>
      <p class="summary">
        HCI와 Visual Analytics 연구에서 시작해 AI 시스템, 제품 플랫폼, 내부 운영 자동화로
        이어진 작업을 정리했습니다. 복잡한 시스템을 사람이 이해하고 사용할 수 있게 만든
        프론트엔드 구현과 브라우저 자동화 작업입니다.
      </p>

      <div class="rule"></div>

      <section class="section">
        <div class="number">01</div>
        <div>
          <div class="title">Internal Operations Automation</div>
          <div class="description">내부 도구와 외부 서비스 조회를 연결한 브라우저 자동화</div>
        </div>
      </section>

      <section class="section">
        <div class="number">02</div>
        <div>
          <div class="title">RiGrid 서버 주도 UI</div>
          <div class="description">운영 UI 변경과 A/B 테스트를 배포 일정과 분리한 구조</div>
        </div>
      </section>

      <section class="section">
        <div class="number">03</div>
        <div>
          <div class="title">Rendering Performance</div>
          <div class="description">대용량 콘텐츠 환경을 위한 가상화와 렌더링 최적화</div>
        </div>
      </section>

      <section class="section">
        <div class="number">04</div>
        <div>
          <div class="title">AutoML · 예측 설명 UI</div>
          <div class="description">비전문가도 AI 예측 근거를 검증할 수 있는 UI</div>
        </div>
      </section>

      <section class="section">
        <div class="number">05</div>
        <div>
          <div class="title">Transparent Exploration in Recommender Systems</div>
          <div class="description">추천 설명이 사용자 피드백에 미치는 영향을 검증한 실험 시스템</div>
        </div>
      </section>

      <div class="cover-footer">
        <span>1 / ${totalPages}</span>
      </div>
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

const getPdfPageCount = async (sourcePdf) => {
  const pdf = await PDFDocument.load(readFileSync(sourcePdf));
  return pdf.getPageCount();
};

const createCvFooterLabels = (pageCount) => Array(pageCount).fill('');

const portfolioFooterLabels = Array(6).fill('');

const drawSubmissionFooters = async (pdf, { footerLabels, skipPages = 0 }) => {
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pdf.getPageCount();
  const color = rgb(0.58, 0.58, 0.58);
  const ruleColor = rgb(0.82, 0.9, 0.87);
  const fontSize = 8;
  // Sits inside the page's bottom margin (see @page in App.styles.ts), so the
  // rule is drawn under the text block instead of across its last line.
  const y = 20;

  pdf.getPages().forEach((page, index) => {
    if (index < skipPages) {
      return;
    }

    const { width } = page.getSize();
    const footerLabel = footerLabels[index - skipPages] ?? '';
    const label = `${index + 1} / ${totalPages}`;
    const leftX = 52;
    const rightX = width - 52 - font.widthOfTextAtSize(label, fontSize);

    page.drawLine({
      start: { x: leftX, y: y + 14 },
      end: { x: width - 52, y: y + 14 },
      thickness: 0.6,
      color: ruleColor,
    });

    if (footerLabel) {
      page.drawText(footerLabel, {
        x: leftX,
        y,
        size: fontSize,
        font,
        color,
      });
    }

    page.drawText(label, {
      x: rightX,
      y,
      size: fontSize,
      font,
      color,
    });
  });
};

const copyPdfWithFooters = async (sourcePdf, outputPdf, footerLabels) => {
  const output = await PDFDocument.create();
  const source = await PDFDocument.load(readFileSync(sourcePdf));
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach((page) => output.addPage(page));

  await drawSubmissionFooters(output, { footerLabels });

  writeFileSync(outputPdf, await output.save());
};

const createPortfolioPdf = async () => {
  const output = await PDFDocument.create();

  for (const sourcePdf of [portfolioCoverPdf, portfolioPdf]) {
    const source = await PDFDocument.load(readFileSync(sourcePdf));
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }

  await drawSubmissionFooters(output, {
    footerLabels: portfolioFooterLabels,
    skipPages: 1,
  });

  writeFileSync(portfolioOutputPdf, await output.save());
};

const mergePdfs = async (cvFooterLabels) => {
  const mergedPdf = await PDFDocument.create();

  for (const sourcePdf of [coverPdf, cvPdf, portfolioPdf]) {
    const pdf = await PDFDocument.load(readFileSync(sourcePdf));
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  await drawSubmissionFooters(mergedPdf, {
    footerLabels: [...cvFooterLabels, ...portfolioFooterLabels],
    skipPages: 1,
  });

  writeFileSync(combinedOutputPdf, await mergedPdf.save());
};

run('node', ['scripts/build-case-study-pdf.mjs'], {
  env: { ...process.env, CASE_STUDY_PDF_OUT: portfolioPdf },
});

run('pnpm', ['build']);

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
  printPdf(url, cvPdf);
  const cvPageCount = await getPdfPageCount(cvPdf);
  const portfolioPageCount = await getPdfPageCount(portfolioPdf);
  const cvFooterLabels = createCvFooterLabels(cvPageCount);
  const totalPages = 1 + cvPageCount + portfolioPageCount;
  const portfolioTotalPages = 1 + portfolioPageCount;

  createCoverHtml(totalPages);
  createPortfolioCoverHtml(portfolioTotalPages);
  printPdf(pathToFileURL(coverHtml).href, coverPdf);
  printPdf(pathToFileURL(portfolioCoverHtml).href, portfolioCoverPdf);
  await copyPdfWithFooters(cvPdf, cvOutputPdf, cvFooterLabels);
  await createPortfolioPdf();
  await mergePdfs(cvFooterLabels);
  console.log(`Wrote ${combinedOutputPdf}`);
  console.log(`Wrote ${cvOutputPdf}`);
  console.log(`Wrote ${portfolioOutputPdf}`);
} finally {
  server.kill('SIGTERM');
}

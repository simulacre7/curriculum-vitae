import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const submissionDir = resolve(root, 'submission');
const tempDir = resolve(root, '.tmp-submission');
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

const printPdf = () => {
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
      `--print-to-pdf=${cvPdf}`,
      url,
    ],
    { stdio: 'inherit' }
  );
};

const drawCoverPage = async (pdf) => {
  const page = pdf.addPage([594.96, 841.92]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const green = rgb(0.243, 0.706, 0.537);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.36, 0.36, 0.36);

  page.drawText('CURRICULUM VITAE + PORTFOLIO', {
    x: 52,
    y: 710,
    size: 10,
    font: boldFont,
    color: green,
  });

  page.drawText('Kihwan Kim', {
    x: 52,
    y: 650,
    size: 34,
    font: boldFont,
    color: black,
  });

  page.drawText('Frontend Engineer', {
    x: 52,
    y: 615,
    size: 17,
    font,
    color: black,
  });

  page.drawText('Submission package containing CV and selected frontend engineering case studies.', {
    x: 52,
    y: 570,
    size: 11,
    font,
    color: gray,
  });

  page.drawLine({
    start: { x: 52, y: 505 },
    end: { x: 542, y: 505 },
    thickness: 1,
    color: rgb(0.82, 0.9, 0.87),
  });

  const sections = [
    ['01', 'Curriculum Vitae', 'Experience, projects, education, and publications'],
    ['02', 'Portfolio Case Studies', 'PageAgent automation, RiGrid Server Driven UI, and rendering performance'],
  ];

  sections.forEach(([number, title, description], index) => {
    const y = 455 - index * 72;
    page.drawText(number, {
      x: 52,
      y,
      size: 11,
      font: boldFont,
      color: green,
    });
    page.drawText(title, {
      x: 96,
      y,
      size: 14,
      font: boldFont,
      color: black,
    });
    page.drawText(description, {
      x: 96,
      y: y - 22,
      size: 10,
      font,
      color: gray,
    });
  });

  page.drawText('kihwan.kim', {
    x: 52,
    y: 92,
    size: 10,
    font,
    color: gray,
  });
};

const drawPageNumbers = async (pdf) => {
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pdf.getPageCount();

  pdf.getPages().forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${totalPages}`;
    page.drawText(label, {
      x: width - 52 - font.widthOfTextAtSize(label, 8),
      y: 28,
      size: 8,
      font,
      color: rgb(0.58, 0.58, 0.58),
    });
  });
};

const mergePdfs = async () => {
  const mergedPdf = await PDFDocument.create();

  await drawCoverPage(mergedPdf);

  for (const sourcePdf of [cvPdf, portfolioPdf]) {
    const pdf = await PDFDocument.load(readFileSync(sourcePdf));
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  await drawPageNumbers(mergedPdf);

  writeFileSync(outputPdf, await mergedPdf.save());
};

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
  printPdf();
  await mergePdfs();
  console.log(`Wrote ${outputPdf}`);
} finally {
  server.kill('SIGTERM');
}

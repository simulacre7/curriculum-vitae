// English CV PDF for submissions (submission/en/KihwanKim_CV_EN.pdf).
// Prints the site's /en route the same way build-submission-pdf.mjs prints
// /ko, then stamps the same page-number footers.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const submissionDir = resolve(root, 'submission', 'en');
const tempDir = resolve(root, '.tmp-submission');
const cvPdf = resolve(tempDir, 'KihwanKim_CV_EN.pdf');
const cvOutputPdf = resolve(submissionDir, 'KihwanKim_CV_EN.pdf');
const port = Number(process.env.CV_PDF_PORT ?? 4178);
const url = `http://127.0.0.1:${port}/en`;

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

const drawFooters = async (pdf) => {
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pdf.getPageCount();
  const color = rgb(0.58, 0.58, 0.58);
  const ruleColor = rgb(0.82, 0.9, 0.87);
  const fontSize = 8;
  // Sits inside the page's bottom margin (see @page in App.styles.ts), so the
  // rule is drawn under the text block instead of across its last line.
  const y = 20;

  pdf.getPages().forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${totalPages}`;
    const leftX = 52;
    const rightX = width - 52 - font.widthOfTextAtSize(label, fontSize);

    page.drawLine({
      start: { x: leftX, y: y + 14 },
      end: { x: width - 52, y: y + 14 },
      thickness: 0.6,
      color: ruleColor,
    });

    page.drawText(label, {
      x: rightX,
      y,
      size: fontSize,
      font,
      color,
    });
  });
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
  printPdf(url, cvPdf);

  const output = await PDFDocument.create();
  const source = await PDFDocument.load(readFileSync(cvPdf));
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach((page) => output.addPage(page));
  await drawFooters(output);
  writeFileSync(cvOutputPdf, await output.save());

  console.log(`Wrote ${cvOutputPdf}`);
} finally {
  server.kill('SIGTERM');
}

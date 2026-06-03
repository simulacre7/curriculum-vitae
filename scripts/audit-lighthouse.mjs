import { execFileSync } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { root, startPreviewServer } from './audit-utils.mjs';

const routes = [
  { name: 'cv-ko', path: '/ko/' },
  { name: 'cv-en', path: '/en/' },
  { name: 'bash-ko', path: '/bash/ko/' },
];

const outputDir = path.join(root, '.tmp-audit', 'lighthouse');
const lighthouseBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse'
);

const formatScore = (score) => `${Math.round(score * 100)}`;
const ignoredAccessibilityAudits = new Set(['color-contrast']);

const getFailingAuditIds = (report, categoryId, ignoredAuditIds = new Set()) =>
  report.categories[categoryId].auditRefs
    .map((auditRef) => auditRef.id)
    .filter((auditId) => {
      const score = report.audits[auditId]?.score;
      return score !== null && score < 1 && !ignoredAuditIds.has(auditId);
    });

await mkdir(outputDir, { recursive: true });

const preview = await startPreviewServer();
const warnings = [];

try {
  for (const route of routes) {
    const url = `${preview.baseUrl}${route.path}`;
    const outputPath = path.join(outputDir, `${route.name}.json`);

    execFileSync(
      lighthouseBin,
      [
        url,
        '--quiet',
        '--preset=desktop',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--output=json',
        `--output-path=${outputPath}`,
        '--chrome-flags=--headless=new --no-sandbox',
      ],
      { cwd: root, stdio: 'inherit' }
    );

    const report = JSON.parse(await readFile(outputPath, 'utf8'));
    const scores = {
      performance: report.categories.performance.score,
      accessibility: report.categories.accessibility.score,
      bestPractices: report.categories['best-practices'].score,
      seo: report.categories.seo.score,
    };

    console.log(
      [
        `[${route.name}]`,
        `performance=${formatScore(scores.performance)}`,
        `accessibility=${formatScore(scores.accessibility)}`,
        `best-practices=${formatScore(scores.bestPractices)}`,
        `seo=${formatScore(scores.seo)}`,
      ].join(' ')
    );

    if (scores.performance < 0.7) {
      warnings.push(`${route.name} Lighthouse performance is below 70.`);
    }
    const accessibilityFailures = getFailingAuditIds(
      report,
      'accessibility',
      ignoredAccessibilityAudits
    );

    if (scores.accessibility < 0.85 && accessibilityFailures.length > 0) {
      warnings.push(
        `${route.name} Lighthouse accessibility is below 85: ${accessibilityFailures.join(', ')}.`
      );
    }
    if (scores.bestPractices < 0.85) {
      warnings.push(`${route.name} Lighthouse best-practices is below 85.`);
    }
    if (scores.seo < 0.8) {
      warnings.push(`${route.name} Lighthouse SEO is below 80.`);
    }
  }
} finally {
  await preview.stop();
}

if (warnings.length > 0) {
  console.warn('\nLighthouse warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
  console.warn('Set LIGHTHOUSE_STRICT=1 to fail on these warnings.');

  if (process.env.LIGHTHOUSE_STRICT === '1') {
    process.exit(1);
  }
}

console.log(
  `\nLighthouse JSON reports written to ${path.relative(root, outputDir)}.`
);

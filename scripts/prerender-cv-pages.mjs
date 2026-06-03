import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST_DIR = path.resolve('dist');
const SERVER_ENTRY = path.resolve('.tmp-ssr/entry-server.js');

const pages = [
  { output: 'index.html', path: '/', language: 'ko' },
  { output: 'ko/index.html', path: '/ko', language: 'ko' },
  { output: 'en/index.html', path: '/en', language: 'en' },
];

const { render } = await import(pathToFileURL(SERVER_ENTRY).href);

await Promise.all(
  pages.map(async (page) => {
    const outputPath = path.join(DIST_DIR, page.output);
    const template = await readFile(outputPath, 'utf8');
    const appHtml = await render(page.path, page.language);
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    await writeFile(outputPath, html);
  })
);

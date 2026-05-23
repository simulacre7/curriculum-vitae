import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://kihwan.kim';
const DIST_DIR = path.resolve('dist');

const pages = [
  {
    output: 'index.html',
    lang: 'ko',
    path: '/',
    title: '김기환 | CV',
    description:
      '프론트엔드 플랫폼, 제품 경험, 연구 기반 UI를 다루는 소프트웨어 엔지니어 김기환의 CV입니다.',
    image: '/og/cv-ko.png',
    alternates: [
      { lang: 'x-default', path: '/' },
      { lang: 'ko', path: '/ko' },
      { lang: 'en', path: '/en' },
    ],
  },
  {
    output: 'ko/index.html',
    lang: 'ko',
    path: '/ko',
    title: '김기환 | CV',
    description:
      '프론트엔드 플랫폼, 제품 경험, 연구 기반 UI를 다루는 소프트웨어 엔지니어 김기환의 CV입니다.',
    image: '/og/cv-ko.png',
    alternates: [
      { lang: 'x-default', path: '/' },
      { lang: 'ko', path: '/ko' },
      { lang: 'en', path: '/en' },
    ],
  },
  {
    output: 'en/index.html',
    lang: 'en',
    path: '/en',
    title: 'Kihwan Kim | Curriculum Vitae',
    description:
      'Curriculum vitae of Kihwan Kim, a software engineer focused on frontend platforms, product experience, and research-informed UI.',
    image: '/og/cv-en.png',
    alternates: [
      { lang: 'x-default', path: '/' },
      { lang: 'ko', path: '/ko' },
      { lang: 'en', path: '/en' },
    ],
  },
  {
    output: 'bash/index.html',
    lang: 'ko',
    path: '/bash',
    title: '김기환 | Terminal CV',
    description:
      '짧은 명령어로 김기환의 경력, Agent/Generative UI 작업, 기술 스택과 연구를 탐색하는 터미널형 CV입니다.',
    image: '/og/bash-ko.png',
    alternates: [
      { lang: 'x-default', path: '/bash' },
      { lang: 'ko', path: '/bash/ko' },
      { lang: 'en', path: '/bash/en' },
    ],
  },
  {
    output: 'bash/ko/index.html',
    lang: 'ko',
    path: '/bash/ko',
    title: '김기환 | Terminal CV',
    description:
      '짧은 명령어로 김기환의 경력, Agent/Generative UI 작업, 기술 스택과 연구를 탐색하는 터미널형 CV입니다.',
    image: '/og/bash-ko.png',
    alternates: [
      { lang: 'x-default', path: '/bash' },
      { lang: 'ko', path: '/bash/ko' },
      { lang: 'en', path: '/bash/en' },
    ],
  },
  {
    output: 'bash/en/index.html',
    lang: 'en',
    path: '/bash/en',
    title: 'Kihwan Kim | Terminal CV',
    description:
      'Explore Kihwan Kim’s career, agent/generative UI work, stack, and research through a terminal-shaped CV.',
    image: '/og/bash-en.png',
    alternates: [
      { lang: 'x-default', path: '/bash' },
      { lang: 'ko', path: '/bash/ko' },
      { lang: 'en', path: '/bash/en' },
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const absoluteUrl = (pathname) => new URL(pathname, SITE_URL).toString();

const metaFor = (page) => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = absoluteUrl(page.path);
  const image = absoluteUrl(page.image);
  const alternates = page.alternates
    .map(
      (alternate) =>
        `    <link rel="alternate" hreflang="${alternate.lang}" href="${absoluteUrl(
          alternate.path
        )}" />`
    )
    .join('\n');

  return [
    `    <html lang="${page.lang}">`,
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <link rel="canonical" href="${url}" />`,
    alternates,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="kihwan.kim" />`,
    `    <meta property="og:locale" content="${page.lang === 'ko' ? 'ko_KR' : 'en_US'}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${image}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${image}" />`,
  ].join('\n');
};

const applyMeta = (html, page) => {
  const withoutBaseMeta = html
    .replace(/\s*<title>.*?<\/title>/s, '')
    .replace(/\s*<meta name="description" content=".*?" \/>/s, '');
  const withLang = withoutBaseMeta.replace(
    /<html[^>]*>/,
    `<html lang="${page.lang}">`
  );
  return withLang.replace(
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n${metaFor(
      page
    )
      .split('\n')
      .filter((line) => !line.startsWith('    <html'))
      .join('\n')}`
  );
};

const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf8');

await Promise.all(
  pages.map(async (page) => {
    const outputPath = path.join(DIST_DIR, page.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, applyMeta(template, page));
  })
);

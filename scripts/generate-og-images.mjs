import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('public/og');
const WIDTH = 1200;
const HEIGHT = 630;

const fontStack =
  'Inter, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", Arial, sans-serif';
const monoStack =
  '"SFMono-Regular", "SF Mono", "JetBrains Mono", "Noto Sans Mono CJK KR", Consolas, monospace';

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const text = (value, attrs = {}) => {
  const attr = Object.entries(attrs)
    .map(([key, attrValue]) => `${key}="${escapeHtml(String(attrValue))}"`)
    .join(' ');
  return `<text ${attr}>${escapeHtml(value)}</text>`;
};

const shellDots = `
  <circle cx="124" cy="110" r="9" fill="#ff5f57" />
  <circle cx="154" cy="110" r="9" fill="#ffbd2e" />
  <circle cx="184" cy="110" r="9" fill="#28c840" />
`;

const shellCard = (children) => `
  <rect x="72" y="64" width="1056" height="502" rx="16" fill="#020807" stroke="#2a3a31" />
  ${shellDots}
  ${children}
`;

const baseSvg = (children) => `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="22%" cy="10%" r="84%">
      <stop offset="0%" stop-color="#0a3a1f" />
      <stop offset="58%" stop-color="#020807" />
      <stop offset="100%" stop-color="#160b12" />
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  ${children}
</svg>
`;

const makeCvSvg = ({ heading, name, role, focus }) =>
  baseSvg(
    shellCard(`
      ${text(heading, {
        x: 116,
        y: 195,
        fill: '#7effa5',
        'font-family': monoStack,
        'font-size': 31,
        'font-weight': 600,
      })}
      ${text(name, {
        x: 116,
        y: 318,
        fill: '#eef8ef',
        'font-family': fontStack,
        'font-size': 74,
        'font-weight': 800,
      })}
      ${text(role, {
        x: 116,
        y: 379,
        fill: '#dbe8dc',
        'font-family': monoStack,
        'font-size': 38,
        'font-weight': 600,
      })}
      ${text(focus, {
        x: 116,
        y: 451,
        fill: '#b8c7bb',
        'font-family': fontStack,
        'font-size': 29,
        'font-weight': 700,
      })}
    `)
  );

const makeBashSvg = ({ name, label, command, description }) =>
  baseSvg(
    shellCard(`
      ${text('kihwan.kim/bash', {
        x: 116,
        y: 195,
        fill: '#7effa5',
        'font-family': monoStack,
        'font-size': 31,
        'font-weight': 600,
      })}
      ${text(name, {
        x: 116,
        y: 315,
        fill: '#eef8ef',
        'font-family': fontStack,
        'font-size': 74,
        'font-weight': 850,
      })}
      ${text(label, {
        x: 116,
        y: 373,
        fill: '#b8c7bb',
        'font-family': monoStack,
        'font-size': 35,
        'font-weight': 700,
      })}
      ${text(command, {
        x: 116,
        y: 452,
        fill: '#e2efe4',
        'font-family': monoStack,
        'font-size': 36,
        'font-weight': 700,
      })}
      ${text(description, {
        x: 116,
        y: 524,
        fill: '#b8c7bb',
        'font-family': fontStack,
        'font-size': 29,
        'font-weight': 700,
      })}
    `)
  );

const images = [
  [
    'cv-ko.png',
    makeCvSvg({
      heading: 'Curriculum Vitae',
      name: '김기환',
      role: 'Software Engineer',
      focus: 'Human-System Interaction · Experimentation · AI-Native Workflows',
    }),
  ],
  [
    'cv-en.png',
    makeCvSvg({
      heading: 'Curriculum Vitae',
      name: 'Kihwan Kim',
      role: 'Software Engineer',
      focus: 'Human-System Interaction · Experimentation · AI-Native Workflows',
    }),
  ],
  [
    'bash-ko.png',
    makeBashSvg({
      name: '김기환',
      label: 'Terminal CV',
      command: '$ about · projects · themes · papers',
      description: '경력, 프로젝트, 연구, 반복되는 관심사 탐색하기',
    }),
  ],
  [
    'bash-en.png',
    makeBashSvg({
      name: 'Kihwan Kim',
      label: 'Terminal CV',
      command: '$ about · projects · themes · papers',
      description: 'Explore career, projects, research, and recurring themes',
    }),
  ],
];

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  images.map(([fileName, svg]) =>
    sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, fileName))
  )
);

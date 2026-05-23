import { Global } from '@emotion/react';
import { Bash } from 'just-bash/browser';
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as styles from './BashResume.styles';

type ResumeData = {
  name: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    summary: string;
    projects?: {
      title: string;
      period: string;
      summary?: string;
      details?: string[];
    }[];
    stack?: string[];
  }[];
  education: unknown[];
  publications: unknown[];
};

type TerminalLine = {
  id: number;
  text: string;
  kind?: 'command' | 'stderr' | 'system';
};

const HOME = '/home/kihwan';
const INITIAL_COMMANDS = [
  'about',
  'work',
  'agent',
  'stack',
  'papers',
  'contact',
];

const intro = [
  'Kihwan Kim / terminal resume',
  '',
  '짧은 명령어로 이력서를 탐색할 수 있습니다.',
  '  about    한 줄 소개와 현재 관심사',
  '  work     주요 경력 요약',
  '  agent    브라우저 에이전트/Generative UI 작업',
  '  stack    자주 쓰는 기술',
  '  papers   연구와 논문',
  '  contact  연락처',
  '',
  '더 보고 싶으면 `guide`를 입력하세요.',
  '',
];

const makeMarkdown = (resume: ResumeData, locale: 'ko' | 'en') => {
  const lines = [
    `# ${resume.name}`,
    '',
    resume.summary,
    '',
    '## Experience',
    ...resume.experience.flatMap((item) => [
      '',
      `### ${item.company}`,
      `${item.role} · ${item.period}`,
      '',
      item.summary,
      '',
      ...(item.projects ?? []).flatMap((project) => [
        `- ${project.title} (${project.period})`,
        project.summary ? `  - ${project.summary}` : '',
        ...(project.details ?? []).map((detail) => `  - ${detail}`),
      ]),
      item.stack?.length ? `- stack: ${item.stack.join(', ')}` : '',
    ]),
  ];

  return lines.filter(Boolean).join('\n') + `\n\n<!-- locale: ${locale} -->\n`;
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const companyFileName = (company: string, index: number) => {
  if (company.includes('리디')) return 'ridi';
  if (company.includes('티맥스')) return 'tmaxenterprise';
  return slug(company) || `company-${index + 1}`;
};

const makeExperienceFile = (item: ResumeData['experience'][number]) => {
  const projects = item.projects?.flatMap((project) => [
    `## ${project.title}`,
    `${project.period}`,
    '',
    project.summary ?? '',
    '',
    ...(project.details ?? []).map((detail) => `- ${detail}`),
    '',
  ]);

  return [
    `# ${item.company}`,
    `${item.role} · ${item.period}`,
    '',
    item.summary,
    '',
    ...(projects ?? []),
    item.stack?.length ? `stack=${item.stack.join(',')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};

const makeFiles = (ko: ResumeData, en: ResumeData) => {
  const files: Record<string, string> = {
    [`${HOME}/README.md`]: [
      '# /home/kihwan',
      '',
      'This is a terminal-shaped resume.',
      '',
      'Try:',
      ...INITIAL_COMMANDS.map((command) => `  ${command}`),
      '',
      'Filesystem map:',
      '  resume/ko.json       Korean source data',
      '  resume/en.json       English source data',
      '  resume/full.ko.md    Korean markdown resume',
      '  resume/full.en.md    English markdown resume',
      '  resume/experience/   Company notes',
      '  contact.txt          Links',
    ].join('\n'),
    [`${HOME}/contact.txt`]: [
      'email    mailto:juljin1875@gmail.com',
      'linkedin https://www.linkedin.com/in/1875/',
      'github   https://github.com/simulacre7/',
      'web      https://kihwan.kim',
    ].join('\n'),
    [`${HOME}/resume/ko.json`]: JSON.stringify(ko, null, 2),
    [`${HOME}/resume/en.json`]: JSON.stringify(en, null, 2),
    [`${HOME}/resume/full.ko.md`]: makeMarkdown(ko, 'ko'),
    [`${HOME}/resume/full.en.md`]: makeMarkdown(en, 'en'),
    [`${HOME}/resume/publications.json`]: JSON.stringify(ko.publications, null, 2),
    [`${HOME}/resume/education.json`]: JSON.stringify(ko.education, null, 2),
  };

  ko.experience.forEach((item, index) => {
    files[`${HOME}/resume/experience/${companyFileName(item.company, index)}.md`] =
      makeExperienceFile(item);
  });

  return files;
};

const normalizeCdPath = (cwd: string, target: string) => {
  if (!target || target === '~') return HOME;
  const base = target.startsWith('/') ? target : `${cwd}/${target}`;
  const parts: string[] = [];

  for (const part of base.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
    } else {
      parts.push(part);
    }
  }

  return `/${parts.join('/')}`;
};

const shellQuote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`;

const prompt = (cwd: string) =>
  `kihwan@cv:${cwd.replace(HOME, '~') || '/'}$`;

const formatList = (items: string[], prefix = '- ') =>
  items.map((item) => `${prefix}${item}`).join('\n');

const getProjectText = (
  resume: ResumeData,
  matcher: (project: NonNullable<ResumeData['experience'][number]['projects']>[number]) => boolean
) => {
  const matches = resume.experience.flatMap((job) =>
    (job.projects ?? [])
      .filter(matcher)
      .map((project) => ({ company: job.company, project }))
  );

  if (!matches.length) return '관련 프로젝트를 찾지 못했습니다.';

  return matches
    .map(({ company, project }) =>
      [
        `${project.title} / ${company}`,
        project.period,
        project.summary ?? '',
        project.details?.length ? formatList(project.details) : '',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n');
};

const getCommandOutput = (command: string, resume: ResumeData) => {
  switch (command) {
    case 'about':
      return [
        `${resume.name}`,
        '',
        resume.summary,
        '',
        'focus: Agentic UI, Browser Agent, Server-Driven UI, frontend architecture',
      ].join('\n');
    case 'work':
      return resume.experience
        .map((item) =>
          [
            `${item.company} / ${item.role} / ${item.period}`,
            item.summary,
            item.projects?.length
              ? formatList(item.projects.map((project) => project.title), '  - ')
              : '',
          ]
            .filter(Boolean)
            .join('\n')
        )
        .join('\n\n');
    case 'agent':
      return getProjectText(resume, (project) =>
        /agent|generative|pageagent|자동화/i.test(
          `${project.title} ${project.summary ?? ''}`
        )
      );
    case 'stack': {
      const stack = Array.from(
        new Set(resume.experience.flatMap((item) => item.stack ?? []))
      );
      return stack.join('  ');
    }
    case 'papers':
      return resume.publications
        .map((publication) => {
          const item = publication as {
            title: string;
            conference: string;
            points?: string[];
          };

          return [
            item.title,
            item.conference,
            item.points?.[0] ? `- ${item.points[0]}` : '',
          ]
            .filter(Boolean)
            .join('\n');
        })
        .join('\n\n');
    case 'contact':
      return [
        'email    juljin1875@gmail.com',
        'linkedin https://www.linkedin.com/in/1875/',
        'github   https://github.com/simulacre7/',
        'web      https://kihwan.kim',
      ].join('\n');
    case 'guide':
    case 'help':
      return [
        '읽기 좋은 명령어',
        '  about    소개',
        '  work     경력',
        '  agent    에이전트/생성형 UI 프로젝트',
        '  stack    기술 스택',
        '  papers   연구/논문',
        '  contact  연락처',
        '',
        '숨은 파일시스템도 있습니다.',
        '  ls',
        '  cat README.md',
        '  tree resume',
        '  grep -R "Agent" resume',
        '',
        'clear로 화면을 비울 수 있습니다.',
      ].join('\n');
    default:
      return null;
  }
};

export function BashResume() {
  const [bash, setBash] = useState<Bash | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [cwd, setCwd] = useState(HOME);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>(
    intro.map((text, index) => ({ id: index, text, kind: 'system' }))
  );
  const [isRunning, setIsRunning] = useState(true);
  const nextId = useRef(intro.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const didMountFilesystem = useRef(false);

  const sampleCommands = useMemo(() => INITIAL_COMMANDS, []);

  const appendLine = (text: string, kind?: TerminalLine['kind']) => {
    setLines((prev) => [...prev, { id: nextId.current++, text, kind }]);
  };

  const appendBlock = (text: string, kind?: TerminalLine['kind']) => {
    const normalized = text.endsWith('\n') ? text.slice(0, -1) : text;
    for (const row of normalized.split('\n')) {
      appendLine(row, kind);
    }
  };

  useEffect(() => {
    if (didMountFilesystem.current) return;
    didMountFilesystem.current = true;

    const load = async () => {
      const [ko, en] = await Promise.all([
        fetch('/locales/ko/common.json').then((res) => res.json()),
        fetch('/locales/en/common.json').then((res) => res.json()),
      ]);

      setResume(ko);
      setBash(
        new Bash({
          cwd: HOME,
          env: {
            HOME,
            USER: 'kihwan',
            SHELL: '/bin/just-bash',
            LANG: 'ko_KR.UTF-8',
          },
          files: makeFiles(ko, en),
        })
      );
      setIsRunning(false);
      appendLine('ready. try `about` first.', 'system');
    };

    void load().catch((error) => {
      setIsRunning(false);
      appendLine(`failed to mount resume: ${String(error)}`, 'stderr');
    });
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lines]);

  const runCommand = async (rawCommand: string) => {
    const command = rawCommand.trim();
    appendLine(`${prompt(cwd)} ${rawCommand}`, 'command');

    if (!command) return;
    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (resume) {
      const commandOutput = getCommandOutput(command, resume);
      if (commandOutput) {
        appendBlock(commandOutput);
        return;
      }
    }

    if (command === 'help' || command === 'guide') {
      appendLine('resume data is still mounting', 'stderr');
      return;
    }

    if (!bash) {
      appendLine('resume filesystem is still mounting', 'stderr');
      return;
    }

    if (/^cd(?:\s|$)/.test(command)) {
      const target = command.split(/\s+/)[1] ?? HOME;
      const nextCwd = normalizeCdPath(cwd, target);
      const result = await bash.exec(`test -d ${shellQuote(nextCwd)}`, { cwd });

      if (result.exitCode === 0) {
        setCwd(nextCwd);
      } else {
        appendLine(`cd: no such directory: ${target}`, 'stderr');
      }
      return;
    }

    try {
      setIsRunning(true);
      const result = await bash.exec(command, { cwd });

      if (result.stdout) appendBlock(result.stdout);
      if (result.stderr) appendBlock(result.stderr, 'stderr');
    } catch (error) {
      appendLine(String(error), 'stderr');
    } finally {
      setIsRunning(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const command = input;
    setInput('');
    setHistory((prev) => (command.trim() ? [...prev, command] : prev));
    setHistoryIndex(null);
    void runCommand(command);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHistoryIndex((current) => {
        const next = current === null ? history.length - 1 : current - 1;
        const bounded = Math.max(0, next);
        setInput(history[bounded] ?? '');
        return bounded;
      });
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHistoryIndex((current) => {
        if (current === null) return null;
        const next = current + 1;
        if (next >= history.length) {
          setInput('');
          return null;
        }
        setInput(history[next] ?? '');
        return next;
      });
    }
  };

  return (
    <>
      <Global styles={styles.globalStyles} />
      <main css={styles.screenStyle}>
        <section
          css={styles.terminalStyle}
          onClick={() => inputRef.current?.focus()}
        >
          <header css={styles.titleBarStyle}>
            <div css={styles.trafficLightsStyle} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div css={styles.titleStyle}>kihwan.kim/bash</div>
            <nav css={styles.toolbarStyle} aria-label="quick commands">
              {sampleCommands.slice(0, 3).map((command) => (
                <button
                  key={command}
                  type="button"
                  title={command}
                  onClick={(event) => {
                    event.stopPropagation();
                    void runCommand(command);
                  }}
                >
                  {command.split(' ')[0]}
                </button>
              ))}
            </nav>
          </header>
          <div ref={bodyRef} css={styles.bodyStyle}>
            <pre css={styles.outputStyle} aria-live="polite">
              {lines.map(({ id, text, kind }) => (
                <div
                  key={id}
                  css={[
                    styles.lineStyle,
                    kind === 'command' && styles.commandStyle,
                    kind === 'stderr' && styles.stderrStyle,
                    kind === 'system' && styles.systemStyle,
                  ]}
                >
                  {text || ' '}
                </div>
              ))}
            </pre>
            <form css={styles.promptRowStyle} onSubmit={onSubmit}>
              <label css={styles.promptStyle} htmlFor="bash-resume-input">
                {isRunning ? '...' : prompt(cwd)}
              </label>
              <input
                ref={inputRef}
                id="bash-resume-input"
                css={styles.inputStyle}
                value={input}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
              />
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

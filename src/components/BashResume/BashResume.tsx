import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Global } from '@emotion/react';
import { Bash } from 'just-bash/browser';

import * as styles from './BashResume.styles';
import i18n, {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from '../../i18n';

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
  text?: string;
  segments?: TerminalSegment[];
  kind?: 'command' | 'stderr' | 'system' | 'bullet';
};

type TerminalSegment = {
  text: string;
  kind?: 'label' | 'link' | 'title' | 'meta' | 'muted';
  href?: string;
};

type TerminalLineDraft = Omit<TerminalLine, 'id'>;

type CommandOutput = string | TerminalLineDraft[];

type ResumeMap = Record<SupportedLanguage, ResumeData>;

const HOME = '/home/kihwan';
const TERMINAL_CV_PDF_URL =
  'https://kihwan.kim/downloads/kihwan-kim-terminal-cv.pdf';
const TERMINAL_CV_EN_PDF_URL =
  'https://kihwan.kim/downloads/kihwan-kim-terminal-cv-en.pdf';
const INITIAL_COMMANDS = [
  'about',
  'work',
  'projects',
  'stack',
  'papers',
  'contact',
];
const CONTACT_ITEMS = [
  {
    label: 'email',
    value: 'juljin1875@gmail.com',
    href: 'mailto:juljin1875@gmail.com',
  },
  {
    label: 'linkedin',
    value: 'https://www.linkedin.com/in/1875/',
    href: 'https://www.linkedin.com/in/1875/',
  },
  {
    label: 'github',
    value: 'https://github.com/simulacre7/',
    href: 'https://github.com/simulacre7/',
  },
  { label: 'web', value: 'https://kihwan.kim', href: 'https://kihwan.kim' },
  { label: 'pdf ko', value: TERMINAL_CV_PDF_URL, href: TERMINAL_CV_PDF_URL },
  {
    label: 'pdf en',
    value: TERMINAL_CV_EN_PDF_URL,
    href: TERMINAL_CV_EN_PDF_URL,
  },
];

const isSupportedLanguage = (
  value: string | null
): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.some((language) => language === value);

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const pathname = window.location.pathname;
  if (pathname === '/bash/en' || pathname.startsWith('/bash/en/')) return 'en';
  if (pathname === '/bash/ko' || pathname.startsWith('/bash/ko/')) return 'ko';

  const queryLanguage = new URLSearchParams(window.location.search).get('lng');
  if (isSupportedLanguage(queryLanguage)) return queryLanguage;

  return DEFAULT_LANGUAGE;
};

const copy = {
  ko: {
    intro: [
      'Kihwan Kim / terminal CV',
      '',
      '짧은 명령어로 CV를 탐색할 수 있습니다.',
      '  about    소개',
      '  work     경력',
      '  projects 프로젝트',
      '  stack    기술',
      '  papers   연구',
      '  contact  연락처',
      '',
      '더 보고 싶으면 `guide`를 입력하세요.',
      '언어 변경: `lang en`',
      '',
    ],
    ready: 'ready. try `about` first.',
    noProject: '관련 프로젝트를 찾지 못했습니다.',
    focus:
      'focus: Agentic UI, Browser Agent, Server-Driven UI, frontend architecture',
    guide: [
      '읽기 좋은 명령어',
      '  about    소개',
      '  work     경력',
      '  projects 주요 프로젝트',
      '  stack    기술 스택',
      '  papers   연구/논문',
      '  contact  연락처',
      '  pdf      PDF 다운로드',
      '  pdf en   영문 PDF 다운로드',
      '  lang     현재 언어',
      '  lang en  영어로 전환',
      '  lang ko  한국어로 전환',
      '',
      '숨은 파일시스템도 있습니다.',
      '  ls',
      '  cat README.md',
      '  tree resume',
      '  grep -R "React" resume',
      '',
      'clear로 화면을 비울 수 있습니다.',
    ],
    currentLanguage: '현재 언어: 한국어',
    languageChanged: '언어를 한국어로 전환했습니다.',
    unsupportedLanguage:
      '지원하지 않는 언어입니다. `lang ko` 또는 `lang en`을 사용하세요.',
    mounting: 'resume data is still mounting',
  },
  en: {
    intro: [
      'Kihwan Kim / terminal CV',
      '',
      'Explore this CV with short commands.',
      '  about    profile',
      '  work     career',
      '  projects projects',
      '  stack    tools',
      '  papers   research',
      '  contact  links',
      '',
      'Type `guide` for more.',
      'Switch language: `lang ko`',
      '',
    ],
    ready: 'ready. try `about` first.',
    noProject: 'No matching project found.',
    focus:
      'focus: Agentic UI, Browser Agent, Server-Driven UI, frontend architecture',
    guide: [
      'Readable commands',
      '  about    profile',
      '  work     career',
      '  projects project highlights',
      '  stack    stack',
      '  papers   research',
      '  contact  links',
      '  pdf      download PDF',
      '  pdf ko   download Korean PDF',
      '  lang     current language',
      '  lang en  switch to English',
      '  lang ko  switch to Korean',
      '',
      'There is also a hidden filesystem.',
      '  ls',
      '  cat README.md',
      '  tree resume',
      '  grep -R "React" resume',
      '',
      'Use clear to reset the screen.',
    ],
    currentLanguage: 'current language: English',
    languageChanged: 'Switched language to English.',
    unsupportedLanguage: 'Unsupported language. Use `lang ko` or `lang en`.',
    mounting: 'resume data is still mounting',
  },
} satisfies Record<SupportedLanguage, Record<string, string | string[]>>;

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
      'This is a terminal-shaped CV.',
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
      '  terminal-cv.pdf      Korean static PDF export',
      '  terminal-cv.en.pdf   English static PDF export',
    ].join('\n'),
    [`${HOME}/contact.txt`]: [
      'email    mailto:juljin1875@gmail.com',
      'linkedin https://www.linkedin.com/in/1875/',
      'github   https://github.com/simulacre7/',
      'web      https://kihwan.kim',
      `pdf ko   ${TERMINAL_CV_PDF_URL}`,
      `pdf en   ${TERMINAL_CV_EN_PDF_URL}`,
    ].join('\n'),
    [`${HOME}/terminal-cv.pdf`]: TERMINAL_CV_PDF_URL,
    [`${HOME}/terminal-cv.en.pdf`]: TERMINAL_CV_EN_PDF_URL,
    [`${HOME}/resume/ko.json`]: JSON.stringify(ko, null, 2),
    [`${HOME}/resume/en.json`]: JSON.stringify(en, null, 2),
    [`${HOME}/resume/full.ko.md`]: makeMarkdown(ko, 'ko'),
    [`${HOME}/resume/full.en.md`]: makeMarkdown(en, 'en'),
    [`${HOME}/resume/publications.json`]: JSON.stringify(
      ko.publications,
      null,
      2
    ),
    [`${HOME}/resume/education.json`]: JSON.stringify(ko.education, null, 2),
  };

  ko.experience.forEach((item, index) => {
    files[
      `${HOME}/resume/experience/${companyFileName(item.company, index)}.md`
    ] = makeExperienceFile(item);
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

const prompt = (cwd: string) => `kihwan@cv:${cwd.replace(HOME, '~') || '/'}$`;

const makeInitialLines = (
  language: SupportedLanguage,
  startId = 0,
  includeReady = false
) => {
  const initialLines: TerminalLine[] = copy[language].intro.map(
    (text, index) => ({
      id: startId + index,
      text,
      kind: 'system',
    })
  );

  if (includeReady) {
    initialLines.push({
      id: startId + initialLines.length,
      text: copy[language].ready,
      kind: 'system',
    });
  }

  return initialLines;
};

const formatList = (items: string[], prefix = '- ') =>
  items.map((item) => `${prefix}${item}`).join('\n');

const labelText = (label: string) => label.padEnd(9, ' ');

const getProjectText = (
  resume: ResumeData,
  language: SupportedLanguage,
  matcher: (
    project: NonNullable<ResumeData['experience'][number]['projects']>[number]
  ) => boolean
) => {
  const matches = resume.experience.flatMap((job) =>
    (job.projects ?? [])
      .filter(matcher)
      .map((project) => ({ company: job.company, project }))
  );

  if (!matches.length) return copy[language].noProject;

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

const getContactOutput = (): TerminalLineDraft[] =>
  CONTACT_ITEMS.map((item) => ({
    segments: [
      { text: labelText(item.label), kind: 'label' },
      { text: item.value, kind: 'link', href: item.href },
    ],
  }));

const getPapersOutput = (resume: ResumeData): TerminalLineDraft[] =>
  resume.publications.flatMap((publication, index) => {
    const item = publication as {
      title: string;
      uri?: string;
      conference: string;
      points?: string[];
    };
    const lines: TerminalLineDraft[] = [
      {
        segments: [
          {
            text: item.title,
            kind: 'title',
            href: item.uri,
          },
        ],
      },
      {
        segments: [{ text: item.conference, kind: 'meta' }],
      },
    ];

    if (item.points?.[0]) {
      lines.push({
        kind: 'bullet',
        segments: [{ text: '- ', kind: 'muted' }, { text: item.points[0] }],
      });
    }

    if (index < resume.publications.length - 1) {
      lines.push({ text: '' });
    }

    return lines;
  });

const getCommandOutput = (
  command: string,
  resume: ResumeData,
  language: SupportedLanguage
): CommandOutput | null => {
  switch (command) {
    case 'about':
      return [
        `${resume.name}`,
        '',
        resume.summary,
        '',
        copy[language].focus,
      ].join('\n');
    case 'work':
      return resume.experience
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
        .join('\n\n');
    case 'projects':
      return getProjectText(resume, language, () => true);
    case 'agent':
      return getProjectText(resume, language, (project) =>
        /agent|generative|pageagent|자동화|browser|ui/i.test(
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
      return getPapersOutput(resume);
    case 'contact':
      return getContactOutput();
    case 'pdf':
      return [
        `ko: ${TERMINAL_CV_PDF_URL}`,
        `en: ${TERMINAL_CV_EN_PDF_URL}`,
      ].join('\n');
    case 'pdf ko':
      return `download: ${TERMINAL_CV_PDF_URL}`;
    case 'pdf en':
      return `download: ${TERMINAL_CV_EN_PDF_URL}`;
    case 'guide':
    case 'help':
      return copy[language].guide.join('\n');
    default:
      return null;
  }
};

type BashResumeProps = {
  routeLanguage?: SupportedLanguage;
};

export function BashResume({ routeLanguage }: BashResumeProps) {
  const initialLanguage = useMemo(
    () => routeLanguage ?? getInitialLanguage(),
    [routeLanguage]
  );
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [bash, setBash] = useState<Bash | null>(null);
  const [resumes, setResumes] = useState<ResumeMap | null>(null);
  const [cwd, setCwd] = useState(HOME);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>(
    makeInitialLines(initialLanguage)
  );
  const [isRunning, setIsRunning] = useState(true);
  const nextId = useRef(copy[initialLanguage].intro.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const didMountFilesystem = useRef(false);

  const sampleCommands = useMemo(() => INITIAL_COMMANDS, []);
  const resume = resumes?.[language] ?? null;

  const appendLine = (text: string, kind?: TerminalLine['kind']) => {
    setLines((prev) => [...prev, { id: nextId.current++, text, kind }]);
  };

  const appendDraftLine = (line: TerminalLineDraft) => {
    setLines((prev) => [...prev, { ...line, id: nextId.current++ }]);
  };

  const appendBlock = (text: string, kind?: TerminalLine['kind']) => {
    const normalized = text.endsWith('\n') ? text.slice(0, -1) : text;
    for (const row of normalized.split('\n')) {
      appendLine(row, kind ?? (/^\s*-\s/.test(row) ? 'bullet' : undefined));
    }
  };

  const appendOutput = (output: CommandOutput, kind?: TerminalLine['kind']) => {
    if (typeof output === 'string') {
      appendBlock(output, kind);
      return;
    }

    for (const line of output) {
      appendDraftLine({ ...line, kind: line.kind ?? kind });
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

      setResumes({ ko, en });
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
      appendLine(copy[initialLanguage].ready, 'system');
    };

    void load().catch((error) => {
      setIsRunning(false);
      appendLine(`failed to mount resume: ${String(error)}`, 'stderr');
    });
  }, [initialLanguage]);

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [input, lines]);

  const runCommand = async (rawCommand: string) => {
    const command = rawCommand.trim();
    appendLine(`${prompt(cwd)} ${rawCommand}`, 'command');

    if (!command) return;
    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (/^lang(?:\s|$)/.test(command)) {
      const nextLanguage = command.split(/\s+/)[1];

      if (!nextLanguage) {
        appendLine(copy[language].currentLanguage, 'system');
        return;
      }

      if (!isSupportedLanguage(nextLanguage)) {
        appendLine(copy[language].unsupportedLanguage, 'stderr');
        return;
      }

      setLanguage(nextLanguage);
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      const nextUrl = new URL(window.location.href);
      if (nextUrl.pathname.startsWith('/bash')) {
        nextUrl.pathname = `/bash/${nextLanguage}`;
      }
      nextUrl.searchParams.delete('lng');
      window.history.replaceState(null, '', nextUrl);
      void i18n.changeLanguage(nextLanguage);
      const nextLines = makeInitialLines(nextLanguage, nextId.current, true);
      nextLines.push({
        id: nextId.current + nextLines.length,
        text: copy[nextLanguage].languageChanged,
        kind: 'system',
      });
      nextId.current += nextLines.length;
      setLines(nextLines);
      return;
    }

    if (resume) {
      const commandOutput = getCommandOutput(command, resume, language);
      if (commandOutput) {
        appendOutput(commandOutput);
        return;
      }
    }

    if (command === 'help' || command === 'guide') {
      appendLine(copy[language].mounting, 'stderr');
      return;
    }

    if (!bash) {
      appendLine(copy[language].mounting, 'stderr');
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
              {lines.map(({ id, text, segments, kind }) => (
                <div
                  key={id}
                  css={[
                    styles.lineStyle,
                    kind === 'command' && styles.commandStyle,
                    kind === 'stderr' && styles.stderrStyle,
                    kind === 'system' && styles.systemStyle,
                    kind === 'bullet' && styles.bulletStyle,
                  ]}
                >
                  {segments?.length
                    ? segments.map((segment, index) => {
                        const content = segment.text || ' ';
                        const segmentStyle = [
                          styles.segmentStyle,
                          segment.kind === 'label' && styles.labelSegmentStyle,
                          segment.kind === 'link' && styles.linkSegmentStyle,
                          segment.kind === 'title' && styles.titleSegmentStyle,
                          segment.kind === 'meta' && styles.metaSegmentStyle,
                          segment.kind === 'muted' && styles.mutedSegmentStyle,
                        ];

                        if (segment.href) {
                          return (
                            <a
                              key={`${segment.text}-${index}`}
                              css={segmentStyle}
                              href={segment.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <span
                            key={`${segment.text}-${index}`}
                            css={segmentStyle}
                          >
                            {content}
                          </span>
                        );
                      })
                    : text || ' '}
                </div>
              ))}
            </pre>
            <form css={styles.promptRowStyle} onSubmit={onSubmit}>
              <label css={styles.promptStyle} htmlFor="bash-resume-input">
                {isRunning ? '...' : prompt(cwd)}
              </label>
              <span css={styles.commandInputTextStyle} aria-hidden="true">
                {input}
                <span css={styles.caretStyle} />
              </span>
              <input
                ref={inputRef}
                id="bash-resume-input"
                css={styles.inputStyle}
                aria-label="terminal command"
                value={input}
                autoComplete="off"
                autoCapitalize="off"
                enterKeyHint="go"
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

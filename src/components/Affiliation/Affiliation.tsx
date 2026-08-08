// Experience 및 Education 섹션에 활용되는 Affiliation 컴포넌트
import * as styles from './Affiliation.styles';

export type Project = {
  title: string;
  uri?: string;
  /** Case study section on the hosted page, kept separate so a project can
      link to the thing it built and to the write-up about building it. */
  caseStudyUri?: string;
  period: string;
  description: string;
  points: string[];
  badges: string[];
};

interface EducationDegree {
  degree: string;
  period: string;
}

export interface Education {
  institution: string;
  degrees: EducationDegree[];
  projects: Project[];
}

interface AffiliationProps {
  name: string;
  uri?: string;
  /** Repo URL used to turn #123 references in details into links. */
  refBaseUri?: string;
  info: {
    position: string;
    period: string;
  }[];
  projectList?: Project[];
  summary?: string;
  details?: string[];
  stack?: string[];
  extra?: string | React.ReactNode;
  allowPrintBreak?: boolean;
}

interface BadgeProps {
  name: string;
}

interface ProjectProps {
  refBaseUri?: string;
  projectList: Project[];
}

interface DetailListProps {
  refBaseUri?: string;
  details: string[];
}

interface StackListProps {
  stack: string[];
}

// Octicons mark-github (MIT). currentColor keeps it on the heading's
// color, including the hover green.
function GitHubMark() {
  return (
    <svg
      css={styles.githubMarkStyle}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

// Octicons link (MIT). Marks titles that lead somewhere other than a
// GitHub repository, so linked entries read as links without hovering.
function LinkMark() {
  return (
    <svg
      css={styles.githubMarkStyle}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z" />
    </svg>
  );
}

/** Turn #123 references into repo links. GitHub's /issues/N redirects to
 *  the pull request when the number is a PR, so one path covers both. */
function linkifyRefs(text: string, refBaseUri?: string) {
  if (!refBaseUri) return text;
  const parts = text.split(/(#\d+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, index) => {
    const match = /^#(\d+)$/.exec(part);
    return match ? (
      <a
        key={`${part}-${index}`}
        css={styles.refLinkStyle}
        href={`${refBaseUri}/issues/${match[1]}`}
      >
        {part}
      </a>
    ) : (
      part
    );
  });
}

function Badge({ name }: BadgeProps) {
  return <div css={styles.BadgeStyle}>{name}</div>;
}

function Project({ projectList, refBaseUri }: ProjectProps) {
  return (
    <div css={styles.projectContainer}>
      {projectList.map((project) => {
        const {
          title,
          uri,
          caseStudyUri,
          period,
          description,
          points,
          badges,
        } = project;
        const descriptionText = description?.trim().length ? description : null;
        const pointItems = points?.length ? points : null;
        const badgeItems = badges?.length ? badges : null;

        return (
          <div key={title} css={styles.projectItemStyle}>
            <div css={styles.projectTitleStyle}>
              {uri ? (
                <a href={uri}>
                  {title}
                  <LinkMark />
                </a>
              ) : (
                title
              )}
            </div>
            <div css={styles.projectPeriodStyle}>{period}</div>
            {caseStudyUri ? (
              <div css={styles.projectCaseStudyStyle}>
                <a href={caseStudyUri}>
                  Case study
                  <LinkMark />
                </a>
              </div>
            ) : null}
            {descriptionText ? (
              <div css={styles.projectDescriptionStyle}>{descriptionText}</div>
            ) : null}
            {pointItems ? (
              <ul css={styles.projectListContainerStyle}>
                {pointItems.map((point) => (
                  <li key={point} css={styles.projectListStyle}>
                    {linkifyRefs(point, refBaseUri)}
                  </li>
                ))}
              </ul>
            ) : null}
            {badgeItems ? (
              <div css={styles.BadgeListStyle}>
                {badgeItems.map((badge) => (
                  <Badge key={title + '-' + badge} name={badge} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function Affiliation({
  name,
  uri,
  refBaseUri,
  info,
  projectList,
  summary,
  details,
  stack,
  extra,
  allowPrintBreak = false,
}: AffiliationProps) {
  const projectItems =
    projectList && projectList.length > 0 ? projectList : null;
  const detailItems = details && details.length > 0 ? details : null;
  const stackItems = stack && stack.length > 0 ? stack : null;
  const summaryText = summary && summary.trim().length > 0 ? summary : null;
  const hasRightColumnContent = Boolean(projectItems || detailItems);

  return (
    <div css={styles.rowStyle(allowPrintBreak)}>
      <div css={styles.leftColumnStyle}>
        <div css={styles.affiliationTextStyle}>
          {uri ? (
            <a href={uri} aria-label={`${name} on GitHub`}>
              {name}
              <GitHubMark />
            </a>
          ) : (
            name
          )}
        </div>
        {info.map(({ position, period }) => (
          <div key={position + period} css={styles.infoStyle}>
            <div>{position}</div>
            <div>{period}</div>
          </div>
        ))}
        <div>{extra}</div>
        {summaryText ? <p css={styles.summaryStyle}>{summaryText}</p> : null}
        {stackItems ? (
          <div css={styles.desktopStackContainerStyle}>
            <StackList stack={stackItems} />
          </div>
        ) : null}
      </div>
      {hasRightColumnContent ? (
        <div css={styles.contentContainer}>
          {projectItems ? (
            <Project projectList={projectItems} refBaseUri={refBaseUri} />
          ) : null}
          {detailItems ? (
            <DetailList details={detailItems} refBaseUri={refBaseUri} />
          ) : null}
          {stackItems ? (
            <div css={styles.mobileStackContainerStyle}>
              <StackList stack={stackItems} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DetailList({ details, refBaseUri }: DetailListProps) {
  return (
    <ul css={styles.projectListContainerStyle}>
      {details.map((detail) => (
        <li key={detail} css={styles.projectListStyle}>
          {linkifyRefs(detail, refBaseUri)}
        </li>
      ))}
    </ul>
  );
}

function StackList({ stack }: StackListProps) {
  return (
    <div css={styles.BadgeListStyle}>
      {stack.map((badge) => (
        <Badge key={`stack-${badge}`} name={badge} />
      ))}
    </div>
  );
}

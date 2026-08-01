// Experience 및 Education 섹션에 활용되는 Affiliation 컴포넌트
import * as styles from './Affiliation.styles';

export type Project = {
  title: string;
  uri?: string;
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
  projectList: Project[];
}

interface DetailListProps {
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

function Badge({ name }: BadgeProps) {
  return <div css={styles.BadgeStyle}>{name}</div>;
}

function Project({ projectList }: ProjectProps) {
  return (
    <div css={styles.projectContainer}>
      {projectList.map((project) => {
        const { title, uri, period, description, points, badges } = project;
        const descriptionText = description?.trim().length ? description : null;
        const pointItems = points?.length ? points : null;
        const badgeItems = badges?.length ? badges : null;

        return (
          <div key={title} css={styles.projectItemStyle}>
            <div css={styles.projectTitleStyle}>
              {uri ? <a href={uri}>{title}</a> : title}
            </div>
            <div css={styles.projectPeriodStyle}>{period}</div>
            {descriptionText ? (
              <div css={styles.projectDescriptionStyle}>{descriptionText}</div>
            ) : null}
            {pointItems ? (
              <ul css={styles.projectListContainerStyle}>
                {pointItems.map((point) => (
                  <li key={point} css={styles.projectListStyle}>
                    {point}
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
          {projectItems ? <Project projectList={projectItems} /> : null}
          {detailItems ? <DetailList details={detailItems} /> : null}
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

function DetailList({ details }: DetailListProps) {
  return (
    <ul css={styles.projectListContainerStyle}>
      {details.map((detail) => (
        <li key={detail} css={styles.projectListStyle}>
          {detail}
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

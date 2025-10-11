// Experience 및 Education 섹션에 활용되는 Affiliation 컴포넌트
import * as styles from './Affiliation.styles';

export type Project = {
  title: string;
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
  info: {
    position: string;
    period: string;
  }[];
  projectList?: Project[];
  summary?: string;
  details?: string[];
  stack?: string[];
  extra?: string | React.ReactNode;
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

function Badge({ name }: BadgeProps) {
  return <div css={styles.BadgeStyle}>{name}</div>;
}

function Project({ projectList }: ProjectProps) {
  return (
    <div css={styles.projectContainer}>
      {projectList.map(({ title, period, description, points, badges }) => {
        const descriptionText = description?.trim().length ? description : null;
        const pointItems = points?.length ? points : null;
        const badgeItems = badges?.length ? badges : null;

        return (
          <div key={title}>
            <div css={styles.projectTitleStyle}>{title}</div>
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
  info,
  projectList,
  summary,
  details,
  stack,
  extra,
}: AffiliationProps) {
  const projectItems = projectList && projectList.length > 0 ? projectList : null;
  const detailItems = details && details.length > 0 ? details : null;
  const stackItems = stack && stack.length > 0 ? stack : null;
  const summaryText = summary && summary.trim().length > 0 ? summary : null;
  const hasRightColumnContent = Boolean(projectItems || detailItems);

  return (
    <div css={styles.rowStyle}>
      <div css={styles.leftColumnStyle}>
        <div css={styles.affiliationTextStyle}>{name}</div>
        {info.map(({ position, period }) => (
          <div key={position + period} css={styles.infoStyle}>
            <div>{position}</div>
            <div>{period}</div>
          </div>
        ))}
        <div>{extra}</div>
        {summaryText ? (
          <p css={styles.summaryStyle}>{summaryText}</p>
        ) : null}
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

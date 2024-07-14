// Experience 및 Education 섹션에 활용되는 Affiliation 컴포넌트
import * as styles from './Affiliation.styles';

export type Project = {
  title: string;
  period: string;
  description: string;
  points: string[];
  badges: string[];
};

interface ProjectProps {
  projectList: Project[];
}

interface AffiliationProps {
  name: string;
  info: {
    position: string;
    period: string;
  }[];
  projectList: Project[];
  extra?: string | React.ReactNode;
}

interface BadgeProps {
  name: string;
}

function Badge({ name }: BadgeProps) {
  return <div css={styles.BadgeStyle}>{name}</div>;
}

function Project({ projectList }: ProjectProps) {
  return (
    <div css={styles.projectContainer}>
      {projectList.map(({ title, period, description, points, badges }) => (
        <div key={title}>
          <div css={styles.projectTitleStyle}>{title}</div>
          <div css={styles.projectPeriodStyle}>{period}</div>
          <div css={styles.projectDescriptionStyle}>{description}</div>
          <ul css={styles.projectListContainerStyle}>
            {points.map((point) => (
              <li key={point} css={styles.projectListStyle}>
                {point}
              </li>
            ))}
          </ul>
          <div css={styles.BadgeListStyle}>
            {badges.map((badge) => (
              <Badge key={title + '-' + badge} name={badge} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Affiliation({
  name,
  info,
  projectList,
  extra,
}: AffiliationProps) {
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
      </div>
      <Project projectList={projectList} />
    </div>
  );
}

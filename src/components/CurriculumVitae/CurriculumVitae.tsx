import { useTranslation } from 'react-i18next';

import * as styles from './CurriculumVitae.styles';
import { Affiliation, Education, Project } from '../Affiliation';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Nameplate } from '../NamePlate';
import { Publication, PublicationProps } from '../Publication';
import { Section } from '../Section';

type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
  details?: string[];
  stack?: string[];
  projects?: ExperienceProject[];
  aliases?: string[];
};

type ExperienceProject = {
  title: string;
  period: string;
  summary?: string;
  details?: string[];
  stack?: string[];
};

export function CurriculumVitae() {
  const { t } = useTranslation(['common']);

  const experience = t('experience', { returnObjects: true }) as Experience[];
  const education = t('education', { returnObjects: true }) as Education[];
  const publications = t('publications', {
    returnObjects: true,
  }) as PublicationProps[];

  return (
    <div css={styles.contentStyle}>
      <LanguageSwitcher />
      <Nameplate name={t('name')} />
      <Section title="Summary" isShortGap>
        <p>{t('summary')}</p>
        <address css={styles.contactStyle}>
          <a id="email" href="mailto:juljin1875@gmail.com">
            juljin1875@gmail.com
          </a>
          <a id="linkedIn" href="https://www.linkedin.com/in/1875/">
            LinkedIn
          </a>
          <a id="github" href="https://github.com/simulacre7/">
            GitHub
          </a>
        </address>
      </Section>
      <Section title="Experience">
        {experience.map(({ company, role, period, summary, details, stack, projects, aliases }) => {
          const projectList = projects?.map<Project>(
            ({ title, period: projectPeriod, summary: projectSummary, details: projectDetails, stack: projectStack }) => ({
              title,
              period: projectPeriod,
              description: projectSummary ?? '',
              points: projectDetails ?? [],
              badges: projectStack ?? [],
            })
          );

          const aliasNode = aliases?.length ? (
            <div css={styles.aliasContainerStyle}>
              {aliases.map((alias) => (
                <p key={alias} css={styles.aliasTextStyle}>
                  {alias}
                </p>
              ))}
            </div>
          ) : undefined;

          return (
            <Affiliation
              key={`${company}-${period}`}
              name={company}
              info={[
                {
                  position: role,
                  period,
                },
              ]}
              summary={summary}
              projectList={projectList}
              details={projectList ? undefined : details}
              stack={stack}
              extra={aliasNode}
            />
          );
        })}
      </Section>
      <Section title="Education">
        {education.map((edu) => (
          <Affiliation
            key={edu.institution}
            name={edu.institution}
            info={edu.degrees.map((degree) => ({
              position: degree.degree,
              period: degree.period,
            }))}
            projectList={edu.projects}
          />
        ))}
      </Section>
      <Section title="Publications" isShortGap>
        {publications.map((pub) => (
          <Publication
            key={pub.title}
            title={pub.title}
            uri={pub.uri}
            authors={pub.authors}
            conference={pub.conference}
            points={pub.points}
          />
        ))}
      </Section>
    </div>
  );
}

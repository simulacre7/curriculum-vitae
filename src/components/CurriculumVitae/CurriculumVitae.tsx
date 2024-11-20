import { useTranslation } from 'react-i18next';

import * as styles from './CurriculumVitae.styles';
import { Affiliation, Project, Education } from '../Affiliation';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Nameplate } from '../NamePlate';
import { Publication, PublicationProps } from '../Publication';
import { Section } from '../Section';

export function CurriculumVitae() {
  const { t } = useTranslation(['common']);

  const ridiProjects = t('company.ridi.projects', {
    returnObjects: true,
  }) as Project[];
  const tmaxProjects = t('company.tmax.projects', {
    returnObjects: true,
  }) as Project[];
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
        <Affiliation
          name={t('company.ridi.name')}
          info={[
            {
              position: t('company.ridi.position'),
              period: `2022.05-${t('present')}`,
            },
          ]}
          projectList={ridiProjects}
        />
        <Affiliation
          name={t('company.tmax.name.0')}
          info={[
            {
              position: t('company.tmax.position'),
              period: '2020.02–2022.04',
            },
          ]}
          extra={
            <div css={styles.tmaxNameExtraContainerStyle}>
              <p css={styles.tmaxNameExtraStyle}>{t('company.tmax.name.1')}</p>
              <p css={styles.tmaxNameExtraStyle}>{t('company.tmax.name.2')}</p>
            </div>
          }
          projectList={tmaxProjects}
        />
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

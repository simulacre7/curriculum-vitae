import { useTranslation } from 'react-i18next';

import * as styles from './CurriculumVitae.styles';
import { Affiliation } from '../Affiliation';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Nameplate } from '../NamePlate';
import { Publication as PublicationComponent } from '../Publication';
import { Section } from '../Section';

interface Project {
  title: string;
  period: string;
  description: string;
  points: string[];
  badges: string[];
}

interface EducationDegree {
  degree: string;
  period: string;
}

interface Education {
  institution: string;
  degrees: EducationDegree[];
  projects: Project[];
}

interface Publication {
  title: string;
  uri: string;
  authors: string[];
  conference: string;
  points: string[];
}

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
  }) as Publication[];

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
              period: `2022-${t('present')}`,
            },
          ]}
          projectList={ridiProjects.map((project) => ({
            ...project,
            badges: [
              'Next.js',
              'TypeScript',
              'React',
              'Emotion',
              'Jest',
              'PHP',
              'Twig',
            ],
          }))}
        />
        <Affiliation
          name={t('company.tmax.name.1')}
          info={[
            {
              position: t('company.tmax.position'),
              period: '2020.02–2022.04',
            },
          ]}
          extra={
            <div css={styles.tmaxNameExtraContainerStyle}>
              <p css={styles.tmaxNameExtraStyle}>{t('company.tmax.name.2')}</p>
              <p css={styles.tmaxNameExtraStyle}>{t('company.tmax.name.3')}</p>
            </div>
          }
          projectList={tmaxProjects.map((project, index) => ({
            ...project,
            badges:
              index === 0
                ? ['TypeScript', 'React', 'Sass', 'Material-UI', 'jQuery']
                : ['TypeScript', 'React', 'Sass', 'Material-UI', 'Python'],
          }))}
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
            projectList={edu.projects.map((project, index) => ({
              ...project,
              badges:
                index === 0
                  ? ['Python', 'Flask', 'Surprise', 'jQuery']
                  : ['Python', 'TensorFlow', 'Keras', 'scikit-learn'],
            }))}
          />
        ))}
      </Section>
      <Section title="Publications" isShortGap>
        {publications.map((pub) => (
          <PublicationComponent
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

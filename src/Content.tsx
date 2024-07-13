import { Affiliation } from './components/Affiliation';
import { Nameplate } from './components/NamePlate';
import { Publication } from './components/Publication';
import { Section } from './components/Section';
import * as styles from './Context.styles';

export function Content() {
  return (
    <div css={styles.contentStyle}>
      <Nameplate name="김기환" />
      <Section title="Summary" isShortGap>
        <p>
          반갑습니다. 저는 프론트엔드 개발자 김기환입니다. 인간과 AI 사이
          상호작용을 개선하는 일을 해오고 있습니다. 현재는 블랙박스 모델의
          해석을 돕는 데이터 시각화 기법을 연구 중 입니다. 과거에는 사용자 로그
          데이터의 가치를 AI 측면에서 평가하고, 이를 통해 더 나은 인터페이스가
          무엇인지를 비교하는 연구를 수행했습니다.
        </p>
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
          name="리디주식회사"
          info={[
            {
              position: 'Frontend Engineer',
              period: '2022.05–현재',
            },
          ]}
          projectList={[
            {
              title: '리디 웹사이트',
              period: '2022.05–현재',
              description:
                '웹툰, 웹소설, 만화, 전자책 등을 서비스하는 콘텐츠 플랫폼의 프론트엔드를 개발합니다.',
              points: [
                '비즈니스의 다양한 요구사항에 대응하는 신규 기능 구현',
                '기존 시스템의 유지 보수: 리팩토링, 테스트 코드 작성',
              ],
              badges: [
                'Next.js',
                'TypeScript',
                'React',
                'Emotion',
                'Jest',
                'PHP',
                'Twig',
              ],
            },
          ]}
        />
        <Affiliation
          name="티맥스엔터프라이즈"
          info={[
            {
              position: 'Researcher',
              period: '2020.02–2022.04',
            },
          ]}
          extra={
            <div css={styles.tmaxNameExtraContainerStyle}>
              <p css={styles.tmaxNameExtraStyle}>現 티맥스비아이</p>
              <p css={styles.tmaxNameExtraStyle}>前 티맥스데이터</p>
            </div>
          }
          projectList={[
            {
              title: '레거시 시스템 리액트 포팅',
              period: '2021.01–2022.04',
              description:
                'jQuery 기반 사내 프론트엔드 라이브러리 — TOP(Tmax One Platform)로 구현된 제품들을 리액트로 전환하였습니다.',
              points: [
                '모듈화가 미흡한 기존 코드를 용도에 맞게 분할하고 인터페이스를 개선',
                '각종 컴포넌트 신규 개발',
              ],
              badges: ['TypeScript', 'React', 'Sass', 'Material-UI', 'jQuery'],
            },
            {
              title: 'AutoML 플랫폼',
              period: '2020.02–2022.04',
              description:
                '소모적이고 반복적인 기계학습 모델 개발 작업을 자동화하는 플랫폼을 개발 했습니다.',
              points: [
                '비전문가를 위한 Codeless 환경의 개발 스튜디오 구현',
                '설명 가능한 AI — XAI(eXplainable Artificial Intelligence) 기술 연구 및 개발',
                'AutoML 엔진이 모델 개발자와 효과적으로 interaction 을 할 수 있는 인터페이스를 연구',
                '기계학습 모델의 개발, 관리 및 운영을 위한 대시보드 개발',
              ],
              badges: ['TypeScript', 'React', 'Sass', 'Material-UI', 'Python'],
            },
          ]}
        />
      </Section>
      <Section title="Education">
        <Affiliation
          name="울산과학기술원 (UNIST)"
          info={[
            {
              position: '컴퓨터공학 석사',
              period: '2018.03–2020.02',
            },
            {
              position: '기술경영학 학사 (컴퓨터공학 융합전공)',
              period: '2013.03–2018.02',
            },
          ]}
          projectList={[
            {
              title: 'AI 중심 UI/UX 설계',
              period: '2019.01–2020.02',
              description:
                '"어떻게 UI를 구성해야 사용자의 취향이 담긴 데이터를 더 잘 수집할 수 있을까?"라는 질문에 답하는 연구를 수행하였습니다.',
              points: [
                '추천시스템의 Explore-Exploit 문제에서 투명성이 데이터의 품질에 미치는 영향을 측정',
                '사용자 로그의 가치를 AI 측면에서 평가하는 metric 제안',
                '실험 환경용 웹 기반 영화 추천 시스템 구현',
              ],
              badges: ['Python', 'Flask', 'Surprise', 'jQuery'],
            },
            {
              title: '웹 사용자 행동 모델링',
              period: '2019.02–2020.02',
              description:
                '웹 환경에서 사용자의 행동 패턴을 파악하고 이를 모델링하는 연구를 했습니다.',
              points: [
                '역강화학습 — (Inverse Reinforcement Learning) 방법론을 통해, 사용자들의 행동 이력으로 사용자의 보상 함수를 추정',
                'Tableau와 같은 데이터 분석 도구, 위키피디아 문서 기반 역사 교육 도구, 카드 게임과 같은 다양한 웹 환경을 다룸',
              ],
              badges: ['Python', 'TensorFlow', 'Keras', 'scikit-learn'],
            },
          ]}
        />
      </Section>
      <Section title="Publications" isShortGap>
        <Publication
          title="An Empirical Analysis on Transparent Algorithmic Exploration in Recommender Systems"
          uri="https://arxiv.org/abs/2108.00151"
          authors={['Kihwan Kim']}
          conference="A Computing Research Repository (CoRR), 2108.00151, 2021"
          points={[
            '추천 시스템에서 사용자 취향을 파악하기 위한 랜덤 아이템들을 어떻게 전달해야 할까?',
            '실험 환경으로 사용된 웹 기반 영화 추천 시스템 구현',
            '사용자 로그의 가치를 AI 측면에서 평가하는 metric 제안',
            '추천시스템의 Explore-Exploit 문제에서 투명성이 데이터의 품질에 미치는 영향을 측정',
            '94명의 피험자를 Amazon MTurk에서 구인',
            '피험자들에게 넷플릭스와 유사한 실험 환경을 이용하도록 하여, 실사용 로그 데이터와 설문 응답을 수집',
          ]}
        />
        <Publication
          title="ST-GRAT: A Novel Spatio-temporal Graph Attention Networks for Accurately Forecasting Dynamically Changing Road Speed"
          uri="https://dl.acm.org/doi/10.1145/3340531.3411940"
          authors={[
            'Cheonbok Park',
            'Chunggi Lee',
            'Hyojin Bahng',
            'Yunwon Tae',
            'Kihwan Kim',
            'Seungmin Jin',
            'Sungahn Ko',
            'Jaegul Choo',
          ]}
          conference="ACM International Conference on Information and Knowledge Management (CIKM), 2020"
          points={[
            '한국도로공사의 도로 바닥에 설치된 차량 감지 센서 데이터를 전처리',
            'Attention이 효과적으로 동작한 경우들을 패턴 별로 묶어 카테고리화',
          ]}
        />
        <Publication
          title="Modeling Exploration/Exploitation Decisions through Mobile Sensing for Understanding Mechanisms of Addiction"
          uri="https://dl.acm.org/citation.cfm?doid=3307334.3328599"
          authors={['Kihwan Kim', 'Sanghoon Kim', 'Chunggi Lee', 'Sungahn Ko']}
          conference="ACM International Conference on Mobile Systems, Applications, and Services (MobiSys), 2019"
          points={[
            'Inverse Reinforcement Learning을 통해, 스마트폰 사용 로그로 중독 질환 여부를 감지하는 시스템을 제안',
          ]}
        />
        <Publication
          title="An Empirical Study on the Relationship Between the Number of Coordinated Views and Visual Analysis"
          uri="https://arxiv.org/abs/2108.00151"
          authors={[
            'Juyoung Oh',
            'Chunggi Lee',
            'Hwiyeon Kim',
            'Kihwan Kim',
            'Osang Kwon',
            'Eric D. Ragan',
            'Bum Chul Kwon',
            'Sungahn Ko',
          ]}
          conference="A Computing Research Repository (CoRR), 2204.09524, 2018"
          points={[
            '시각화 차트의 갯수가 데이터의 시각적 분석에 어떤 영향을 미치는지 실험',
            '44명 피험자에게 시각적 분석 도구를 주고, 데이터 분석 과제를 풀도록 함',
            'Think-aloud 프로토콜과 녹화된 화면, 그리고 로그 데이터를 통해 사용자의 분석 패턴을 카테고리화',
            '차트의 갯수와 과제 점수 간 양의 상관관계를 관찰정',
          ]}
        />
        <Publication
          title="시각화 기반 딥러닝 분석 기술"
          uri="http://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE07266060&language=ko_KR"
          authors={['이재성', '김기환', '이충기', '고성안']}
          conference="소음진동 제27권 제6호 2017.11"
          points={['딥 러닝 모델을 해석하기 위한 시각화 기법들을 정리 및 조사']}
        />
      </Section>
    </div>
  );
}

// 최상단에 위치한 Nameplate 컴포넌트는 이름을 표시하는 역할을 합니다.
import * as styles from './Nameplate.styles';

interface NameplateProps {
  name: string;
}

export function Nameplate({ name }: NameplateProps) {
  return (
    <h1 css={styles.nameStyle}>
      <span css={styles.angleBracketStyle}>{'<'}</span>
      {name}
      <span css={styles.slashStyle}>&nbsp;/&nbsp;</span>
      <span css={styles.angleBracketStyle}>{'>'}</span>
    </h1>
  );
}

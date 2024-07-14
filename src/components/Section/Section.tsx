import * as styles from './Section.styles';

interface SectionProps {
  title: string;

  children: React.ReactNode;
  isShortGap?: boolean;
}

const NUM_OF_LETTERS_TO_HIGHLIGHT = 3;

export function Section({ title, children, isShortGap }: SectionProps) {
  const highlightedText = title.slice(0, NUM_OF_LETTERS_TO_HIGHLIGHT);
  const remainingText = title.slice(NUM_OF_LETTERS_TO_HIGHLIGHT);

  return (
    <section css={styles.containerStyle}>
      <h2 css={styles.titleStyle}>
        <span>{highlightedText}</span>
        {remainingText}
      </h2>
      <div css={[styles.mainContentStyle, isShortGap && styles.shortGapStyle]}>
        {children}
      </div>
    </section>
  );
}

import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow } from '../../styles';

export const containerStyle = () => css`
  margin-top: 2rem;

  @media print {
    margin-top: 1.4rem;
  }
`;

export const printBreakBeforeStyle = css`
  @media print {
    break-before: page;
    page-break-before: always;
  }
`;

export const titleStyle = (theme: Theme) => css`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 3rem;
  color: ${theme.colors.black};
  & > span {
    color: ${theme.colors.green};
  }

  @media print {
    margin-bottom: 0.65rem;
    font-size: 2.35rem;
    break-after: avoid;
    page-break-after: avoid;
  }

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 2.4rem;
    `
  )};
`;

export const mainContentStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  color: ${theme.colors.black};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;

  @media print {
    gap: 1.45rem;
    font-size: 1rem;
  }

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 1rem;
    `
  )};
`;

export const shortGapStyle = css`
  gap: 1rem;

  @media print {
    gap: 0.7rem;
  }
`;

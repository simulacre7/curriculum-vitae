import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow } from '../../styles';

export const containerStyle = () => css`
  margin-top: 2.5rem;
`;

export const titleStyle = (theme: Theme) => css`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 3rem;
  color: ${theme.colors.black};
  & > span {
    color: ${theme.colors.green};
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
  gap: 2rem;
  color: ${theme.colors.black};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 1rem;
    `
  )};
`;

export const shortGapStyle = css`
  gap: 1rem;
`;

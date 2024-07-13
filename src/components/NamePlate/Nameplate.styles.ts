import { css } from '@emotion/react';
import { BreakPoint, orBelow } from '../../styles/media';
import { Theme } from '@emotion/react';

export const nameStyle = (theme: Theme) => css`
  display: flex;
  margin-top: 0.67em;
  font-size: 6rem;
  color: ${theme.colors.black};
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 3rem;
    `
  )};
`;

export const angleBracketStyle = (theme: Theme) => css`
  color: ${theme.colors.green};
`;

export const slashStyle = (theme: Theme) => css`
  color: ${theme.colors.grey};
`;

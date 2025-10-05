import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow } from '../../styles';

export const containerStyle = css`
  display: flex;
  gap: 0.3rem;
  justify-content: flex-end;
  margin-right: -2rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      padding-right: 8px;
    `
  )};
`;

export const anchorStyle = (theme: Theme) => css`
  color: ${theme.colors.grey};
  text-decoration: underline;
  text-decoration-color: ${theme.colors.grey};
  text-underline-offset: 0.2em;
  &:visited {
    color: ${theme.colors.grey};
  }
  &:focus-visible {
    outline: none;
    text-decoration-color: ${theme.colors.deepGreen};
  }
  &:hover {
    color: ${theme.colors.deepGreen};
    text-decoration-color: ${theme.colors.deepGreen};
  }
`;

export const selectedAnchorStyle = (theme: Theme) => css`
  color: ${theme.colors.green};
  text-decoration-color: ${theme.colors.green};

  &:visited {
    color: ${theme.colors.green};
  }
  &:hover {
    color: ${theme.colors.deepGreen};
    text-decoration-color: ${theme.colors.deepGreen};
  }
`;

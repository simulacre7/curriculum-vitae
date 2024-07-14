import { css, Theme } from '@emotion/react';

export const titleStyle = (theme: Theme) => css`
  margin-bottom: 0.5rem;
  & > a {
    color: ${theme.colors.green};
    text-decoration: underline;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.334;
  }
`;

export const authorStyle = css`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
`;

export const conferenceStyle = css`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
`;

export const pointsListStyle = (theme: Theme) => css`
  padding-inline-start: 1.3rem;
  margin: 1rem 0;
  & > li::marker {
    color: ${theme.colors.green};
  }

  & > li {
    color: ${theme.colors.black};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

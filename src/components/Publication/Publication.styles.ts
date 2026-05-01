import { css, Theme } from '@emotion/react';

export const containerStyle = css`
  @media print {
    break-inside: auto;
    page-break-inside: auto;
  }
`;

export const titleStyle = (theme: Theme) => css`
  margin-bottom: 0.5rem;
  & > a {
    color: ${theme.colors.green};
    text-decoration: underline;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.334;
  }

  @media print {
    break-after: avoid;
    page-break-after: avoid;
    margin-bottom: 0.25rem;

    & > a {
      font-size: 0.9rem;
      line-height: 1.2;
    }
  }
`;

export const authorStyle = css`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;

  @media print {
    font-size: 0.68rem;
    line-height: 1.25;
  }
`;

export const conferenceStyle = css`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;

  @media print {
    font-size: 0.68rem;
    line-height: 1.25;
  }
`;

export const pointsListStyle = (theme: Theme) => css`
  padding-inline-start: 1.3rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;

  @media print {
    margin-top: 0.15rem;
    margin-bottom: 0.3rem;
  }

  & > li::marker {
    color: ${theme.colors.green};
  }

  & > li {
    color: ${theme.colors.black};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;

    @media print {
      font-size: 0.68rem;
      line-height: 1.25;
    }
  }
`;

import { Theme, css } from '@emotion/react';

import { BreakPoint, orBelow } from '../../styles';

export const contentStyle = css`
  margin-bottom: 6rem;
`;

export const contactStyle = (theme: Theme) => css`
  display: flex;
  gap: 0.3rem;
  align-items: flex-end;
  justify-content: flex-end;

  & > a {
    color: ${theme.colors.grey};
    text-decoration: underline;
    font-size: 0.93rem;
    ${orBelow(
      BreakPoint.DesktopSmall,
      css`
        font-size: 0.83rem;
      `
    )}
  }
`;

export const printOnlyContactLinkStyle = css`
  display: none;

  @media print {
    display: inline;
  }
`;

export const aliasContainerStyle = css`
  margin-top: 0.5rem;
`;

export const aliasTextStyle = (theme: Theme) => css`
  font-size: 0.95rem;
  line-height: 1.4;
  color: ${theme.colors.black};
`;

export const careListStyle = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem 2rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      grid-template-columns: 1fr;
      gap: 1rem;
    `
  )}
`;

export const careItemStyle = css`
  break-inside: avoid;
  page-break-inside: avoid;
`;

export const careTitleStyle = (theme: Theme) => css`
  margin: 0 0 0.35rem;
  color: ${theme.colors.black};
  font-size: 1.15rem;
  line-height: 1.35;
`;

export const careDescriptionStyle = (theme: Theme) => css`
  margin: 0;
  color: ${theme.colors.black};
  font-size: 1rem;
  line-height: 1.5;
`;

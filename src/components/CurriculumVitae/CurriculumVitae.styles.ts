import { Theme, css } from '@emotion/react';

import { BreakPoint, hexToRGBA, orBelow } from '../../styles';

export const contentStyle = css`
  margin-bottom: 6rem;
`;

export const contactStyle = (theme: Theme) => css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  align-items: center;
  font-style: normal;

  & > a {
    color: ${theme.colors.grey};
    text-decoration: underline;
    text-underline-offset: 0.18em;
    font-size: 0.93rem;

    &:hover {
      color: ${theme.colors.deepGreen};
    }

    &:focus-visible {
      outline: 3px solid ${theme.colors.deepGreen};
      outline-offset: 3px;
    }

    ${orBelow(
      BreakPoint.DesktopSmall,
      css`
        font-size: 0.83rem;
      `
    )}
  }
`;

export const actionListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.25rem;

  @media print {
    display: none;
  }
`;

export const actionLinkStyle = (theme: Theme) => css`
  border: 1px solid ${theme.colors.deepGreen};
  border-radius: 0.25rem;
  padding: 0.55rem 0.75rem;
  color: ${theme.colors.deepGreen};
  font-size: 0.9rem;
  line-height: 1;
  text-decoration: none;

  &:visited {
    color: ${theme.colors.deepGreen};
  }

  &:hover {
    background: ${hexToRGBA(theme.colors.brightGreen, 0.24)};
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.deepGreen};
    outline-offset: 3px;
  }
`;

export const primaryActionLinkStyle = (theme: Theme) => css`
  color: ${theme.colors.white};
  background: ${theme.colors.deepGreen};

  &:visited {
    color: ${theme.colors.white};
  }

  &:hover {
    color: ${theme.colors.white};
    background: ${theme.colors.green};
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

export const selectedWorkListStyle = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      grid-template-columns: 1fr;
    `
  )}

  @media print {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const selectedWorkItemStyle = (theme: Theme) => css`
  padding: 1.15rem;
  border-top: 3px solid ${theme.colors.deepGreen};
  background: ${hexToRGBA(theme.colors.brightGreen, 0.12)};
  break-inside: avoid;
  page-break-inside: avoid;

  @media print {
    background: transparent;
    border: 1px solid ${hexToRGBA(theme.colors.grey, 0.3)};
    border-top: 3px solid ${theme.colors.deepGreen};
  }
`;

export const selectedWorkTitleStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 1.35rem;
  line-height: 1.25;
`;

export const selectedWorkMetaStyle = (theme: Theme) => css`
  margin-top: 0.35rem;
  color: ${theme.colors.grey};
  font-size: 0.85rem;
  line-height: 1.4;
`;

export const selectedWorkSummaryStyle = (theme: Theme) => css`
  margin-top: 0.9rem;
  color: ${theme.colors.black};
  font-size: 0.98rem;
  line-height: 1.55;
`;

import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow, hexToRGBA } from '../../styles';

export const containerStyle = () => css`
  padding: 1rem 0;
`;

export const rowStyle = (allowPrintBreak: boolean) => css`
  display: flex;
  width: 100%;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      flex-direction: column;
    `
  )}

  @media print {
    flex-direction: row;
    break-inside: ${allowPrintBreak ? 'auto' : 'avoid'};
    page-break-inside: ${allowPrintBreak ? 'auto' : 'avoid'};
  }
`;

export const leftColumnStyle = () => css`
  flex-basis: 50%;
  padding-right: 2rem;
  flex-shrink: 0;
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      flex-basis: 100%;
    `
  )}

  @media print {
    flex-basis: 50%;
  }
`;

export const infoStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
`;

export const affiliationTextStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-weight: bold;
  font-size: 2.125rem;
  line-height: 1.235;
  margin-bottom: 0.5em;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 1.7rem;
    `
  )}

  display: flex;
  flex-wrap: wrap;

  & > a {
    color: inherit;
    font-weight: inherit;
    text-decoration: none;
  }

  & > a:visited {
    color: inherit;
  }

  & > a:hover {
    color: ${theme.colors.deepGreen};
  }

  & > a:focus-visible {
    outline: 2px solid ${theme.colors.deepGreen};
    outline-offset: 3px;
  }

  & > a {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35em;
  }
`;

export const refLinkStyle = (theme: Theme) => css`
  color: ${theme.colors.green};
  text-decoration: underline;
  font-size: inherit;
  font-weight: inherit;

  &:visited {
    color: ${theme.colors.green};
  }
`;

export const githubMarkStyle = css`
  width: 0.62em;
  height: 0.62em;
  flex-shrink: 0;
`;

export const projectListContainerStyle = (theme: Theme) => css`
  padding-inline-start: 1.3rem;
  margin-bottom: 1rem;
  & > li::marker {
    color: ${theme.colors.green};
  }
`;

export const projectContainer = css`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      margin-top: 1rem;
      gap: 1.5rem;
    `
  )}
`;

export const projectItemStyle = css`
  break-inside: avoid;
  page-break-inside: avoid;
`;

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      margin-top: 1rem;
      gap: 1rem;
    `
  )}

  @media print {
    margin-top: 0;
  }
`;

export const summaryStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 1rem;
`;

export const projectTitleStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.235;
  margin-bottom: 0.5rem;
  break-after: avoid;
  page-break-after: avoid;

  & > a {
    color: inherit;
    font-weight: inherit;
    text-decoration: none;
  }

  /* Keep the link mark in inline flow so it trails the last word even
     when the title wraps; inline-flex would pin it to the first line. */
  & > a > svg {
    margin-left: 0.3em;
  }

  & > a:visited {
    color: inherit;
  }

  & > a:hover {
    color: ${theme.colors.deepGreen};
  }

  & > a:focus-visible {
    outline: 2px solid ${theme.colors.deepGreen};
    outline-offset: 3px;
  }

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      font-size: 1.25rem;
    `
  )}
`;

const projectTextStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
`;

export const projectPeriodStyle = (theme: Theme) => css`
  ${projectTextStyle(theme)}
  margin-bottom: 1rem;
  break-after: avoid;
  page-break-after: avoid;
`;

export const projectDescriptionStyle = (theme: Theme) => css`
  ${projectTextStyle(theme)}
  margin-bottom: 1rem;
`;

export const projectListStyle = (theme: Theme) => css`
  ${projectTextStyle(theme)}
`;

export const BadgeStyle = (theme: Theme) => css`
  color: ${theme.colors.deepGreen};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 0.2rem 0.66rem 0.3rem;
  background-color: ${hexToRGBA(theme.colors.brightGreen, 0.2)};
  border-radius: 1.5rem;
`;

export const BadgeListStyle = css`
  display: flex;
  gap: 0.2rem;
  width: 100%;
  flex-wrap: wrap;
`;

export const desktopStackContainerStyle = css`
  margin-top: 1rem;
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      display: none;
    `
  )}

  @media print {
    display: block;
  }
`;

export const mobileStackContainerStyle = css`
  display: none;
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      display: block;
    `
  )}

  @media print {
    display: none;
  }
`;

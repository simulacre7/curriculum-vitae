import { css } from '@emotion/react';
import { BreakPoint, orBelow } from '../../styles/media';
import { Theme } from '@emotion/react';
import { hexToRGBA } from '../../styles/utils';

export const containerStyle = () => css`
  padding: 1rem 0;
`;

export const rowStyle = () => css`
  display: flex;
  width: 100%;
  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      flex-direction: column;
    `
  )}
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
  gap: 3rem;

  ${orBelow(
    BreakPoint.DesktopSmall,
    css`
      margin-top: 1rem;
      gap: 1.5rem;
    `
  )}
`;

export const projectTitleStyle = (theme: Theme) => css`
  color: ${theme.colors.black};
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.235;
  margin-bottom: 0.5rem;

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

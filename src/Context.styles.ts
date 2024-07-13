import { Theme, css } from '@emotion/react';
import { BreakPoint, orBelow } from './styles/media';

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

export const tmaxNameExtraContainerStyle = css`
  display: block;
`;

export const tmaxNameExtraStyle = (theme: Theme) => css`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.colors.black};
`;

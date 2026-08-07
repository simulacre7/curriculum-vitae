import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow } from './styles';

export const globalStyles = (theme: Theme) => css`
  @font-face {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 45 920;
    font-display: swap;
    src: url('/fonts/PretendardVariable.v1.3.9.cv-subset.woff2')
      format('woff2-variations');
  }

  @font-face {
    font-family: 'Pretendard Fallback';
    src: local('Apple SD Gothic Neo'), local('Noto Sans KR'),
      local('Malgun Gothic'), local('Arial');
    size-adjust: 100%;
    ascent-override: 92%;
    descent-override: 24%;
    line-gap-override: 0%;
  }

  @page {
    size: A4;
    /* Reserves the footer band that build-submission-pdf.mjs draws over the
       printed page, so body text cannot run under the rule. */
    margin-bottom: 14mm;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    font-family:
      Pretendard,
      Pretendard Fallback,
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      Helvetica Neue,
      Segoe UI,
      Apple SD Gothic Neo,
      Noto Sans KR,
      Malgun Gothic,
      Apple Color Emoji,
      Segoe UI Emoji,
      Segoe UI Symbol,
      sans-serif,
      Arial,
      Noto Color Emoji;
    line-height: 1.5;
    font-weight: 400;

    background-color: #ffffff;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    width: 100%;
    max-width: 50rem;
    margin: auto;
  }

  ::selection {
    background-color: ${theme.colors.brightGreen};
  }

  a {
    font-weight: 500;
    text-decoration: inherit;
  }

  body {
    margin: 16px;
    min-height: 100vh;
    word-break: keep-all;
    padding: 0 2rem;
    ${orBelow(
      BreakPoint.DesktopSmall,
      css`
        margin: 8px;
      `
    )}
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

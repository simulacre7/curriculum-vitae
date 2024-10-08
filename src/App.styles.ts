import { css, Theme } from '@emotion/react';

import { BreakPoint, orBelow } from './styles';

export const globalStyles = (theme: Theme) => css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    font-family:
      Pretendard,
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

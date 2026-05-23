import { css } from '@emotion/react';

export const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  :root {
    color: #e8f2ea;
    background: #070907;
    font-family:
      "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-synthesis: none;
    line-height: 1.45;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    min-height: 100dvh;
    background:
      radial-gradient(circle at 15% 0%, rgba(34, 197, 94, 0.16), transparent 26rem),
      radial-gradient(circle at 100% 30%, rgba(236, 72, 153, 0.12), transparent 24rem),
      #070907;
  }

  @media (max-width: 720px) {
    html,
    body,
    #root {
      width: 100%;
      max-width: 100%;
      min-height: 100%;
      overflow-x: hidden;
    }

    body {
      min-width: 0;
      overflow: hidden;
      background:
        radial-gradient(circle at 15% 0%, rgba(34, 197, 94, 0.13), transparent 18rem),
        #070907;
    }
  }

  a {
    color: inherit;
  }

  button,
  input {
    font: inherit;
  }
`;

export const screenStyle = css`
  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px;
  color: #e8f2ea;

  @media (max-width: 720px) {
    display: flex;
    width: 100%;
    max-width: 100%;
    min-height: 100svh;
    padding: max(8px, env(safe-area-inset-top))
      max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom))
      max(8px, env(safe-area-inset-left));
  }
`;

export const terminalStyle = css`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - 48px);
  min-height: calc(100dvh - 48px);
  border: 1px solid rgba(232, 242, 234, 0.18);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(5, 7, 5, 0.88);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.46);

  @media (max-width: 720px) {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    min-height: auto;
    height: calc(100svh - max(16px, env(safe-area-inset-top)) - max(8px, env(safe-area-inset-bottom)));
    border-radius: 7px;
  }
`;

export const titleBarStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(232, 242, 234, 0.14);
  background: rgba(255, 255, 255, 0.04);

  @media (max-width: 720px) {
    gap: 8px;
    min-height: 40px;
    padding: 0 10px;
  }

  @media (max-width: 520px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    min-height: 0;
    padding: 8px 10px;
  }
`;

export const trafficLightsStyle = css`
  display: flex;
  gap: 8px;

  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  span:nth-of-type(1) {
    background: #ff5f57;
  }

  span:nth-of-type(2) {
    background: #febc2e;
  }

  span:nth-of-type(3) {
    background: #28c840;
  }

  @media (max-width: 420px) {
    gap: 6px;

    span {
      width: 10px;
      height: 10px;
    }
  }
`;

export const titleStyle = css`
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  color: rgba(232, 242, 234, 0.72);
  font-size: 0.82rem;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 420px) {
    font-size: 0.74rem;
  }

  @media (max-width: 520px) {
    padding-right: 0;
  }
`;

export const toolbarStyle = css`
  flex: 0 0 auto;
  display: flex;
  gap: 8px;

  button {
    min-width: 38px;
    height: 28px;
    border: 1px solid rgba(232, 242, 234, 0.16);
    border-radius: 6px;
    padding: 0 10px;
    color: rgba(232, 242, 234, 0.82);
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
  }

  button:hover {
    border-color: rgba(82, 246, 139, 0.5);
    color: #b7f7c8;
  }

  @media (max-width: 520px) {
    grid-column: 1 / -1;
    max-width: 100%;
    overflow-x: auto;
    padding-top: 6px;
    scrollbar-width: none;
    gap: 4px;

    &::-webkit-scrollbar {
      display: none;
    }

    button {
      flex: 0 0 auto;
      min-width: 0;
      height: 26px;
      padding: 0 7px;
      font-size: 0.78rem;
    }
  }
`;

export const bodyStyle = css`
  position: relative;
  min-height: 0;
  padding: 18px;
  overflow: auto;
  scrollbar-color: rgba(82, 246, 139, 0.42) transparent;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 720px) {
    padding: 14px 12px calc(16px + env(safe-area-inset-bottom));
    overscroll-behavior: contain;
  }

  @media (max-width: 420px) {
    padding: 12px 10px calc(14px + env(safe-area-inset-bottom));
  }
`;

export const outputStyle = css`
  margin: 0;
  max-width: 100%;
  color: #d8e8db;
  font-size: 0.95rem;
  letter-spacing: 0;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 720px) {
    font-size: 0.84rem;
    line-height: 1.55;
  }

  @media (max-width: 380px) {
    font-size: 0.8rem;
  }
`;

export const lineStyle = css`
  min-height: 1.45em;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 720px) {
    min-height: 1.55em;
  }
`;

export const commandStyle = css`
  color: #82f6a3;
`;

export const stderrStyle = css`
  color: #ff8e7f;
`;

export const systemStyle = css`
  color: #a8b9ad;
`;

export const promptRowStyle = css`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-top: 2px;
  min-height: 1.45em;

  @media (max-width: 720px) {
    gap: 0 7px;
    min-height: 1.55em;
  }
`;

export const promptStyle = css`
  flex: 0 0 auto;
  color: #82f6a3;
  white-space: nowrap;
`;

export const commandInputTextStyle = css`
  flex: 1 1 8ch;
  min-width: 1ch;
  color: #f1fff4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const caretStyle = css`
  display: inline-block;
  width: 0.62ch;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: -0.16em;
  background: #82f6a3;
  animation: terminal-caret-blink 1s steps(1, end) infinite;

  @keyframes terminal-caret-blink {
    0%,
    50% {
      opacity: 1;
    }

    51%,
    100% {
      opacity: 0;
    }
  }
`;

export const inputStyle = css`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1px;
  height: 1px;
  border: 0;
  outline: 0;
  padding: 0;
  opacity: 0;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  pointer-events: none;
`;

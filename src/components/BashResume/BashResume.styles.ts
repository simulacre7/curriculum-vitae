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
    background:
      radial-gradient(circle at 15% 0%, rgba(34, 197, 94, 0.16), transparent 26rem),
      radial-gradient(circle at 100% 30%, rgba(236, 72, 153, 0.12), transparent 24rem),
      #070907;
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
  padding: 24px;
  color: #e8f2ea;

  @media (max-width: 720px) {
    padding: 12px;
  }
`;

export const terminalStyle = css`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - 48px);
  border: 1px solid rgba(232, 242, 234, 0.18);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(5, 7, 5, 0.88);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.46);

  @media (max-width: 720px) {
    min-height: calc(100vh - 24px);
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
`;

export const titleStyle = css`
  min-width: 0;
  overflow: hidden;
  color: rgba(232, 242, 234, 0.72);
  font-size: 0.82rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const toolbarStyle = css`
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
`;

export const bodyStyle = css`
  position: relative;
  min-height: 0;
  padding: 18px;
  overflow: auto;
  scrollbar-color: rgba(82, 246, 139, 0.42) transparent;

  @media (max-width: 720px) {
    padding: 14px;
  }
`;

export const outputStyle = css`
  margin: 0;
  color: #d8e8db;
  font-size: 0.95rem;
  letter-spacing: 0;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const lineStyle = css`
  min-height: 1.45em;
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
  align-items: baseline;
  gap: 8px;
  margin-top: 2px;
  min-height: 1.45em;
`;

export const promptStyle = css`
  flex: 0 0 auto;
  color: #82f6a3;
  white-space: nowrap;
`;

export const commandInputTextStyle = css`
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

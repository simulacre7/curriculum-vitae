import { css, SerializedStyles } from '@emotion/react';

export enum BreakPoint {
  MobileSmall = 319,
  MobileDefault = 374,
  DesktopSmall = 767,
  DesktopMedium = 1169,
  DesktopDefault = 1279,
  DesktopLarge = 1439,

  GridLarge = DesktopMedium,
  GridMedium = 999,
  GridSmall = 599,
}

// 특정 width 이하
export const orBelow = (
  width: number,
  style: SerializedStyles
): SerializedStyles => css`
  @media (max-width: ${width}px) {
    ${style};
  }
`;

// min 초과부터 max 이하까지
export const between = (
  min: number,
  max: number,
  style: SerializedStyles
): SerializedStyles => css`
  @media (min-width: ${min + 1}px) and (max-width: ${max}px) {
    ${style};
  }
`;

// 특정 width 초과
export const greaterThan = (
  width: number,
  style: SerializedStyles
): SerializedStyles => css`
  @media (min-width: ${width + 1}px) {
    ${style};
  }
`;

export const touchDevice = (style: SerializedStyles): SerializedStyles => css`
  @media (hover: none),
    (pointer: coarse),
    (hover: none) and (pointer: coarse),
    (hover: none) and (pointer: fine) {
    ${style};
  }
`;

export const hover = (style: SerializedStyles): SerializedStyles => css`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      ${style};
    }
  }
`;

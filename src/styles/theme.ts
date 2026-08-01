export type CurriculumVitaeTheme = {
  colorScheme: 'light' | 'dark';
  colors: {
    white: string;
    black: string;
    brightGreen: string;
    deepGreen: string;
    green: string;
    grey: string;
  };
};

export const lightTheme: CurriculumVitaeTheme = {
  colorScheme: 'light',
  colors: {
    white: '#ffffff',
    black: '#000000',
    brightGreen: '#9dddc6',
    deepGreen: '#008080',
    green: '#3eb489',
    grey: '#5e5e5e',
  },
};

// TODO: dark mode 디자인
export const darkTheme: CurriculumVitaeTheme = {
  colorScheme: 'dark',
  colors: {
    white: '#ffffff',
    black: '#000000',
    brightGreen: '#9dddc6',
    deepGreen: '#008080',
    green: '#3eb489',
    grey: '#5e5e5e',
  },
};

export const defaultTheme = lightTheme;

declare module '@emotion/react' {
  export interface Theme extends CurriculumVitaeTheme {}
}

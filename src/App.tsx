import { useState } from 'react';

import { Global, ThemeProvider } from '@emotion/react';

import * as styles from './App.styles';
import { CurriculumVitae } from './components';
import { defaultTheme } from './styles';

function App() {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theme, _] = useState(defaultTheme);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={styles.globalStyles} />
      <CurriculumVitae />
    </ThemeProvider>
  );
}

export default App;

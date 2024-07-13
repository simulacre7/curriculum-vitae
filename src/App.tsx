import { Global, ThemeProvider } from '@emotion/react';
import { defaultTheme } from './styles/theme';

import * as styles from './App.styles';
import { useState } from 'react';
import { Content } from './Content';

function App() {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theme, _] = useState(defaultTheme);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={styles.globalStyles} />
      <Content />
    </ThemeProvider>
  );
}

export default App;

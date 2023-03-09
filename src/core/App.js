import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import Routes from 'routes';
import themes from 'themes';
import { config } from 'config';
import NavigationScroll from 'layout/NavigationScroll';

import 'react-toastify/dist/ReactToastify.css';
import 'assets/scss/style.scss';
import InternetCheck from 'components/InternetCheck';

const App = () => {
  const customization = useSelector(({customization}) => customization);

  return (
    <Router basename={config.basename}>
      <InternetCheck/>
      <StyledEngineProvider injectFirst>
        <ToastContainer
          enableMultiContainer
          containerId={'top-right'}
          autoClose={2000}
          closeButton={true}
          position='top-right'
          theme='light'
          hideProgressBar
        />
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  );
};

export default Sentry.withProfiler(App);

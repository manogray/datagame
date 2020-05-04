import React from 'react';
import { Router } from 'react-router-dom';

import history from './services/history';
import Routes from './routes';

import { Helmet } from 'react-helmet';
import GlobalStyle from './styles/global';

function App() {
  return (
    <Router history={history}>
      <Helmet>
        <link href="https://fonts.googleapis.com/css?family=Montserrat|Poppins&display=swap" rel="stylesheet" />
      </Helmet>
      <GlobalStyle />
      <Routes />
    </Router>
  );
}

export default App;

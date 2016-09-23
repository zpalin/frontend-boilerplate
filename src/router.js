import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import store from './store';

import App from './components/App.jsx';

export default () => {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={App} >
      </Route>
    </Router>
  );
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';

window._ = _;

import Router from './router';
import store from './store';
window.store = store;

function start() {
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>
    , document.querySelector('.react-mount'));
}

start();

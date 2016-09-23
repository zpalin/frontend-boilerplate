import { combineReducers } from 'redux';

import appReducer from './app_reducer';

const rootReducer = combineReducers({
  app: appReducer
});

export default rootReducer;

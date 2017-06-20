import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import { pagination } from 'violet-paginator';

import auth from './auth';
import counter from './counter';
import { reducer as formReducer } from 'redux-form';
import info from './info';
import widgets from './widgets';
import modal from './modal';
import map from './map';
import requests from './requests';
import search from './search';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form: formReducer,
  modal,
  map,
  requests,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  pagination,
  widgets,
  search
});

/**
 * Created by einar.adalsteinsson on 12/23/16.
 */
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/root-reducer';
import {Provider} from 'react-redux'
import {AppProvider} from '../components/AppProvider';

injectTapEventPlugin();

let store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <AppProvider/>
    </Provider>,
    document.querySelector('[data-application]')
);

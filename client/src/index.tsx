import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import React from "react";
import * as serviceWorker from "./serviceWorker";
import { Provider, connect, MapStateToPropsParam, MapDispatchToPropsParam } from "react-redux";
import store from "./store";
import AppState from "./models/AppState";
import { Dispatch, bindActionCreators } from "redux";
import actions from "./actions";
import ActionCreator from "./models/ActionCreator";

const mapStateToProps: MapStateToPropsParam<AppState, any, any> = (state: AppState): any => {
  return {
    state: state
  };
};

const mapDispatchToProps: MapDispatchToPropsParam<ActionCreator, any> = (dispatch: Dispatch): any => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConnectedApp />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
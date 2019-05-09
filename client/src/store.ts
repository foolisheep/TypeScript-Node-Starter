import thunkMiddleware from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as reducers from "./reducers";

const store: any = createStore(
    combineReducers(reducers),
    applyMiddleware(
      thunkMiddleware
    )
);

export default store;
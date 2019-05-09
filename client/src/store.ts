import thunkMiddleware from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as reducers from "./reducers";
import logger from "./utils/logger";

const store: any = createStore(
    combineReducers(reducers),
    applyMiddleware(
      thunkMiddleware,
      logger
    )
);

export default store;
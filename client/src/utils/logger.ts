import { AnyAction as Action, MiddlewareAPI } from "redux";

const logger: any = (store: MiddlewareAPI<any>) => (next: any) => (action: Action) => {
    console.group(action.type);
    console.info("dispatching", action);
    const result: any = next(action);
    console.log("next state", store.getState());
    console.groupEnd();
    return result;
};

export default logger;
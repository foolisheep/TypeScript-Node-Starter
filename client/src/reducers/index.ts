import AppState from "../models/AppState";
import { AnyAction as Action } from "redux";
import { AUTHORIZE_SUCCESS, CONSENT_REQUEST_FAILED, CONSENT_REQUEST_SUCCESS } from "../actions";

// TODO
const initialState: AppState = {
    user: undefined,
};

const reducer = (state: AppState = initialState, action: Action) => {
    switch (action.type) {
        case CONSENT_REQUEST_SUCCESS:
        case AUTHORIZE_SUCCESS:
            return { ...state, user: action.user };
        case CONSENT_REQUEST_FAILED:
        default:
            return state;
    }
};

export default reducer;
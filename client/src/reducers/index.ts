import AppState from "../models/AppState";
import { AnyAction as Action } from "redux";
import { AUTHENTICATE_SUCCESS, CONSENT_REQUEST_SUCCESS, LOGOUT, LOGIN_SUCCESS } from "../actions";

// TODO
const initialState: AppState = {
    user: undefined,
};

const reducer = (state: AppState = initialState, action: Action) => {
    switch (action.type) {
        case LOGOUT:
            return { ...state, user: undefined };
        case CONSENT_REQUEST_SUCCESS:
        case AUTHENTICATE_SUCCESS:
        case LOGIN_SUCCESS:
            return { ...state, user: action.user };
        default:
            return state;
    }
};

export default reducer;
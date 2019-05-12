import ActionCreator from "./models/ActionCreator";
import User from "../../models/User";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "./utils/fetch";
import NetworkError from "./models/NetworkError";
import { ACCESS_TOKEN_KEY } from "./constants";

export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";
export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const AUTHENTICATE_FAILED: string = "AUTHENTICATE_FAILED";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const LOGOUT: string = "LOGOUT";

const actionCreator: ActionCreator = {
    allowConsent(transactionId: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/oauth2/authorize/decision", { transaction_id: transactionId }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, json.accessToken);
                    dispatch({
                        type: CONSENT_REQUEST_SUCCESS,
                        user: json.user
                    });
                } else {
                    console.error("null accessToken or null user profile");
                    dispatch({ type: CONSENT_REQUEST_FAILED});
                }
            }, (error: NetworkError) => {
                console.error(`${error.status}: ${error.statusText}`);
                dispatch({ type: CONSENT_REQUEST_FAILED});
            });
        };
    },
    denyConsent(): Action {
        return {
            type: CONSENT_REQUEST_FAILED
        };
    },
    authenticate(): any {
        return (dispatch: Dispatch<any>): void => {
            if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
                dispatch({ type: AUTHENTICATE_FAILED});
            } else {
                fetch("/oauth2/profile", undefined, "GET", true)
                .then((json: any) => {
                    if (json.user) {
                        dispatch({
                            type: AUTHENTICATE_SUCCESS,
                            user: json.user
                        });
                    } else {
                        console.error("null user profile");
                        dispatch({ type: AUTHENTICATE_FAILED});
                    }
                }, (error: NetworkError) => {
                    console.error(`${error.status}: ${error.statusText}`);
                    dispatch({ type: AUTHENTICATE_FAILED});
                });
            }
        };
    },
    login(email: string, password: string): any {
        return (dispatch: Dispatch<any>): void => {
            fetch("/oauth2/login", { email: email, password: password }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, json.accessToken);
                    dispatch({
                        type: LOGIN_SUCCESS,
                        user: json.user
                    });
                } else {
                    console.error("null user profile");
                    dispatch({ type: LOGIN_FAILED});
                }
            }, (error: NetworkError) => {
                console.error(`${error.status}: ${error.statusText}`);
                dispatch({ type: LOGIN_FAILED});
            });
        };
    },
    logout(): Action {
        localStorage.setItem(ACCESS_TOKEN_KEY, "");
        return {
            type: LOGOUT
        };
    }
};

export default actionCreator;
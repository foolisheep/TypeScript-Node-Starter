import ActionCreator from "./models/ActionCreator";
import User from "../../models/User";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "./utils/fetch";
import NetworkError from "./models/NetworkError";
import { ACCESS_TOKEN_KEY } from "./constants";

export const CONSENT_REQUEST_START: string = "CONSENT_REQUEST_START";
export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";

const actionCreator: ActionCreator = {
    allowConsent(transactionId: string): any {
        return (dispatch: Dispatch<any>): void => {
            // dispatch(actionCreator.startConsentRequest(transactionId));
            fetch("/oauth2/authorize/decision", { transaction_id: transactionId }, "POST")
            .then((json: any) => {
                if (json.user && json.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN_KEY, json.accessToken);
                    dispatch(actionCreator.handleConsentResponse(json.user));
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
    startConsentRequest(transactionId: string): Action {
        return {
            type: CONSENT_REQUEST_START
        };
    },
    handleConsentResponse(user: User): Action {
        return {
            type: CONSENT_REQUEST_SUCCESS,
            user: user
        };
    }
};

export default actionCreator;
import ActionCreator from "./models/ActionCreator";
import User from "../../models/User";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "./utils/fetch";
import NetworkError from "./models/NetworkError";

export const CONSENT_REQUEST_START: string = "CONSENT_REQUEST_START";
export const CONSENT_REQUEST_SUCCESS: string = "CONSENT_REQUEST_SUCCESS";
export const CONSENT_REQUEST_FAILED: string = "CONSENT_REQUEST_FAILED";

export default {
    allowConsent(transactionId: string): any {
        return (dispatch: Dispatch): void => {
            dispatch(this.startConsentRequest(transactionId));
            fetch("/oauth2/authorize/decision", { transaction_id: this.transactionId }, "POST")
            .then((json: any) => {
                localStorage.setItem("accessToken", json.accessToken);
                dispatch(this.handleConsentResponse(json.profile));
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
} as ActionCreator;
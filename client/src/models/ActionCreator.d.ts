import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import FetchError from "./FetchError";

export default interface ActionCreator extends ActionCreatorsMapObject {
    allowConsent(transactionId: string): any;
    denyConsent(): Action;
    authenticate(): any;
    login(email: string, password: string): any;
    logout(): Action;
    handleHttpError(type: string, error: FetchError): Action;
}
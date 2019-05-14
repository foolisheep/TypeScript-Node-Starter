import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import HttpError from "./HttpError";

export default interface ActionCreator extends ActionCreatorsMapObject {
    allowConsent(transactionId: string): any;
    denyConsent(): Action;
    authenticate(): any;
    login(email: string, password: string): any;
    logout(): Action;
    handleHttpError(type: string, error: HttpError): Action;
}
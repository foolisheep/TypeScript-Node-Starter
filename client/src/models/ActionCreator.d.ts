import { ActionCreatorsMapObject, AnyAction as Action } from "redux";

export default interface ActionCreator extends ActionCreatorsMapObject {
    allowConsent(transactionId: string): any;
    denyConsent(): Action;
    authenticate(): any;
    login(email: string, password: string): any;
    logout(): Action;
    handleFetchError(type: string, error: Error): Action;
}
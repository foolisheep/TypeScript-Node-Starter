import { ActionCreatorsMapObject, AnyAction as Action } from "redux";

export default interface ActionCreator extends ActionCreatorsMapObject {
    allowConsent(transactionId: string): any;
    denyConsent(): Action;
    handleConsentResponse(profile: User): Action;
    authorize(): any;
}
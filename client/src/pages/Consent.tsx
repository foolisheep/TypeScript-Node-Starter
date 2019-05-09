import React from "react";
import NotFound from "./NotFound";
import AppState from "../models/AppState";
import ActionCreator from "../models/ActionCreator";
import connectPropsAndActions from "../utils/connect";

interface IProps {
    location: Location;
    state: AppState;
    actions: ActionCreator;
}

interface IStates {}
class Consent extends React.Component<IProps, IStates> {
    params: URLSearchParams;
    transactionId: string | null;
    constructor(props: IProps) {
        super(props);
        this.params = new URLSearchParams(this.props.location.search);
        this.transactionId = this.params.get("transactionID");
    }
    render(): React.ReactElement<any> {
        if (!this.transactionId) {
            return <NotFound location={this.props.location}/>;
        } else {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Hi {this.params.get("email")},</h3>
                        <h3>{this.params.get("client_name")} is requesting access to your account.</h3>
                        <h3>Do you approve?</h3>
                    </div>
                    <div className="form-horizontal">
                        <input name="transaction_id" type="hidden" value={this.transactionId} />
                        <div className="btn-toolbar">
                            <button className="btn btn-success" onClick={this._allow}>Allow</button>
                            <button className="btn btn-warning" onClick={this._deny}>Deny</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    private _allow = () => {
        if (this.transactionId) {
            this.props.actions.allowConsent(this.transactionId);
        }
    }

    private _deny = () => {
        this.props.actions.denyConsent();
    }
}

export default connectPropsAndActions(Consent);
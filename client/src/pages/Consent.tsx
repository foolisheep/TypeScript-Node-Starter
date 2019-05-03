import React from "react";
import NotFound from "./NotFound";
import fetch from "../utils/fetch";
import NetworkError from "../models/NetworkError";

interface IProps {
    location: Location;
}

interface IStates {}
export default class Consent extends React.Component<IProps, IStates> {
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
                            <button className="btn btn-warning">Deny</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    private _allow = () => {
        fetch("/oauth2/authorize/decision", { transaction_id: this.transactionId }, "POST")
        .then((json: any) => {
            console.log("response.json is " + JSON.stringify(json));
            localStorage.setItem("accessToken", json.accessToken);
            // TODO: redirect or change the state
        }, (error: NetworkError) => {
            console.log(`error is ${error.status}: ${error.statusText}`);
            // TODO: redirect or change the state
        });
    }
}
import React from "react";
import NotFound from "./NotFound";

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
        console.log("this._allow is called");
        const url: string = "http://localhost:3000/oauth2/authorize/decision";
        const body: any = {transaction_id: this.transactionId};
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow", // manual, *follow, error
            body: JSON.stringify(body), // body data type must match "Content-Type" header
        }).then((response: Response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText
                });
            }
        }).then((json: any) => {
            console.log("response.json is " + JSON.stringify(json));
        }, (error: any) => {
            console.log(`error is ${error.status}: ${error.statusText}`);
        });
    }
}
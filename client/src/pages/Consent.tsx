import React from "react";
import NotFound from "./NotFound";

interface IProps {
    location: Location;
}

interface IStates {}
export default class Consent extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        const params: URLSearchParams = new URLSearchParams(this.props.location.search);
        const transactionId: string | null = params.get("transactionID");
        if (!transactionId) {
            return <NotFound location={this.props.location}/>;
        } else {
            return (
                <div className="container">
                    <div className="page-header">
                        <p><h3>Hi {params.get("email")},</h3></p>
                        <p><h3>{params.get("client_name")} is requesting access to your account.</h3></p>
                        <p><h3>Do you approve?</h3></p>
                    </div>
                    <form className="form-horizontal" action="/oauth2/authorize/decision" method="post">
                        <input name="transaction_id" type="hidden" value={transactionId} />
                        <div className="btn-toolbar">
                            <button className="btn btn-success" type="submit" value="Allow" id="allow">Allow</button>
                            <button className="btn btn-warning" type="submit" value="Deny" id="deny">Deny</button>
                        </div>
                    </form>
                </div>
            );
        }
    }
}
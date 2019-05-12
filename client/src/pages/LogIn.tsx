import React, { RefObject } from "react";
import connectPropsAndActions from "../utils/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import ActionCreator from "../models/ActionCreator";
import _ from "lodash";

interface IProps {
    state: AppState;
    actions: ActionCreator;
}

interface IStates {}
class LogIn extends React.Component<IProps, IStates> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    constructor(props: IProps) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Sign in</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" ref={this.emailRef} placeholder="Email" autoFocus={true} required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="password" ref={this.passwordRef} placeholder="Password" required={true} /></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7"><button className="col-sm-3 btn btn-primary" onClick={ this._login }><i className="fa fa-user"></i>Login</button></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7">
                                <hr/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }

    private _login = (): void => {
        console.log("this._login is called");
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        if (_.isString(email) && _.isString(password)) {
            this.props.actions.login(email, password);
        } else {
            // TODO: prompt error
        }
    }
}

export default connectPropsAndActions(LogIn);
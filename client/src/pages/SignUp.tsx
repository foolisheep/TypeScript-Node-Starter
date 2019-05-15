import React, { RefObject } from "react";
import connectPropsAndActions from "../utils/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import fetch from "../utils/fetch";
import FetchError from "../models/FetchError";
import ActionCreator from "../models/ActionCreator";
import { SIGN_UP_FAILED } from "../actions";

interface Props {
    state: AppState;
    actions: ActionCreator;
}

interface States {}
class SignUp extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    confirmPasswordRef: RefObject<HTMLInputElement>;
    nameRef: RefObject<HTMLInputElement>;
    genderRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.nameRef = React.createRef();
        this.genderRef = React.createRef();
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Sign up</h3>
                    </div>
                    <div className="form-horizontal" id="sign-up-form">
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" ref={this.emailRef} placeholder="Email" autoFocus={true} required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="password" ref={this.passwordRef} placeholder="Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="confirmPassword" ref={this.confirmPasswordRef} placeholder="Confirm Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="name">Name</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="name" ref={this.nameRef} placeholder="Name" required={true} /></div>
                        </div>
                        <div className="form-group input-group-prepend">
                            <label className="col-sm-3 control-label" htmlFor="gender">Gender</label>
                            <div className="col-sm-7">
                                <label className="radio-inline radio" htmlFor="male"><input name="gender" type="radio" value="male" ref={this.genderRef}/><span>Male</span></label>
                                <label className="radio-inline radio" htmlFor="female"><input name="gender" type="radio" value="female"/><span>Female</span></label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7"><button className="btn btn-success" onClick={ this._signUp }><i className="fa fa-user-plus"></i>Signup</button></div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
    private _signUp = (): void => {
        console.log("this._signUp is called");
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        const name: any = this.nameRef.current && this.nameRef.current.value;
        const gender: string = this.genderRef.current && this.genderRef.current.checked ? "male" : "female";
        fetch("/oauth2/signup", { email, password, confirmPassword, name, gender }, "POST")
        .then((json: any) => {
            console.log(JSON.stringify(json));
        }, (error: FetchError) => {
            this.props.actions.handleHttpError(SIGN_UP_FAILED, error);
        });
    }
}

export default connectPropsAndActions(SignUp);
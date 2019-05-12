import React from "react";
import connectPropsAndActions from "../utils/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";

interface IProps {
    state: AppState;
}

interface IStates {}
class SignUp extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        if (!this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Sign up</h3>
                    </div>
                    <form className="form-horizontal" id="sign-up-form" action="/oauth2/signup" method="POST">
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" placeholder="Email" autoFocus={true} required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="password" placeholder="Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="col-sm-7"><input className="form-control" type="password" name="confirmPassword" placeholder="Confirm Password" required={true} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="name">Name</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="name" placeholder="Name" required={true} /></div>
                        </div>
                        <div className="form-group input-group-prepend">
                            <label className="col-sm-3 control-label" htmlFor="gender">Gender</label>
                            <div className="col-sm-7">
                                <label className="radio-inline radio" htmlFor="male"><input name="gender" type="radio" value="male"/><span>Male</span></label>
                                <label className="radio-inline radio" htmlFor="female"><input name="gender" type="radio" value="female"/><span>Female</span></label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-7"><button className="btn btn-success" type="submit"><i className="fa fa-user-plus"></i>Signup</button></div>
                        </div>
                    </form>
                </div>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default connectPropsAndActions(SignUp);
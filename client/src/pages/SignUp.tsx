import React from "react";

interface IProps {}

interface IStates {}
export default class SignUp extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
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
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-7"><button className="btn btn-success" type="submit"><i className="fa fa-user-plus"></i>Signup</button></div>
                    </div>
                </form>
            </div>
        );
    }
}
import React from "react";

interface IProps {}

interface IStates {}
export default class SignIn extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <div className="page-header">
                    <h3>Sign in</h3>
                </div>
                <form className="form-horizontal" action="/oauth2/signin" method="POST"><input type="hidden" name="_csrf" />
                    <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                        <div className="col-sm-7"><input className="form-control" type="email" name="email" id="email" placeholder="Email" autoFocus={true} required={true} /></div>
                    </div>
                    <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                        <div className="col-sm-7"><input className="form-control" type="password" name="password" id="password" placeholder="Password" required={true} /></div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-7"><button className="col-sm-3 btn btn-primary" type="submit"><i className="fa fa-user"></i>Login</button><a className="btn btn-link" href="/forgot">Forgot your password?</a></div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-7">
                            <hr/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
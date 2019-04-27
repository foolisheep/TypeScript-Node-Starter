import React from "react";

interface IProps {}

interface IStates {}
export default class SignUp extends React.Component<IProps, IStates> {
    private emailInput: React.RefObject<HTMLInputElement>;
    private passwordInput: React.RefObject<HTMLInputElement>;
    private confirmPasswordInput: React.RefObject<HTMLInputElement>;
    constructor(props: IProps) {
        super(props);
        this.emailInput = React.createRef();
        this.passwordInput = React.createRef();
        this.confirmPasswordInput = React.createRef();
    }
    render(): React.ReactElement<any> {
        return (
            <div className="container">
                <div className="page-header">
                    <h3>Sign up</h3>
                </div>
                <div className="form-horizontal" id="sign-up-form">
                    <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                        <div className="col-sm-7"><input className="form-control" type="email" name="email" ref={this.emailInput} placeholder="Email" autoFocus={true} required={true} /></div>
                    </div>
                    <div className="form-group"><label className="col-sm-3 control-label" htmlFor="password">Password</label>
                        <div className="col-sm-7"><input className="form-control" type="password" name="password" ref={this.passwordInput} placeholder="Password" required={true} /></div>
                    </div>
                    <div className="form-group"><label className="col-sm-3 control-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="col-sm-7"><input className="form-control" type="password" name="confirmPassword" ref={this.confirmPasswordInput} placeholder="Confirm Password" required={true} /></div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-7"><button className="btn btn-success" type="submit" onClick={this._submit}><i className="fa fa-user-plus"></i>Signup</button></div>
                    </div>
                </div>
            </div>
        );
    }

    private _submit = (): void => {
        console.log("this._submit is called!");
        const body: any = {
            email: this.emailInput.current && this.emailInput.current.value,
            password: this.passwordInput.current && this.passwordInput.current.value,
            confirmPassword: this.confirmPasswordInput.current && this.confirmPasswordInput.current.value,
        };
        fetch("http://localhost:3000/oauth2/signup", {
            method: "POST",
            redirect: "follow",
            body: body
        })
        .then((response: Response) => {
            // HTTP 301 response
            console.log(JSON.stringify(response.body));
        })
        .catch(function(err) {
            console.info(err);
        });
    }
}
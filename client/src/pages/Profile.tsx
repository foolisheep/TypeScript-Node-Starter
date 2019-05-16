import React from "react";
import connectPropsAndActions from "../utils/connect";
import AppState from "../models/AppState";
import ErrorPage from "./ErrorPage";

interface Props {
    state: AppState;
}

interface States {}
class Profile extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (this.props.state.user) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h3>Edit Profile</h3>
                    </div>
                    <div className="form-horizontal"><input type="hidden" name="_csrf" />
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="email">Email</label>
                            <div className="col-sm-7"><input className="form-control" type="email" name="email" id="email" value={this.props.state.user.email} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="name">Name</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="name" id="name" value={this.props.state.user.name} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label">Gender</label>
                            <div className="col-sm-6">
                                <label className="radio radio-inline"><input type="radio" checked={this.props.state.user.gender === "male"} name="gender" value="male" data-toggle="radio"/><span>Male</span></label>
                                <label className="radio radio-inline"><input type="radio" checked={this.props.state.user.gender === "female"} name="gender" value="female" data-toggle="radio"/><span>Female</span></label>
                            </div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="address">Address</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="address" id="address" value={this.props.state.user.address} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label" htmlFor="website">Website</label>
                            <div className="col-sm-7"><input className="form-control" type="text" name="website" id="website" value={this.props.state.user.website} /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-3 control-label">Photo</label>
                            <div className="col-sm-4"><img className="profile" src={this.props.state.user.avatarUrl} width="100" height="100" alt={this.props.state.user.name} /></div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-4"><button className="btn btn btn-primary" type="submit"><i className="fa fa-pencil"></i>Update</button></div>
                        </div>
                    </div>
                </div>
            );
        } else {
            const error: Error = {
                name: "401 Unauthorized",
                message: "Please log in first."
            };
            return <ErrorPage error={error} />;
        }
    }
}

export default connectPropsAndActions(Profile);
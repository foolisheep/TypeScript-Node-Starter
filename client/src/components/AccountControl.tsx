import React from "react";
import AppState from "../models/AppState";
import ActionCreator from "../models/ActionCreator";
import connectPropsAndActions from "../utils/connect";
import { Link } from "react-router-dom";

interface IProps {
    state: AppState;
    actions: ActionCreator;
}

interface IStates {}
class AccountControl extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return <ul className="nav navbar-nav navbar-right">
            {
                this.props.state.user ?
                <li className="dropdown"><a className="dropdown-toggle" href="#" data-toggle="dropdown">
                    <img className="img-thumbnail" src={this.props.state.user.avatarUrl} alt={this.props.state.user.name}/>
                        <span>{this.props.state.user.name}</span>
                    <i className="caret"></i></a>
                    <ul className="dropdown-menu">
                        <li><Link to="/profile">My Account</Link></li>
                        <li className="divider"></li>
                        <li><a href="#" onClick={this._logout}>Logout</a></li>
                    </ul>
                </li>
                :
                <li>Invalid account</li>
            }
        </ul>;
    }

    private _logout = () => {
        console.log("logout is clicked.");
    }
}

export default connectPropsAndActions(AccountControl);
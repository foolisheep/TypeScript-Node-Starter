import React from "react";
import { Link } from "react-router-dom";
import connectPropsAndActions from "../utils/connect";
import AppState from "../models/AppState";
import AccountControl from "./AccountControl";

interface IProps {
    to: string;
    location: Location;
}
interface IStates {
}
class NavItem extends React.Component<IProps, IStates> {

    render(): React.ReactElement<any> {
        return <li className={this.props.location.pathname === this.props.to ? "active" : undefined}>
            <Link {...this.props}>
                {this.props.children}
            </Link>
        </li>;
    }
}

interface IHeaderProps {
    location: Location;
    state: AppState;
}
interface IHeaderStates {}
class Header extends React.Component<IHeaderProps, IHeaderStates> {

    render(): React.ReactElement<any> {
        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header"><button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button>
                        <Link className="navbar-brand" to="/"><i className="fa fa-cube"></i>Typescript MERN Starter</Link>
                    </div>
                    <div className="collapse navbar-collapse">
                    {
                        this.props.state.user ?
                            <AccountControl />
                        :
                        <ul className="nav navbar-nav navbar-right">
                            <NavItem to="/login/" location={this.props.location}>Login</NavItem>
                            <NavItem to="/signup/" location={this.props.location}>Create Account</NavItem>
                        </ul>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default connectPropsAndActions(Header);
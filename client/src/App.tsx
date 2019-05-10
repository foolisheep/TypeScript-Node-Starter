import React from "react";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Consent from "./pages/Consent";

interface IProps {}

interface IStates {}

export default class App extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div>
                <Route component={Header} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/login" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/consent" render={ (props) => <Consent {...props} />} />
                    <Route component={NotFound}  />
                </Switch>
                <Footer />
            </div>
        );
    }
}
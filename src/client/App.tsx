import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import Login from "./Login";
import SignUp from "./SignUp";

interface IProps {}

interface IStates {}

export default class App extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div>
                <Route component={Header} />
                <Route exact path="/" component={Home} />
                <Route path="/contact" component={Contact} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
                <Footer />
            </div>
        );
    }
}
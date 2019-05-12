import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Consent from "./pages/Consent";
import Profile from "./pages/Profile";

interface IProps {}

interface IStates {}

export default class App extends React.Component<IProps, IStates> {
    render(): React.ReactElement<any> {
        return (
            <div>
                <Route render={ (props) => <Header {...props} /> } />
                <Switch>
                    <Route exact path="/" render={ (props) => <Home {...props} /> } />
                    <Route path="/login" render={ (props) => <LogIn {...props} /> } />
                    <Route path="/signup" render={ (props) => <SignUp {...props} /> } />
                    <Route path="/consent" render={ (props) => <Consent {...props} /> } />
                    <Route path="/profile" render={ (props) => <Profile {...props} /> } />
                    <Route component={NotFound}  />
                </Switch>
                <Footer />
            </div>
        );
    }
}
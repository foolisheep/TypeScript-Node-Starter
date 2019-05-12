// The Spec of OAuth2 defined 4 roles. They are user, resource server, client and authorization server.
// All request handlers of **authorization server** are located in this file.

import server from "../config/oauth2orize-server";
import passport from "passport";
import login from "connect-ensure-login";
import Client from "../models/OAuth/Client";
import ClientCollection from "../models/OAuth/ClientCollection";
import AccessToken from "../models/OAuth/AccessToken";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import UserDocument from "../models/User/UserDocument";
import UserCollection from "../models/User/UserCollection";
import { RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { MiddlewareRequest } from "oauth2orize";
import { random } from "../util/random";

// User authorization endpoint.
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request. In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary across
// implementations. Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction. It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization). We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.
export const authorization: RequestHandler[] = [
    login.ensureLoggedIn(),
    server.authorization(
        (clientId: string, redirectUri: string, done: (err: Error | null, client?: any, redirectURI?: string) => void) => {
            // Validate the client
            const client: Client = ClientCollection.find(
                (value: Client) => clientId === value.id
            );
            if (!client) {
                done(new Error("Invalid client!"));
            }
            if (client.redirectUri !== redirectUri) {
                done(new Error("Incorrect redirectUri!"));
            }
            return done(undefined, client, redirectUri);
        },
        (client: Client, user: UserDocument, scope: string[], type: string, areq: any,
            done: (err: Error | null, allow: boolean, info: any, locals: any) => void): void => {
            AccessTokenCollection.findOne(
                {clientId: client.id, userId: user.id},
                (error: Error, accessToken: AccessToken): void => {
                    if (accessToken) {
                        // Auto-approve
                        done(undefined, true, user, undefined);
                    } else {
                        done(undefined, false, user, undefined);
                    }
                }
            );
        }
    ),
    function (req: MiddlewareRequest, res: Response) {
      res.redirect(`http://localhost:${process.env.PORT}/consent?email=${req.user.email}&client_name=${req.oauth2.client.name}&transactionID=${req.oauth2.transactionID}`);
    }
];

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

export const decision: RequestHandler[] = [
    login.ensureLoggedIn(),
    server.decision()
];

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.
export const token: RequestHandler[] = [
    passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
    server.token(),
    server.errorHandler(),
];

/**
 * Create a new oauth2 user account.
 */
export const signUp: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
    req.assert("gender", "Gender is incorrect").isIn(["male", "female"]);
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    // TODO: Validate more fields, and respond the error correctly

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/signup");
    }
    let avatarUrl: string = req.body.avatarUrl;
    if (!avatarUrl) {
        avatarUrl = `/images/avatars/${req.body.gender}_${random.getRandomInt(1, 8).toString()}.png`;
    }
    const user: UserDocument = new UserCollection({
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        name: req.body.name,
        location: req.body.location,
        avatarUrl: avatarUrl
    });
    UserCollection.findOne({ email: req.body.email }, (err: Error, existingUser: UserDocument) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash("errors", { msg: "Account with that email address already exists." });
            return res.redirect("/signup");
        }
        user.save((err: any) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/auth/oauth2"); // Get access token
            });
        });
    });
  };

/**
 * Sign in using email and password.
 */
export const logIn: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password cannot be blank").notEmpty();
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/login");
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("errors", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash("success", { msg: "Success! You are logged in." });
            res.redirect("/auth/oauth2"); // Get access token
        });
    })(req, res, next);
};

export const profile: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.json({user: req.user});
};

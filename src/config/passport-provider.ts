import passport from "passport";
import passportLocal from "passport-local";
import UserCollection from "../models/User/UserCollection";
import User from "../models/User/User";
import { BasicStrategy } from "passport-http";
import { Strategy as ClientPasswordStrategy } from "passport-oauth2-client-password";
import { Strategy as BearerStrategy, IVerifyOptions } from "passport-http-bearer";
import ClientCollection from "../models/OAuth/ClientCollection";
import Client from "../models/OAuth/Client";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import AccessToken from "../models/OAuth/AccessToken";

const LocalStrategy = passportLocal.Strategy;

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done): void => {
    UserCollection.findOne({ email: email.toLowerCase() }, (err: Error, user: User): void => {
        if (err) {
            return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId: string, clientSecret: string, done: (error: Error, user?: any) => void) {
    const client: Client = ClientCollection.find((value: Client) => value.id === clientId);
    if (!client || client.secret !== clientSecret) {
        return done(undefined, false);
    }
    return done(undefined, client);
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    (accessToken: string, done: (error: Error, user?: any, options?: IVerifyOptions | string) => void) => {
        AccessTokenCollection.findOne({id: accessToken}, (error: Error, token: AccessToken): void => {
            if (error) return done(error);
            if (!token) return done(undefined, false);
            if (token.userId) {
                UserCollection.findById(token.userId, (error: Error, user: User) => {
                    if (error) return done(error);
                    if (!user) return done(undefined, false);
                    // To keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes.
                    done(undefined, user, { scope: "all", message: undefined });
                });
            } else {
                // The request came from a client only since userId is null,
                // therefore the client is passed back instead of a user.
                const client: Client = ClientCollection.find((value: Client) => value.id === token.clientId);
                if (!client) return done(undefined, false);
                // To keep this example simple, restricted scopes are not implemented,
                // and this is just for illustrative purposes.
                done(undefined, client, { scope:  "all", message: undefined});
            }
        });
    }
));
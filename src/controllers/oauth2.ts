// This module is modified from
// https://github.com/awais786327/oauth2orize-examples/blob/master/routes/oauth2.js

import oauth2orize, {
    OAuth2Server,
    SerializeClientDoneFunction,
    DeserializeClientDoneFunction,
    ExchangeDoneFunction
} from "oauth2orize";
import passport from "passport";
import login from "connect-ensure-login";
import Client from "../models/OAuth/Client";
import ClientCollection from "../models/OAuth/ClientCollection";
import AuthCode from "../models/OAuth/AuthCode";
import AuthCodeCollection from "../models/OAuth/AuthCodeCollection";
import AccessToken from "../models/OAuth/AccessToken";
import AccessTokenCollection from "../models/OAuth/AccessTokenCollection";
import User from "../models/User/User";
import { random } from "../util/random";
import UserCollection from "../models/User/UserCollection";
import { RequestHandlerParams } from "express-serve-static-core";

// Create OAuth 2.0 server
const server: OAuth2Server = oauth2orize.createServer();

// Function to issue and save a new access token
const issueToken = (clientId: string, userId: string, done: (err: Error | null, token?: string) => void): void => {
    const token = random.getUid(256);
    const accessToken: AccessToken = new AccessTokenCollection({
        id: token,
        clientId: clientId,
        userId: userId
    });
    accessToken.save((error: Error, accessToken: AccessToken): void => {
        if (error) {
            return done(error, undefined);
        }
        return done(undefined, accessToken.id);
    });
};

// Register serialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated. To complete the transaction, the
// user must authenticate and approve the authorization request. Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session. Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(
    (client: Client, done: SerializeClientDoneFunction) => done(undefined, client.id)
);

server.deserializeClient((id: string, done: DeserializeClientDoneFunction) => {
    done(undefined, ClientCollection.find((client: Client) => client.id === id));
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources. It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes. The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(
    (client: Client, redirectUri: string, user: User, res: any, issued: (err: Error | null, code?: string) => void) => {
        const code = random.getUid(16);
        const authCode: AuthCode = new AuthCodeCollection({
            id: code,
            clientId: client.id,
            userId: user.id,
            userName: user.profile.name,
            redirectUri: redirectUri
        });
        authCode.save((error: Error, authCode: AuthCode): void => {
            if (error) {
                return issued(error, undefined);
            }
            return issued(undefined, authCode.id);
        });
    })
);

// Grant implicit authorization. The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a token, which is bound to these
// values.

server.grant(oauth2orize.grant.token(
    (client: Client, user: User, res: any, done: (err: Error | null, token?: string, params?: any) => void) => {
        issueToken(client.id, user.id, done);
    })
);

// Exchange authorization codes for access tokens. The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code. The issued access token response can include a refresh token and
// custom parameters by adding these to the `done()` call

server.exchange(oauth2orize.exchange.code(
    (client: Client, code: string, redirectUri: string, done: ExchangeDoneFunction) => {
        AuthCodeCollection.findById(code, (error: Error, authCode: AuthCode) => {
            if (error) {
                return done(error);
            }
            if (client.id !== authCode.clientId) {
                return done(undefined, false);
            }
            if (redirectUri !== authCode.redirectUri) {
                return done(undefined, false);
            }
            // Everything validated, return the token
            issueToken(client.id, authCode.userId, done);
        });
    })
);

// Exchange user id and password for access tokens. The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

server.exchange(oauth2orize.exchange.password(
    (client: Client, email: string, password: string, scope: string[], done: ExchangeDoneFunction) => {
        // Validate the client
        const foundClient: Client = ClientCollection.find(
            (value: Client) => client.id === value.id
        );
        if (!foundClient || foundClient.secret !== client.secret) {
            return done(undefined, false);
        }
        // Validate the user
        UserCollection.findOne({ email: email.toLowerCase() }, (err: Error, user: User): void => {
            if (err) { return done(err); }
            if (!user) {
                return done(undefined, false);
            }
            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(undefined, false);
                }
                // Everything validated, return the token
                issueToken(client.id, user.id, done);
            });
          });
        }
    )
);

// Exchange the client id and password/secret for an access token. The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.

server.exchange(oauth2orize.exchange.clientCredentials(
    (client: Client, scope: string[], done: ExchangeDoneFunction) => {
        // Validate the client
        const foundClient: Client = ClientCollection.find(
            (value: Client) => client.id === value.id
        );
        if (!foundClient || foundClient.secret !== client.secret) {
            return done(undefined, false);
        }
        // Everything validated, return the token
        issueToken(client.id, undefined, done);
    })
);

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

export const authorization: RequestHandlerParams[] = [
    login.ensureLoggedIn(),
    server.authorization(
        (clientId: string, redirectUri: string, done: (err: Error | null, client?: any, redirectURI?: string) => void) => {
            // Validate the client
            const client: Client = ClientCollection.find(
                (value: Client) => clientId === value.id
            );
            if (!client) {
                done(new Error("Error: Invalid client!"));
            }
            if (client.redirectUri !== redirectUri) {
                done(new Error("Error: Incorrect redirectUri!"));
            }
            return done(undefined, client, redirectUri);
        },
        (client: any, user: any, scope: string[], type: string, areq: any,
            done: (err: Error | null, allow: boolean, info: any, locals: any) => void
            ): void => {
            // Auto-approve
            done(undefined, true, undefined, undefined);
        }
    )
];

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

export const token: RequestHandlerParams[] = [
    passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
    server.token(),
    server.errorHandler(),
];
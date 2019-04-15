// The Spec of OAuth2 defined 4 roles including user, resource server, client and authorization server.
// This file is part of **resource server**
import passport from "./passport-base";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { VerifyCallback } from "passport-oauth2";
import OAuth2Strategy from "./oauth2orize-strategy";
import User from "../models/User/User";
import _ from "lodash";
import Clients from "../models/OAuth/ClientCollection";

import UserCollection from "../models/User/UserCollection";
import { Request, Response, NextFunction } from "express";

passport.use("oauth2", new OAuth2Strategy({
    authorizationURL: "http://localhost:" + process.env.PORT + "/oauth2/authorize",
    tokenURL: "http://localhost:" + process.env.PORT + "/oauth2/token",
    clientID: Clients[0].id,
    clientSecret: Clients[0].secret,
    callbackURL: Clients[0].redirectUri
  },
  (accessToken: string, refreshToken: string, profile: User, verified: VerifyCallback) => {
    console.log("[OAuth2Strategy] applied, accessToken: " + accessToken + " and profile: " + JSON.stringify(profile));
    verified(undefined, profile, { accessToken: accessToken });
  }
));

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["name", "email", "link", "locale", "timezone"],
  passReqToCallback: true
}, (req: any, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    UserCollection.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
        done(err);
      } else {
        UserCollection.findById(req.user.id, (err, user: User) => {
          if (err) { return done(err); }
          user.facebook = profile.id;
          user.tokens.push({ provider: "facebook", token: accessToken });
          user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err: Error) => {
            req.flash("info", { msg: "Facebook account has been linked." });
            done(err, user);
          });
        });
      }
    });
  } else {
    UserCollection.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(undefined, existingUser);
      }
      UserCollection.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
          done(err);
        } else {
          const user: User = new UserCollection();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ provider: "facebook", token: accessToken });
          user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = profile._json.gender;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.profile.location = (profile._json.location) ? profile._json.location.name : "";
          user.save((err: Error) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split("/").slice(-1)[0];

  if (_.find(req.user.tokens, { provider: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

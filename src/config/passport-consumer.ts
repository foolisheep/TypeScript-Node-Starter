import passport from "passport";
import passportFacebook from "passport-facebook";
import OAuth2Strategy, { VerifyCallback } from "passport-oauth2";
import User from "../models/User/User";
import _ from "lodash";

import UserCollection from "../models/User/UserCollection";
import { Request, Response, NextFunction } from "express";

const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user: User, done: (err: any, id?: any) => void) => {
  done(undefined, user.id);
});

passport.deserializeUser((id: any, done: (err: Error, user: User) => void) => {
  UserCollection.findById(id, (err: Error, user: User) => {
      done(err, user);
  });
});

passport.use("oauth2", new OAuth2Strategy({
    authorizationURL: "https://localhost:" + process.env.PORT + "/oauth2/authorize",
    tokenURL: "https://localhost:" + process.env.PORT + "/oauth2/token",
    clientID: "aebb974a-3b14-4d58-8a74-72b7436deb71",
    clientSecret: "TypeScript-is-great",
    callbackURL: "http://localhost:" + process.env.PORT + "/auth/callback"
  },
  function(accessToken: string, refreshToken: string, profile: any, verified: VerifyCallback) {
    console.log(`accessToken: ${accessToken};\nprofile: ${profile}`);
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

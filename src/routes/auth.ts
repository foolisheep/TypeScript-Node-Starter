// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **resource server**
import express, { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import User from "../models/User/User";

const auth: Router = express.Router();
auth.route("/oauth2").get(passport.authenticate("oauth2"));
auth.route("/oauth2/callback").get(
    (req: Request, res: Response, next: NextFunction): any => {
        passport.authenticate("oauth2", (error: Error, user: User | boolean, info: any) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.redirect("/login");
            }
            req.logIn(user, (err: Error) => {
                if (err) {
                    return next(err);
                }
                return res.json({ user: user, accessToken: info.accessToken });
            });
        })(req, res, next);
    }
);

export default auth;
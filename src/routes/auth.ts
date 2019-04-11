import express, { Router } from "express";
import passport from "passport";

const auth: Router = express.Router();
auth.route("/oauth2").get(passport.authenticate("oauth2"));
auth.route("/oauth2/callback").get(
    passport.authenticate("oauth2", { successRedirect: "/", failureRedirect: "/login" }));

export default auth;
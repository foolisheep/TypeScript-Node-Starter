import express, { Router } from "express";
import * as controllers from "../controllers/user";

const signup: Router = express.Router();
signup.route("/")
    .get(controllers.getSignup)
    .post(controllers.postSignup);

export default signup;
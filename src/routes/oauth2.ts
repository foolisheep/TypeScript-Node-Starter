import express, { Router } from "express";
import * as controllers from "../controllers/oauth2";

const oauth2: Router = express.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);
oauth2.route("/signup").post(controllers.signUp);
oauth2.route("/signin").post(controllers.signIn);

export default oauth2;
import express, { Router } from "express";
import * as controllers from "../controllers/oauth2";

const oauth2: Router = express.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);

export default oauth2;
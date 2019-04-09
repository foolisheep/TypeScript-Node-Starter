import express, { Router } from "express";
import * as controllers from "../controllers/user";

const login: Router = express.Router();
login.route("/")
    // .get(controllers.getLogin)
    .post(controllers.postLogin);

export default login;
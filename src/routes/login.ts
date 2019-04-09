import express, { Router } from "express";
import * as controllers from "../controllers/user";

const login: Router = express.Router();
login.route("/").post(controllers.postLogin);

export default login;
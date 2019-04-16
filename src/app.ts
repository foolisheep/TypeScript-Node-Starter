import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import { Response, Request, NextFunction } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./client/app";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";

// API keys and Passport configuration
import "./config/passport-consumer";
import { layout } from "./layout";
import oauth2 from "./routes/oauth2";
import auth from "./routes/auth";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, { useMongoClient: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log(`[${req.method} ${req.originalUrl}] is called, session is ${JSON.stringify(req.session)}`);
  next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
});
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  const context: any = {};

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end();
  } else if (req.originalUrl.startsWith("/oauth2")
          || req.originalUrl.startsWith("/auth")
          || req.originalUrl.startsWith("/api")) {
    next();
  } else {
    // TODO: why the JSX syntax cannot be compiled here?
    const JSX = React.createElement;
    const html: string = renderToString(
      JSX(
        StaticRouter,
        {location: req.url, context: context},
        JSX(App, undefined)
      )
    );
    res.write(layout(html));
    res.end();
  }
});

/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.use("/auth", auth); // Auth client routes
app.use("/oauth2", oauth2); // OAuth2 server routes
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", /** bearer */userController.getAccount);
app.post("/account/profile", /** bearer */userController.postUpdateProfile);
app.post("/account/password", /** bearer */userController.postUpdatePassword);
app.post("/account/delete", /** bearer */userController.postDeleteAccount);
app.get("/account/unlink/:provider", /** bearer */userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);

export default app;
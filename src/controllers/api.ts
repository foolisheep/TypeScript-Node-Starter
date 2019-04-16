"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";

/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  });
};

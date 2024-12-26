import express from "express";
import morganLogger from "morgan";
import helmetSecurity from "helmet";
import corsMiddleware from "cors";
import cookieParserMiddleware from "cookie-parser";
import path from "node:path";
import serverless from "serverless-http";

import { handleError, handleNotFound } from "./middlewares/middlewares";
import responseHandlers from "./middlewares/response";

import dotenv from "dotenv";
dotenv.config();

const expressApp = express();
expressApp.use(morganLogger("dev"));
expressApp.use(responseHandlers);
expressApp.use(helmetSecurity());
expressApp.use(corsMiddleware());
expressApp.use(express.json());
expressApp.use(cookieParserMiddleware());

// Define root route
expressApp.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Importing API routes
import routes from "./routes";
expressApp.use("/api", routes);

// Use custom middlewares for handling 404 and errors
expressApp.use(handleNotFound);
expressApp.use(handleError);

export const handler = serverless(expressApp);
export default expressApp;

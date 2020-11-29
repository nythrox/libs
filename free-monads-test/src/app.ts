import { defaultRuntime } from "@qio/core";
import { QIO } from "@qio/core/lib/main/QIO";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import { Do } from "purifree-ts";


// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));


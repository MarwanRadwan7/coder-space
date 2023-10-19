import express, { RequestHandler } from "express";
import { listPostHandler, createPostHandler } from "./handlers/postHandlers";
const app = express();

app.use(express.json());

const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  console.log(`${req.method} - ${req.path} - body ${JSON.stringify(req.body)}`);
  next();
};
app.use(requestLoggerMiddleware);

app.get("/posts", listPostHandler);

app.post("/posts", createPostHandler);

app.listen(3000, () => console.log("App is running on port 3000 🚀"));

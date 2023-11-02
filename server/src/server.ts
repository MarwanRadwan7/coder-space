require('dotenv').config();

import * as https from 'https';
import * as fs from 'fs';
import express, { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import * as path from 'path';

import { CommentHandler, LikeHandler, PostHandler, UserHandler } from './handlers';
import { initDb, db } from './datastore';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { errHandler } from './middlewares/errorMiddleware';
import { Endpoints, ENDPOINT_CONFIGS } from '../../shared';
import { enforceJwtMiddleware, jwtParseMiddleware } from './middlewares/authMiddleware';

(async () => {
  const dbPath = process.env.DB_PATH;
  if (!dbPath) {
    console.error('DB_PATH env var missing');
    process.exit(1);
  }
  await initDb(dbPath!);

  const app = express();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
  }

  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);

  const userHandler = new UserHandler(db);
  const postHandler = new PostHandler(db);
  const likeHandler = new LikeHandler(db);
  const commentHandler = new CommentHandler(db);

  //To serve the client
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
  }

  // map of endpoints handlers
  const HANDLERS: { [key in Endpoints]: RequestHandler<any, any> } = {
    [Endpoints.healthz]: (_, res) => res.send({ status: 'ok!' }),

    [Endpoints.signin]: userHandler.signIn,
    [Endpoints.signup]: userHandler.signUp,
    [Endpoints.getUser]: userHandler.get,
    [Endpoints.getCurrentUser]: userHandler.getCurrent,
    [Endpoints.updateCurrentUser]: userHandler.updateCurrentUser,

    [Endpoints.listPosts]: postHandler.list,
    [Endpoints.getPost]: postHandler.get,
    [Endpoints.createPost]: postHandler.create,
    [Endpoints.deletePost]: postHandler.delete,

    [Endpoints.listLikes]: likeHandler.list,
    [Endpoints.createLike]: likeHandler.create,
    [Endpoints.deleteLike]: likeHandler.delete,

    [Endpoints.countComments]: commentHandler.count,
    [Endpoints.listComments]: commentHandler.list,
    [Endpoints.createComment]: commentHandler.create,
    [Endpoints.deleteComment]: commentHandler.delete,
  };

  // register handlers in express
  Object.keys(Endpoints).forEach(entry => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = HANDLERS[entry as Endpoints];

    config.auth
      ? app[config.method](
          config.url,
          jwtParseMiddleware,
          enforceJwtMiddleware,
          asyncHandler(handler)
        )
      : app[config.method](config.url, jwtParseMiddleware, asyncHandler(handler));
  });

  app.use(errHandler);

  app.use(errHandler);

  const PORT = process.env.PORT || 3000;
  const ENV = process.env.NODE_ENV;

  if (ENV === 'production') {
    const key = fs.readFileSync('/home/marwan/certs/privkey.pem', 'utf-8');
    const cert = fs.readFileSync('/home/marwan/certs/cert.pem', 'utf-8');

    https
      .createServer({ key, cert }, app)
      .listen(PORT, () => console.log(`App is running on port ${PORT}  in  env ${ENV} 🚀.`));
  } else {
    app.listen(PORT, () => console.log(`App is running on port ${PORT} 🚀 .`));
  }
})();

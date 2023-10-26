require('dotenv').config();
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { listPostHandler, createPostHandler } from './handlers/postHandlers';
import { signUpHandler, signInHAndler } from './handlers/authHandlers';
import { initDB } from './datastore';
import { requestLoggerMiddleware } from './middlewares/loggerMiddleware';
import { errHandler } from './middlewares/errorMiddleware';
import { authMiddleware } from './middlewares/authMiddleware';

(async () => {
  await initDB();

  const app = express();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  app.get('/healthz', (req: Request, res: Response) => res.status(200).send({ status: 'Alive' }));

  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/login', asyncHandler(signInHAndler));

  app.use(authMiddleware);

  app.get('/v1/posts', asyncHandler(listPostHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errHandler);

  app.listen(process.env.PORT, () => console.log('App is running on port 3000 🚀'));
})();

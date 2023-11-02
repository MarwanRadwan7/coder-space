import * as crypto from 'crypto';

import { ERRORS, Like, ListLikesResponse } from '../../../shared';
import { DataStore } from '../datastore';
import { ExpressHandlerWithParams } from '../types';

export class LikeHandler {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public create: ExpressHandlerWithParams<{ postId: string }, null, {}> = async (req, res) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    if (!(await this.db.getPostById(req.params.postId, res.locals.userId))) {
      return res.status(404).send({ error: ERRORS.POST_NOT_FOUND });
    }

    let found = await this.db.exists({
      postId: req.params.postId,
      userId: res.locals.userId,
    });
    if (found) {
      return res.status(400).send({ error: ERRORS.DUPLICATE_LIKE });
    }
    const likeForInsert: Like = {
      id: crypto.randomUUID(),
      postId: req.params.postId,
      userId: res.locals.userId,
    };
    this.db.createLike(likeForInsert);
    return res.sendStatus(200);
  };

  public delete: ExpressHandlerWithParams<{ postId: string }, null, {}> = async (req, res) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    if (!(await this.db.getPostById(req.params.postId, res.locals.userId))) {
      return res.status(404).send({ error: ERRORS.POST_NOT_FOUND });
    }

    const likeForDelete: Like = {
      postId: req.params.postId,
      userId: res.locals.userId,
    };

    this.db.deleteLike(likeForDelete);
    return res.sendStatus(200);
  };

  public list: ExpressHandlerWithParams<{ postId: string }, null, ListLikesResponse> = async (
    req,
    res
  ) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    const count: number = await this.db.getLikes(req.params.postId);
    return res.send({ likes: count });
  };
}

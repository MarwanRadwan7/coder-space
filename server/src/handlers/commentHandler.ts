import {
  Comment,
  CountCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  ERRORS,
  ListCommentsResponse,
} from '../../../shared';
import crypto from 'crypto';

import { DataStore } from '../datastore';
import { ExpressHandlerWithParams } from '../types';

export class CommentHandler {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public create: ExpressHandlerWithParams<
    { postId: string },
    CreateCommentRequest,
    CreateCommentResponse
  > = async (req, res) => {
    if (!req.params.postId) return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    if (!req.body.comment) return res.status(400).send({ error: ERRORS.COMMENT_MISSING });

    if (!(await this.db.getPostById(req.params.postId, res.locals.userId))) {
      return res.status(404).send({ error: ERRORS.POST_NOT_FOUND });
    }

    const commentForInsertion: Comment = {
      id: crypto.randomUUID(),
      postId: req.params.postId,
      postedAt: Date.now(),
      createdAt: Date.now(),
      userId: res.locals.userId,
      comment: req.body.comment,
    };
    await this.db.createComment(commentForInsertion);
    return res.sendStatus(200);
  };

  public delete: ExpressHandlerWithParams<{ id: string }, null, DeleteCommentResponse> = async (
    req,
    res
  ) => {
    if (!req.params.id) return res.status(404).send({ error: ERRORS.COMMENT_ID_MISSING });
    await this.db.deleteComment(req.params.id);
    return res.sendStatus(200);
  };

  public list: ExpressHandlerWithParams<{ postId: string }, null, ListCommentsResponse> = async (
    req,
    res
  ) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    const comments = await this.db.listComments(req.params.postId);
    return res.send({ comments });
  };

  public count: ExpressHandlerWithParams<{ postId: string }, null, CountCommentsResponse> = async (
    req,
    res
  ) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    const count = await this.db.countComments(req.params.postId);
    return res.send({ count });
  };
}

import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  ERRORS,
  GetPostResponse,
  ListPostsRequest,
  ListPostsResponse,
  Post,
} from '../../../shared';
import crypto from 'crypto';

import { DataStore } from '../datastore';
import { ExpressHandler, ExpressHandlerWithParams } from '../types';

export class PostHandler {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public list: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (_, res) => {
    return res.send({ posts: await this.db.listPosts() });
  };

  public create: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (req, res) => {
    if (!req.body.title || !req.body.url) {
      return res.sendStatus(400);
    }

    const existing = await this.db.getPostByUrl(req.body.url);
    if (existing) {
      // A post with this url already exists
      return res.status(400).send({ error: ERRORS.DUPLICATE_URL });
    }

    const post: Post = {
      id: crypto.randomUUID(),
      postedAt: Date.now(),
      title: req.body.title,
      url: req.body.url,
      userId: res.locals.userId,
      liked: false,
    };
    await this.db.createPost(post);
    return res.sendStatus(200);
  };

  public delete: ExpressHandler<DeletePostRequest, DeletePostResponse> = async (req, res) => {
    if (!req.body.postId) return res.sendStatus(400);
    this.db.deletePost(req.body.postId);
    return res.sendStatus(200);
  };

  public get: ExpressHandlerWithParams<{ id: string }, null, GetPostResponse> = async (
    req,
    res
  ) => {
    if (!req.params.id) return res.sendStatus(400);
    const postToReturn: Post | undefined = await this.db.getPostById(
      req.params.id,
      res.locals.userId
    );
    if (!postToReturn) {
      return res.sendStatus(404);
    }
    return res.send({ post: postToReturn });
  };
}

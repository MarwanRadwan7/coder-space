import crypto from 'crypto';

import { db } from '../datastore';
import { createPostRequest, createPostResponse, ListPostRequest, ListPostResponse } from '../api';
import { Post, ExpressHandler } from '../types';

export const listPostHandler: ExpressHandler<ListPostRequest, ListPostResponse> = async (
  req,
  res,
  next
) => {
  const posts = await db.listPosts();
  res.status(200).send({ posts });
};

export const createPostHandler: ExpressHandler<createPostRequest, createPostResponse> = async (
  req,
  res
) => {
  if (
    !req.body ||
    typeof req.body.title !== 'string' ||
    typeof req.body.userId !== 'string' ||
    typeof req.body.url !== 'string'
  ) {
    return res.sendStatus(400);
  }
  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now().toString(),
    title: req.body.title,
    userId: req.body.userId,
    url: req.body.url,
  };

  await db.createPost(post);
  res.status(201).send({ post });
};

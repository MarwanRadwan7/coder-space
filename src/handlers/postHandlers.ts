import { RequestHandler } from "express";
import crypto from "crypto";

import { db } from "../datastore";
import { Post, ExpressHandler } from "../types";

type createPostRequest = Pick<Post, "title" | "url" | "userId">;
type createPostResponse = {};

export const listPostHandler: RequestHandler = (req, res, next) => {
  const posts = db.listPosts();
  res.status(200).send({ posts });
};

export const createPostHandler: ExpressHandler<
  createPostRequest,
  createPostResponse
> = (req, res) => {
  if (
    !req.body ||
    typeof req.body.title !== "string" ||
    typeof req.body.userId !== "string" ||
    typeof req.body.url !== "string"
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

  db.createPost(post);
  res.status(201).send({ post });
};

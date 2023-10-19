import { RequestHandler } from "express";

export interface User {
  id: string;
  firstName: string;
  lastNAme: string;
  password: string;
  email: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  url: string;
  userId: string;
  postedAt: string;
}
export interface Like {
  id: string;
  userId: string;
  postId: string;
}
export interface Comment {
  id: string;
  comment: string;
  userId: string;
  postId: string;
  postedAt: string;
}
export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<Res>,
  Partial<Req>,
  any
>;

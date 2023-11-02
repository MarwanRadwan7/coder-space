import { RequestHandler } from 'express';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  url: string;
  userId: string;
  postedAt: number;
  liked: boolean;
}
export interface Like {
  id?: string;
  userId: string;
  postId: string;
}
export interface Comment {
  id: string;
  comment: string;
  userId: string;
  postId: string;
  postedAt: number;
  createdAt: number;
  liked?: boolean;
}

type WithError<T> = T & { error: string }; // The type you provide + add error field of type string

export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

export interface JwtObject {
  userId: string;
}

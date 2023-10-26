import { Post, User } from './types';

// Post  APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}
export type createPostRequest = Pick<Post, 'title' | 'url'>;
export type createPostResponse = {
  post: Post;
};

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

//TODO: User  APIs
export type signUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SignUpResponse {
  jwt: string;
}
export type signInRequest = {
  login: string; // username || email
  password: string;
};
export type signInResponse = {
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'username'>;
  jwt: string;
};

//TODO: Comment  APIs
//TODO: Like  APIs

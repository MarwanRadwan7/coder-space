import { Post } from './types';

// Post  APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}
export type createPostRequest = Pick<Post, 'title' | 'url' | 'userId'>;
export type createPostResponse = {};

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

//TODO: User  APIs
//TODO: Comment  APIs
//TODO: Like  APIs

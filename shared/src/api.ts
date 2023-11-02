import { Post, User, Comment } from './types';

// Post  APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}
export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};
export interface CreatePostResponse {
  post: Post;
}
export type GetPostRequest = { postId: string };
export interface GetPostResponse {
  post: Post;
}

// User  APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
  jwt: string;
};

export type GetUserRequest = {};
export type GetUserResponse = Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;

export type GetCurrentUserRequest = {};
export type GetCurrentUserResponse = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'username' | 'email'
>;

export type UpdateCurrentUserRequest = Partial<Omit<User, 'id' | 'email'>>;
export type UpdateCurrentUserResponse = {};

export type GetUserByEmailRequest = { emailId: string };
export interface GetUserByEmailResponse {
  user: User;
}
export type GetUserByusernameRequest = {
  username: string;
};
export interface GetUserByusernameResponse {
  user: User;
}

// Comment  APIs
export type CreateCommentRequest = Pick<Comment, 'comment'>;
export interface CreateCommentResponse {}
export type CountCommentsRequest = { postId: string };
export type CountCommentsResponse = { count: number };

export interface ListCommentsResponse {
  comments: Comment[];
}

export type DeleteCommentResponse = {};

// Like  APIs
export interface ListLikesResponse {
  likes: number;
}

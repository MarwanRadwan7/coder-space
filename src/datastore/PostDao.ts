import { Post } from "../types";

export interface PostDao {
  listPosts(): Post[] | undefined;
  getPostById(id: string): Post | undefined;
  createPost(post: Post): void;
  deletePost(id: string): void;
}

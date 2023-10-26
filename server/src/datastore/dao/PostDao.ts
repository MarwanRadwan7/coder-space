import { Post } from '../../types';

export interface PostDao {
  listPosts(): Promise<Post[] | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;
}

import { Post } from '../../../../shared/src/types';

export interface PostDao {
  listPosts(): Promise<Post[] | undefined>;
  listPostsByUserId(userId?: string): Promise<Post[]>;
  getPostById(id: string, userId: string): Promise<Post | undefined>;
  getPostByUrl(url: string): Promise<Post | undefined>;
  createPost(post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;
}

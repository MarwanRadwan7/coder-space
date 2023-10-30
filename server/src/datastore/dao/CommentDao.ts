import { Comment } from '../../../../shared/src/types';

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  countComments(postId: string): Promise<number>;
  deleteComment(id: string): Promise<void>;
  listComments(postId: string): Promise<Comment[] | undefined>;
}

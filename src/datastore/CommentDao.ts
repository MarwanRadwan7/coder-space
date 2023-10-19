import { Comment } from "../types";

export interface CommentDao {
  createComment(comment: Comment): void;
  deleteComment(id: string): void;
  listComments(postId: string): Comment[] | undefined;
}

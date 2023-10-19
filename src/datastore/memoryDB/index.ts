import { DataStore } from "..";
import { User, Post, Comment, Like } from "../../types";

export class InMemoryDataStore implements DataStore {
  private users: User[] = [];
  private likes: Like[] = [];
  private comments: Comment[] = [];
  private posts: Post[] = [];

  signUp(user: User): void | undefined {
    this.users.push(user);
  }
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
  getUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }
  listPosts(): Post[] | undefined {
    return this.posts;
  }
  getPostById(id: string): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }
  createPost(post: Post): void {
    this.posts.push(post);
  }
  deletePost(id: string): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return;
    }
    this.posts.splice(index, 1);
  }
  createComment(comment: Comment): void {
    this.comments.push(comment);
  }
  deleteComment(id: string): void {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index === -1) {
      return;
    }
    this.comments.splice(index, 1);
  }
  listComments(postId: string): Comment[] | undefined {
    return this.comments;
  }
  createLike(like: Like): void {
    this.likes.push(like);
  }
}

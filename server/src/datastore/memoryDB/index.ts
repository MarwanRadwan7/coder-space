import { DataStore } from '..';
import { User, Post, Comment, Like } from '../../types';

export class InMemoryDataStore implements DataStore {
  private users: User[] = [];
  private likes: Like[] = [];
  private comments: Comment[] = [];
  private posts: Post[] = [];

  getUserById(id: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }
  signUp(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }
  getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(u => u.email === email));
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(u => u.username === username));
  }
  listPosts(): Promise<Post[] | undefined> {
    return Promise.resolve(this.posts);
  }
  getPostById(id: string): Promise<Post | undefined> {
    return Promise.resolve(this.posts.find(p => p.id === id));
  }
  createPost(post: Post): Promise<void> {
    this.posts.push(post);
    return Promise.resolve();
  }
  deletePost(id: string): Promise<void> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.resolve();
    }
    this.posts.splice(index, 1);
    return Promise.resolve();
  }
  createComment(comment: Comment): Promise<void> {
    this.comments.push(comment);
    return Promise.resolve();
  }
  deleteComment(id: string): Promise<void> {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.resolve();
    }
    this.comments.splice(index, 1);
    return Promise.resolve();
  }
  listComments(postId: string): Promise<Comment[] | undefined> {
    return Promise.resolve(this.comments);
  }
  createLike(like: Like): Promise<void> {
    this.likes.push(like);
    return Promise.resolve();
  }
}

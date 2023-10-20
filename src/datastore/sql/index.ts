import sqlite3 from 'sqlite3';
import { open as sqliteOpen } from 'sqlite';
import path from 'path';
import { DataStore } from '..';
import { User, Post, Comment, Like } from '../../types';

export class SqlDatastore implements DataStore {
  public async openDb() {
    const db = await sqliteOpen({
      filename: path.join(__dirname, 'coderspace.sqlite'),
      driver: sqlite3.Database,
    });
    await db.migrate({ migrationsPath: path.join(__dirname, 'migrations') });
    return this;
  }

  signUp(user: User): Promise<void | undefined> {
    throw new Error('Method not implemented.');
  }
  getUserByEmail(email: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }
  listPosts(): Promise<Post[] | undefined> {
    throw new Error('Method not implemented.');
  }
  getPostById(id: string): Promise<Post | undefined> {
    throw new Error('Method not implemented.');
  }
  createPost(post: Post): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deletePost(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createComment(comment: Comment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteComment(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  listComments(postId: string): Promise<Comment[] | undefined> {
    throw new Error('Method not implemented.');
  }
  createLike(like: Like): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

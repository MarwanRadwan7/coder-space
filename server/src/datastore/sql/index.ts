import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { open as sqliteOpen, Database } from 'sqlite';

import { DataStore } from '..';
import { User, Post, Comment, Like } from '../../types';

export class SqlDatastore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb() {
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'coderspace.sqlite'),
      driver: sqlite3.Database,
    });
    await this.db.run('PRAGMA foreign_keys = ON;');
    await this.db.migrate({ migrationsPath: path.join(__dirname, 'migrations') });
    console.log('Database Connected! 👋🏼');
    return this;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User>('SELECT * FROM users WHERE users.id = ?', id);
  }

  async signUp(user: User): Promise<void | undefined> {
    await this.db.run(
      `INSERT INTO users (id , email ,username, firstName , lastName , password) VALUES (?, ? , ? , ? , ? , ?)`,
      user.id,
      user.email,
      user.username,
      user.firstName,
      user.lastName,
      user.password
    );
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User>('SELECT * FROM users WHERE email = ? ', email);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.db.get<User>('SELECT * FROM users WHERE username = ? ', username);
  }
  async listPosts(): Promise<Post[] | undefined> {
    return await this.db.all<Post[]>('SELECT * FROM posts');
  }
  getPostById(id: string): Promise<Post | undefined> {
    throw new Error('Method not implemented.');
  }
  async createPost(post: Post): Promise<void> {
    await this.db.run(
      `INSERT INTO posts (id, title, url, postedAt, userId) VALUES (?, ? , ? , ? , ?)`,
      post.id,
      post.title,
      post.url,
      post.postedAt,
      post.userId
    );
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

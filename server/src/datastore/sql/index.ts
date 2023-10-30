import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { open as sqliteOpen, Database } from 'sqlite';

import { DataStore } from '..';
import { User, Post, Comment, Like } from '../../../../shared/src/types';

export class SqlDatastore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb(dbPath: string) {
    // const { NODE_ENV } = process.env;

    const SqlPath = path.join(__dirname, dbPath);
    // open the database
    try {
      // LOGGER.info('Opening database file at:', dbPath);
      this.db = await sqliteOpen({
        filename: SqlPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE,
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    // TODO:

    // if (ENV === 'development') {
    //   LOGGER.info('Seeding data...');

    //   SEED_USERS.forEach(async u => {
    //     if (!(await this.getUserById(u.id))) await this.createUser(u);
    //   });
    //   SEED_POSTS.forEach(async p => {
    //     if (!(await this.getPostByUrl(p.url))) await this.createPost(p);
    //   });
    // }
    console.log('Database Connected! 👋🏼');
    return this;
  }

  /** USERS SERVICE */

  async createUser(user: User): Promise<void> {
    await this.db.run(
      'INSERT INTO users (id, email, password, firstName, lastName, username) VALUES (?,?,?,?,?,?)',
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username
    );
  }

  async updateCurrentUser(user: User): Promise<void> {
    await this.db.run(
      'UPDATE users SET username = ?, firstName = ?, lastName = ? WHERE id = ?',
      user.username,
      user.firstName,
      user.lastName,
      user.id
    );
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
  async getUserByusername(username: string): Promise<User | undefined> {
    return await this.db.get<User>('SELECT * FROM users WHERE username = ? ', username);
  }
  /** POSTS SERVICE */
  async listPosts(): Promise<Post[] | undefined> {
    return await this.db.all<Post[]>('SELECT * FROM posts ORDER BY postedAt DESC');
  }

  listPostsByUserId(userId?: string): Promise<Post[]> {
    return this.db.all<Post[]>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = posts.id AND likes.userId = ?
      ) as liked FROM posts ORDER BY postedAt DESC`,
      userId
    );
  }

  async getPostById(id: string, userId: string): Promise<Post | undefined> {
    return await this.db.get<Post>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = ? AND likes.userId = ? 
        ) as liked FROM posts WHERE id = ?`,
      id,
      userId,
      id
    );
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

  async getPostByUrl(url: string): Promise<Post | undefined> {
    return await this.db.get<Post>(`SELECT * FROM posts WHERE url = ?`, url);
  }

  async deletePost(id: string): Promise<void> {
    await this.db.run(`DELETE FROM posts WHERE id = ? `, id);
  }

  /** COMMENTS SERVICE */

  async createComment(comment: Comment): Promise<void> {
    try {
      await this.db.run(
        'INSERT INTO comments(id, userId, postId, comment, postedAt,createdAt) VALUES(?,?,?,?,?,?)',
        comment.id,
        comment.userId,
        comment.postId,
        comment.comment,
        comment.postedAt,
        comment.createdAt
      );
    } catch (err) {
      console.error(err);
    }
  }

  async deleteComment(id: string): Promise<void> {
    await this.db.run(`DELETE FROM comments WHERE id = ? `, id);
  }

  async listComments(postId: string): Promise<Comment[] | undefined> {
    return await this.db.all<Comment[]>(
      'SELECT * FROM comments WHERE postId = ? ORDER BY postedAt DESC',
      postId
    );
  }

  async countComments(postId: string): Promise<number> {
    const result = await this.db.get<{ count: number }>(
      `
      SELECT COUNT(*) as count FROM comments WHERE postId = ? ORDER BY postedAt DESC
    `,
      postId
    );
    return result?.count ?? 0;
  }

  /** LIKES SERVICE */

  async createLike(like: Like): Promise<void> {
    console.log(like);
    try {
      await this.db.run(
        'INSERT INTO likes(id,userId, postId) VALUES(?,?,?)',
        like.id,
        like.userId,
        like.postId
      );
    } catch (e) {
      console.error(e);
    }
  }

  async deleteLike(like: Like): Promise<void> {
    await this.db.run(
      `
      DELETE FROM likes WHERE userId = ? AND postId = ?
      `,
      like.userId,
      like.postId
    );
  }

  async getLikes(postId: string): Promise<number> {
    const result = await this.db.get<{ count: number }>(
      `
      SELECT COUNT(*) AS countFROM likes WHERE postId = ?
    `,
      postId
    );
    return result?.count ?? 0;
  }

  async exists(like: Like): Promise<boolean> {
    // query to check if any rows exists in the table
    let result = await this.db.get<number>(
      `
      SELECT 1 FROM likes WHERE postId = ? AND userId = ? 
    `,
      like.postId,
      like.userId
    );
    let val: boolean = result === undefined ? false : true;
    return val;
  }
}

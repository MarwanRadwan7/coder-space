import { CommentDao } from './dao/CommentDao';
import { LikeDao } from './dao/LikeDao';
import { PostDao } from './dao/PostDao';
import { UserDao } from './dao/UserDao';
import { SqlDatastore } from './sql';

export interface DataStore extends UserDao, PostDao, CommentDao, LikeDao {}

export let db: DataStore;

export async function initDb(dbPath: string) {
  db = await new SqlDatastore().openDb(dbPath);
}

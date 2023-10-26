import { CommentDao } from './dao/CommentDao';
import { LikeDao } from './dao/LikeDao';
import { InMemoryDataStore } from './memoryDB';
import { PostDao } from './dao/PostDao';
import { UserDao } from './dao/UserDao';
import { SqlDatastore } from './sql';

export interface DataStore extends UserDao, PostDao, CommentDao, LikeDao {}

export let db: DataStore;
export async function initDB() {
  // db = new InMemoryDataStore();
  db = await new SqlDatastore().openDb();
}

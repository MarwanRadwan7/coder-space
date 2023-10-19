import { CommentDao } from "./commentDao";
import { LikeDao } from "./likeDao";
import { InMemoryDataStore } from "./memoryDB";
import { PostDao } from "./postDao";
import { UserDao } from "./userDao";

export interface DataStore extends UserDao, PostDao, CommentDao, LikeDao {}
export const db = new InMemoryDataStore();

import { User } from "../types";

export interface UserDao {
  signUp(user: User): void | undefined;
  getUserByEmail(email: string): User | undefined;
  getUserByUsername(username: string): User | undefined;
}

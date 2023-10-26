import { User } from '../../types';

export interface UserDao {
  signUp(user: User): Promise<void | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
}

import { User } from '../../../../shared/src/types';

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateCurrentUser(user: Partial<User>): Promise<void>;
  signUp(user: User): Promise<void | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByusername(username: string): Promise<User | undefined>;
}

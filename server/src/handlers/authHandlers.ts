import * as crypto from 'crypto';

import {
  ERRORS,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateCurrentUserRequest,
  UpdateCurrentUserResponse,
  User,
} from '../../../shared';
import { DataStore } from '../datastore';
import { signJwt } from '../auth';
import { ExpressHandler, ExpressHandlerWithParams } from '../types';

export class UserHandler {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public signIn: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.sendStatus(400);
    }

    const existing =
      (await this.db.getUserByEmail(login)) || (await this.db.getUserByusername(login));
    if (!existing || existing.password !== this.hashPassword(password)) {
      return res.sendStatus(403);
    }

    const jwt = signJwt({ userId: existing.id });

    return res.status(200).send({
      user: {
        email: existing.email,
        firstName: existing.firstName,
        lastName: existing.lastName,
        id: existing.id,
        username: existing.username,
      },
      jwt,
    });
  };

  public signUp: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    if (!email || !username || !password) {
      return res.status(400).send({ error: ERRORS.USER_REQUIRED_FIELDS });
    }

    if (await this.db.getUserByEmail(email)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
    }
    if (await this.db.getUserByusername(username)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_username });
    }
    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      username: username,
      password: this.hashPassword(password),
    };
    await this.db.createUser(user);
    const jwt = signJwt({ userId: user.id });
    return res.status(200).send({
      jwt,
    });
  };

  public get: ExpressHandlerWithParams<{ id: string }, GetUserRequest, GetUserResponse> = async (
    req,
    res
  ) => {
    const { id } = req.params;
    if (!id) return res.sendStatus(400);

    const user = await this.db.getUserById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  };

  public getCurrent: ExpressHandler<GetCurrentUserRequest, GetCurrentUserResponse> = async (
    _,
    res
  ) => {
    const user = await this.db.getUserById(res.locals.userId);
    if (!user) {
      return res.sendStatus(500);
    }
    return res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  };

  public updateCurrentUser: ExpressHandler<UpdateCurrentUserRequest, UpdateCurrentUserResponse> =
    async (req, res) => {
      const currentUserId = res.locals.userId;
      const { username } = req.body;

      if (username && (await this.isDuplicateusername(currentUserId, username))) {
        return res.status(403).send({ error: ERRORS.DUPLICATE_username });
      }

      const currentUser = await this.db.getUserById(currentUserId);
      if (!currentUser) {
        return res.status(404).send({ error: ERRORS.USER_NOT_FOUND });
      }

      await this.db.updateCurrentUser({
        id: currentUserId,
        username: username ?? currentUser.username,
        firstName: req.body.firstName ?? currentUser.firstName,
        lastName: req.body.lastName ?? currentUser.lastName,
      });
      return res.sendStatus(200);
    };

  private async isDuplicateusername(currentUserId: string, newusername: string): Promise<boolean> {
    const userWithProvidedusername = await this.db.getUserByusername(newusername);
    // returns true if we have a user with this username and it's not the authenticated user
    return userWithProvidedusername != undefined && userWithProvidedusername.id !== currentUserId;
  }

  private hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.PASSWORD_SALT!, 42, 64, 'sha512')
      .toString('hex');
  }
}

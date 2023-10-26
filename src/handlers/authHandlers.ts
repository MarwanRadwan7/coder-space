import * as crypto from 'crypto';

import { SignUpResponse, signInRequest, signInResponse, signUpRequest } from '../api';
import { db } from '../datastore';
import { ExpressHandler, User } from '../types';
import { signJwt } from '../auth';

export const signUpHandler: ExpressHandler<signUpRequest, SignUpResponse> = async (req, res) => {
  const { email, firstName, lastName, username, password } = req.body;
  if (!email || !firstName || !lastName || !username || !password) {
    return res.status(400).send({ error: 'All fields are required!' });
  }
  const existing = (await db.getUserByEmail(email)) || (await db.getUserByEmail(username));
  if (existing) {
    return res.status(403).send({ error: 'User already exists' });
  }
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    firstName,
    lastName,
    password: crypto.pbkdf2Sync(password, 'mysecretsalt', 42, 64, 'sha512').toString('hex'),
  };

  await db.signUp(user);

  const jwt = signJwt({ userId: user.id });

  return res.status(201).send({
    jwt,
  });
};

export const signInHAndler: ExpressHandler<signInRequest, signInResponse> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.sendStatus(400);
  }

  const passwordHashed = crypto
    .pbkdf2Sync(password, 'mysecretsalt', 42, 64, 'sha512')
    .toString('hex');

  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || passwordHashed !== existing.password) {
    return res.sendStatus(403);
  }

  const jwt = signJwt({ userId: existing.id });

  return res.status(200).send({
    user: {
      id: existing.id,
      firstName: existing.firstName,
      lastName: existing.lastName,
      username: existing.username,
      email: existing.email,
    },
    jwt,
  });
};

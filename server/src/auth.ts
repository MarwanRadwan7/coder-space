import * as jwt from 'jsonwebtoken';
import { JwtObject } from './types';

const secret = process.env.JWT_SECRET as string;

export function signJwt(obj: JwtObject): string {
  return jwt.sign(obj, secret, {
    expiresIn: '2d',
  });
}

export function verifyJwt(token: string): JwtObject {
  const result = jwt.verify(token, secret);
  if (typeof result === 'object' && result !== null) {
    return result as JwtObject;
  } else {
    throw new Error('Invalid JWT or unexpected result');
  }
}

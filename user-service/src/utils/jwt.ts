import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const SECRET = process.env.JWT_SECRET || 'default_secret';

export function signToken(data: JwtPayload) {
    return jwt.sign(data, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload{
    return jwt.verify(token, SECRET) as JwtPayload;
}

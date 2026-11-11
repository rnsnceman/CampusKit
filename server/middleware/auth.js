import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from './errors.js';
export function authenticate(secret) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new HttpError(401, 'Please sign in to continue.');
    let payload;
    try { payload = jwt.verify(token, secret, { algorithms: ['HS256'] }); }
    catch { throw new HttpError(401, 'Your session expired. Please sign in again.'); }
    const user = await User.findById(payload.sub).select('+tokenVersion');
    if (!user || user.tokenVersion !== payload.version) throw new HttpError(401, 'Please sign in again.');
    req.user = user; next();
  };
}
export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') throw new HttpError(403, 'Administrator access is required.');
  next();
}
export function publicUser(user) { return { _id: user.id, name: user.name, email: user.email, role: user.role }; }

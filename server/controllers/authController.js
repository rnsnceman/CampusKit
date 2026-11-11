import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../middleware/errors.js';
import { publicUser } from '../middleware/auth.js';
import { text, email, password } from '../middleware/validate.js';
export function authController(secret) {
  const session = (user) => ({ user: publicUser(user), token: jwt.sign({ version: user.tokenVersion ?? 0 }, secret, { subject: user.id, expiresIn: '2h', algorithm: 'HS256' }) });
  return {
    register: async (req, res) => {
      const data = { name: text(req.body.name, 'Name', 80), email: email(req.body.email), password: await bcrypt.hash(password(req.body.password), 12) };
      // Client-supplied roles are never accepted during registration.
      const user = await User.create(data); res.status(201).json(session(user));
    },
    login: async (req, res) => {
      const address = email(req.body.email);
      const candidate = password(req.body.password);
      const user = await User.findOne({ email: address }).select('+password +tokenVersion');
      if (!user || !await bcrypt.compare(candidate, user.password)) throw new HttpError(401, 'Email or password is incorrect.');
      res.json(session(user));
    },
    me: async (req, res) => res.json({ user: publicUser(req.user) })
  };
}

import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import BorrowRequest from '../models/BorrowRequest.js';
import { text, email, password } from '../middleware/validate.js';
import { publicUser } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
export async function list(req,res) { res.json({ users: await User.find().select('name email role createdAt').sort({createdAt:-1}) }); }
export async function read(req,res) {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) throw new HttpError(403,'You can only access your own profile.');
  const user = await User.findById(req.params.id); if (!user) throw new HttpError(404,'User not found.');
  res.json({user:publicUser(user)});
}
export async function update(req,res) {
  if (req.params.id !== req.user.id) throw new HttpError(403,'You can only edit your own profile.');
  const data = {};
  if (req.body.name !== undefined) data.name = text(req.body.name,'Name',80);
  if (req.body.email !== undefined) data.email = email(req.body.email);
  if (req.body.password !== undefined) {
    const user = await User.findById(req.user.id).select('+password');
    if (typeof req.body.currentPassword !== 'string' || !await bcrypt.compare(req.body.currentPassword,user.password)) throw new HttpError(401,'Current password is incorrect.');
    data.password = await bcrypt.hash(password(req.body.password),12);
  }
  const changes = {$set:data}; if (data.password) changes.$inc = {tokenVersion:1};
  const user = await User.findByIdAndUpdate(req.user.id,changes,{new:true,runValidators:true});
  res.json({user:publicUser(user),signInAgain:!!data.password});
}
export async function remove(req,res) {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) throw new HttpError(403,'You can only delete your own account.');
  const target = await User.findById(req.params.id); if (!target) throw new HttpError(404,'User not found.');
  if (target.role === 'admin') throw new HttpError(409,'Administrator accounts must be retained.');
  if (await BorrowRequest.exists({user:target.id,status:{$in:['pending','approved']}})) throw new HttpError(409,'Resolve pending requests and return equipment before deleting this account.');
  await target.deleteOne(); res.status(204).end();
}

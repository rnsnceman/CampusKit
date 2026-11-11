import {before,after,beforeEach,test} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {createApp} from '../server/app.js';
import User from '../server/models/User.js';
import Equipment from '../server/models/Equipment.js';
import BorrowRequest from '../server/models/BorrowRequest.js';
process.env.NODE_ENV='test';
const app=createApp('test-only-random-secret-with-more-than-32-characters');
let db,admin,student,other;
const pass='TestingPassword123!';
const date=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
const assetData={name:'Test Camera',category:'Cameras',assetTag:'TEST-001',location:'Media lab',description:'Camera kit'};
const send=(method,path,token,data)=>{const r=request(app)[method]('/api'+path);if(token)r.set('Authorization','Bearer '+token);return data===undefined?r:r.send(data)};
async function login(email){return (await send('post','/auth/login',null,{email,password:pass}).expect(200)).body.token;}
async function asset(){return (await send('post','/equipment',admin,assetData).expect(201)).body.equipment;}
async function borrow(item,token=student){return (await send('post','/requests',token,{equipment:item._id,dueDate:date,purpose:'Film a student interview.'}).expect(201)).body.request;}
before(async()=>{
 db=await MongoMemoryServer.create({instance:{args:['--nounixsocket']}});await mongoose.connect(db.getUri());await Promise.all([User.init(),Equipment.init(),BorrowRequest.init()]);
 const password=await bcrypt.hash(pass,4);
 await User.create([{name:'Administrator',email:'admin@test.ca',role:'admin',password},{name:'Student A',email:'student@test.ca',password},{name:'Student B',email:'other@test.ca',password}]);
 admin=await login('admin@test.ca');student=await login('student@test.ca');other=await login('other@test.ca');
});
after(async()=>{await mongoose.disconnect();if(db)await db.stop()});
beforeEach(async()=>{await BorrowRequest.deleteMany({});await Equipment.deleteMany({});});
test('register creates student, hashes password, ignores role escalation',async()=>{
 const r=await send('post','/auth/register',null,{name:'New Student',email:'new@test.ca',password:pass,role:'admin'}).expect(201);
 assert.equal(r.body.user.role,'student');assert.ok(!r.body.user.password);
 const u=await User.findById(r.body.user._id).select('+password');assert.notEqual(u.password,pass);assert.ok(await bcrypt.compare(pass,u.password));
 await send('post','/auth/register',null,{name:'Copy',email:'new@test.ca',password:pass}).expect(409);
 await User.findByIdAndDelete(u.id);
});
test('authentication rejects invalid login, missing token and forged token',async()=>{
 await send('post','/auth/login',null,{email:'student@test.ca',password:'WrongPassword123!'}).expect(401);
 await send('get','/equipment').expect(401);await send('get','/equipment','forged-token').expect(401);
 await send('get','/auth/me',student).expect(200);
});
test('students cannot list users or mutate equipment',async()=>{
 const item=await asset();await send('get','/users',student).expect(403);
 await send('post','/equipment',student,assetData).expect(403);
 await send('patch','/equipment/'+item._id,student,{name:'Hacked'}).expect(403);
 await send('delete','/equipment/'+item._id,student).expect(403);
});
test('administrator equipment CRUD and uniqueness',async()=>{
 const item=await asset();await send('post','/equipment',admin,assetData).expect(409);
 await send('get','/equipment/'+item._id,student).expect(200);
 const r=await send('patch','/equipment/'+item._id,admin,{name:'Updated camera'}).expect(200);assert.equal(r.body.equipment.name,'Updated camera');
 await send('delete','/equipment/'+item._id,admin).expect(204);
 await send('get','/equipment/'+item._id,student).expect(404);
});
test('validation rejects malformed IDs, categories, dates, and operator injection',async()=>{
 await send('get','/equipment/invalid',student).expect(400);
 await send('post','/equipment',admin,{...assetData,category:'Invalid'}).expect(400);
 await send('post','/auth/login',null,{email:{$ne:null},password:pass}).expect(400);
 const item=await asset();
 for(const dueDate of ['2000-01-01','2099-01-01','2027-02-30','not-a-date']) await send('post','/requests',student,{equipment:item._id,dueDate,purpose:'Interview'}).expect(400);
});
test('student request CRUD with duplicate protection',async()=>{
 const item=await asset(),r=await borrow(item);
 await send('post','/requests',student,{equipment:item._id,dueDate:date,purpose:'Duplicate'}).expect(409);
 await send('get','/requests/'+r._id,student).expect(200);
 const updated=await send('patch','/requests/'+r._id,student,{action:'edit',purpose:'Updated purpose',dueDate:date}).expect(200);assert.equal(updated.body.request.purpose,'Updated purpose');
 await send('delete','/requests/'+r._id,student).expect(204);
});
test('ownership protects request reading, editing, deletion and list',async()=>{
 const item=await asset(),r=await borrow(item);
 const list=await send('get','/requests',other).expect(200);assert.equal(list.body.requests.length,0);
 await send('get','/requests/'+r._id,other).expect(403);
 await send('patch','/requests/'+r._id,other,{action:'cancel'}).expect(403);
 await send('delete','/requests/'+r._id,other).expect(403);
 await send('patch','/requests/'+r._id,student,{action:'approve'}).expect(403);
});
test('approve and return update asset availability and protect active loans',async()=>{
 const item=await asset(),r=await borrow(item);
 await send('patch','/requests/'+r._id,admin,{action:'approve',decisionNote:'Ready for pickup.'}).expect(200);
 let e=await Equipment.findById(item._id);assert.equal(e.status,'on-loan');assert.equal(e.activeRequest.toString(),r._id);
 await send('delete','/requests/'+r._id,student).expect(409);
 await send('patch','/requests/'+r._id,student,{action:'cancel'}).expect(409);
 await send('patch','/equipment/'+item._id,admin,{status:'available'}).expect(409);
 await send('delete','/equipment/'+item._id,admin).expect(409);
 await send('post','/requests',other,{equipment:item._id,dueDate:date,purpose:'Borrow unavailable'}).expect(409);
 await send('patch','/requests/'+r._id,admin,{action:'return'}).expect(200);
 e=await Equipment.findById(item._id);assert.equal(e.status,'available');assert.equal(e.activeRequest,null);
 await send('patch','/requests/'+r._id,admin,{action:'return'}).expect(409);
});
test('concurrent approvals grant only one loan for a physical item',async()=>{
 const item=await asset(),a=await borrow(item),b=await borrow(item,other);
 const results=await Promise.all([a,b].map(r=>send('patch','/requests/'+r._id,admin,{action:'approve'})));
 assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 assert.equal(await BorrowRequest.countDocuments({status:'approved'}),1);
});
test('cancelled request cannot be approved; rejection preserves availability',async()=>{
 const item=await asset(),a=await borrow(item);
 await send('patch','/requests/'+a._id,student,{action:'cancel'}).expect(200);
 await send('patch','/requests/'+a._id,admin,{action:'approve'}).expect(409);
 const b=await borrow(item);await send('patch','/requests/'+b._id,admin,{action:'reject'}).expect(200);
 assert.equal((await Equipment.findById(item._id)).status,'available');
});
test('maintenance items cannot be borrowed and pending requests block asset deletion',async()=>{
 const item=await asset();await send('patch','/equipment/'+item._id,admin,{status:'maintenance'}).expect(200);
 await send('post','/requests',student,{equipment:item._id,dueDate:date,purpose:'Test'}).expect(409);
 await send('patch','/equipment/'+item._id,admin,{status:'available'}).expect(200);await borrow(item);
 await send('delete','/equipment/'+item._id,admin).expect(409);
});
test('user CRUD, role protection, active-request deletion guard, and token revocation',async()=>{
 const r=await send('post','/auth/register',null,{name:'Temporary',email:'temp@test.ca',password:pass}).expect(201);const token=r.body.token,id=r.body.user._id;
 await send('get','/users/'+id,token).expect(200);await send('get','/users/'+id,other).expect(403);
 const profile=await send('patch','/users/'+id,token,{name:'Updated',role:'admin'}).expect(200);assert.equal(profile.body.user.role,'student');
 const item=await asset(),loan=await borrow(item,token);
 await send('delete','/users/'+id,token).expect(409);
 await send('delete','/requests/'+loan._id,token).expect(204);
 await send('patch','/users/'+id,token,{password:'NewPassword123!',currentPassword:'WrongPassword123!'}).expect(401);
 await send('patch','/users/'+id,token,{password:'NewPassword123!',currentPassword:pass}).expect(200);
 await send('get','/auth/me',token).expect(401);
 const signed=await send('post','/auth/login',null,{email:'temp@test.ca',password:'NewPassword123!'}).expect(200);
 await send('delete','/users/'+id,signed.body.token).expect(204);
 await send('get','/auth/me',signed.body.token).expect(401);
});

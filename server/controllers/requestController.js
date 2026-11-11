import Equipment from '../models/Equipment.js';
import BorrowRequest from '../models/BorrowRequest.js';
import { HttpError } from '../middleware/errors.js';
import { text, dueDate } from '../middleware/validate.js';
const populated = (query) => query.populate('user','name email').populate('equipment','name category assetTag status location');
export async function list(req,res) {
  res.json({requests:await populated(BorrowRequest.find(req.user.role==='admin'?{}:{user:req.user.id}).sort({createdAt:-1}))});
}
export async function read(req,res) {
  const request = await populated(BorrowRequest.findById(req.params.id));
  if (!request) throw new HttpError(404,'Request not found.');
  if (req.user.role!=='admin' && request.user?.id!==req.user.id) throw new HttpError(403,'You can only view your own requests.');
  res.json({request});
}
export async function create(req,res) {
  if (req.user.role!=='student') throw new HttpError(403,'Use a student account to borrow equipment.');
  const equipment = await Equipment.findById(req.body.equipment);
  if (!equipment) throw new HttpError(404,'Equipment not found.');
  if (equipment.status!=='available') throw new HttpError(409,'This asset is currently unavailable.');
  const request = await BorrowRequest.create({user:req.user.id,equipment:equipment.id,equipmentName:equipment.name,assetTag:equipment.assetTag,requesterName:req.user.name,dueDate:dueDate(req.body.dueDate),purpose:text(req.body.purpose,'Purpose',500)});
  res.status(201).json({request});
}
export async function update(req,res) {
  const request = await BorrowRequest.findById(req.params.id);
  if (!request) throw new HttpError(404,'Request not found.');
  const action = req.body.action;
  if (['approve','reject','return'].includes(action)) {
    if (req.user.role!=='admin') throw new HttpError(403,'Administrator access is required.');
    const note = text(req.body.decisionNote ?? '', 'Decision note',500,0);
    if (action==='approve') {
      if (request.status!=='pending') throw new HttpError(409,'Only pending requests can be approved.');
      // Claim one physical asset atomically; concurrent approvals cannot both succeed.
      const asset = await Equipment.findOneAndUpdate({_id:request.equipment,status:'available',activeRequest:null},{$set:{status:'on-loan',activeRequest:request.id}});
      if (!asset) throw new HttpError(409,'This asset is no longer available.');
      let updated;
      try { updated = await BorrowRequest.findOneAndUpdate({_id:request.id,status:'pending'},{$set:{status:'approved',decisionNote:note}},{new:true,runValidators:true}); }
      catch (error) { await Equipment.updateOne({_id:request.equipment,activeRequest:request.id},{$set:{status:'available',activeRequest:null}}); throw error; }
      if (!updated) {
        await Equipment.updateOne({_id:request.equipment,activeRequest:request.id},{$set:{status:'available',activeRequest:null}});
        throw new HttpError(409,'The request changed before approval. Refresh and try again.');
      }
      return res.json({request:updated});
    }
    const required = action==='return'?'approved':'pending';
    const updated = await BorrowRequest.findOneAndUpdate({_id:request.id,status:required},{$set:{status:action==='return'?'returned':'rejected',decisionNote:note}},{new:true});
    if (!updated) throw new HttpError(409,`Only ${required} requests support this action.`);
    if (action==='return') await Equipment.updateOne({_id:request.equipment,activeRequest:request.id},{$set:{status:'available',activeRequest:null}});
    return res.json({request:updated});
  }
  if (request.user.toString()!==req.user.id) throw new HttpError(403,'You can only edit your own requests.');
  const data = {};
  if (action==='cancel') data.status='cancelled';
  else if (action==='edit') { data.purpose=text(req.body.purpose,'Purpose',500); data.dueDate=dueDate(req.body.dueDate); }
  else throw new HttpError(400,'Choose edit, cancel, approve, reject, or return.');
  const updated = await BorrowRequest.findOneAndUpdate({_id:request.id,status:'pending'},{$set:data},{new:true,runValidators:true});
  if (!updated) throw new HttpError(409,'Only pending requests can be edited or cancelled.'); res.json({request:updated});
}
export async function remove(req,res) {
  const request = await BorrowRequest.findById(req.params.id);
  if (!request) throw new HttpError(404,'Request not found.');
  if (request.user.toString()!==req.user.id) throw new HttpError(403,'You can only delete your own requests.');
  const result = await BorrowRequest.findOneAndDelete({_id:request.id,status:{$ne:'approved'}});
  if (!result) throw new HttpError(409,'Return borrowed equipment before deleting the request.'); res.status(204).end();
}

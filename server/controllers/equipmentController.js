import Equipment from '../models/Equipment.js';
import BorrowRequest from '../models/BorrowRequest.js';
import { equipmentFields } from '../middleware/validate.js';
import { HttpError } from '../middleware/errors.js';
export async function list(req,res) { res.json({equipment:await Equipment.find().sort({name:1})}); }
export async function read(req,res) {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) throw new HttpError(404,'Equipment not found.'); res.json({equipment});
}
export async function create(req,res) { res.status(201).json({equipment:await Equipment.create(equipmentFields(req.body,true))}); }
export async function update(req,res) {
  const data = equipmentFields(req.body);
  const filter = {_id:req.params.id};
  if (data.status) filter.activeRequest = null;
  const equipment = await Equipment.findOneAndUpdate(filter,{$set:data},{new:true,runValidators:true});
  if (!equipment) throw new HttpError(409,'Equipment is missing or has an active loan. Return it before changing availability.');
  res.json({equipment});
}
export async function remove(req,res) {
  if (await BorrowRequest.exists({equipment:req.params.id,status:{$in:['pending','approved']}})) throw new HttpError(409,'Resolve borrowing requests before deleting this asset.');
  const result = await Equipment.findOneAndDelete({_id:req.params.id,activeRequest:null});
  if (!result) throw new HttpError(409,'Equipment is missing or has an active loan.'); res.status(204).end();
}

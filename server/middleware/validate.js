import { HttpError } from './errors.js';
export function text(value, label, max, min = 1) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max)
    throw new HttpError(400, `${label} must contain ${min}-${max} characters.`);
  return value.trim();
}
export function email(value) {
  const result = text(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new HttpError(400, 'Enter a valid email address.');
  return result;
}
export function password(value) {
  if (typeof value !== 'string' || value.length < 10 || Buffer.byteLength(value) > 72)
    throw new HttpError(400, 'Password must be at least 10 characters and at most 72 UTF-8 bytes.');
  return value;
}
export function dueDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new HttpError(400, 'Use a valid date: YYYY-MM-DD.');
  const date = new Date(value + 'T23:59:59.999Z');
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value || date < today || date.getTime() > today.getTime() + 31 * 86400000)
    throw new HttpError(400, 'Choose a due date from today through the next 30 days.');
  return date;
}
export function equipmentFields(body, creating = false) {
  const result = {};
  for (const [key, max] of [['name',100],['assetTag',30],['location',100],['description',1200]]) {
    if (creating || body[key] !== undefined) result[key] = text(body[key] ?? '', key, max, key === 'description' ? 0 : 1);
  }
  if (creating || body.category !== undefined) {
    if (!['Audio','Cameras','Computing','Accessories'].includes(body.category)) throw new HttpError(400, 'Choose a valid category.');
    result.category = body.category;
  }
  if (body.status !== undefined) {
    if (!['available','maintenance'].includes(body.status)) throw new HttpError(400, 'Use the return workflow to change an active loan.');
    result.status = body.status;
  }
  return result;
}

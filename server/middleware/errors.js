export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function notFound(req, res) { res.status(404).json({ message: 'Endpoint not found.' }); }
export function errorHandler(err, req, res, next) {
  if (err.code === 11000) return res.status(409).json({ message: 'That email, asset tag, or active borrowing request already exists.' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.type === 'entity.parse.failed')
    return res.status(400).json({ message: 'Invalid data. Check the fields and try again.' });
  const status = err.status || 500;
  if (status === 500 && process.env.NODE_ENV !== 'test') console.error(err);
  res.status(status).json({ message: status === 500 ? 'Something went wrong on the server.' : err.message });
}

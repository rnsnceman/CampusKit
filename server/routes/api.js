import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { authController } from '../controllers/authController.js';
import * as users from '../controllers/userController.js';
import * as equipment from '../controllers/equipmentController.js';
import * as requests from '../controllers/requestController.js';
export function apiRouter(secret) {
  const router = Router(), auth = authController(secret);
  const limiter = rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,message:{message:'Too many sign-in attempts. Try again in 15 minutes.'}});
  router.post('/auth/register',limiter,auth.register); router.post('/auth/login',limiter,auth.login);
  router.use(authenticate(secret)); router.get('/auth/me',auth.me);
  router.get('/users',adminOnly,users.list);
  router.route('/users/:id').get(users.read).patch(users.update).delete(users.remove);
  router.route('/equipment').get(equipment.list).post(adminOnly,equipment.create);
  router.route('/equipment/:id').get(equipment.read).patch(adminOnly,equipment.update).delete(adminOnly,equipment.remove);
  router.route('/requests').get(requests.list).post(requests.create);
  router.route('/requests/:id').get(requests.read).patch(requests.update).delete(requests.remove);
  return router;
}

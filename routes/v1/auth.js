import { Router } from 'express';
import { register, login, seedBasicUsers, seedAdminUsers } from '../../controllers/v1/auth.js';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/seedBasic').post(seedBasicUsers);
router.route('/seedAdmin').post(seedAdminUsers);

export default router;

import { Router } from 'express';
import { register, login, seedUsers } from '../../controllers/v1/auth.js';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/seedUsers').post(seedUsers);
// router.route('/seedAdmin').post(seedAdminUsers);

export default router;

import { Router } from 'express';

import { seedBasicUsers, seedAdminUsers } from '../../controllers/v1/seedUsers.js';

const router = Router();

router.route('/seedBasic').post(seedBasicUsers);
router.route('/seedAdmin').post(seedAdminUsers);

export default router;

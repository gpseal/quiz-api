import { Router } from 'express';

import {
  seedBasicUsers,
  seedAdminUsers,
  getUser,
  updateUser,
  deleteUsers,
  getUsers,
} from '../../controllers/v1/users.js';

const router = Router();
router.route('/').get(getUsers);
router.route('/:id').get(getUser);
router.route('/:id').put(updateUser);
router.route('/:id').delete(deleteUsers);
router.route('/seed/Basic').post(seedBasicUsers);
router.route('/seed/Admin').post(seedAdminUsers);

export default router;

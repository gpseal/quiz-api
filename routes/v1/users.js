/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets users based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all user records
 *
 * /:id:
 * get: get user record specified by id param
 * put: update user record specified by id param
 * delete: delete user record specified by id param
 *
 * /seed/Basic: seeds BASIC_USER accounts from external URL
 * /seed/Admin: seeds ADMIN_USER accounts from external URL
 */

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
router.route('/:id').get(getUser).put(updateUser).delete(deleteUsers);
router.route('/seed/Basic').post(seedBasicUsers);
router.route('/seed/Admin').post(seedAdminUsers);

export default router;

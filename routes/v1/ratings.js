/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets rating based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all rating records, post: create new rating record
 *
 * /:id:
 * get: get rating record specified by id param
 * put: update rating record specified by id param
 * delete: delete rating record specified by id param
 */

import { Router } from 'express';

import {
  getRating,
  getRatings,
  createRating,
  updateRating,
  deleteRating,
} from '../../controllers/v1/ratings.js';

const router = Router();

router.route('/').get(getRatings).post(createRating);
router.route('/:id').get(getRating).put(updateRating).delete(deleteRating);

export default router;

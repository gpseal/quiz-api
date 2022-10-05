/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets scores based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all score records, post: create new score record
 *
 * /:id:
 * get: get score record specified by id param
 * put: update score record specified by id param
 * delete: delete score record specified by id param
 */

import { Router } from 'express';

import {
  getScore,
  getScores,
  createScore,
  updateScore,
  deleteScore,
} from '../../controllers/v1/scores.js';

const router = Router();

router.route('/').get(getScores).post(createScore);
router.route('/:id').get(getScore).put(updateScore).delete(deleteScore);

export default router;

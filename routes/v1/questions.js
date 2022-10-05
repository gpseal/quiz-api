/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets question based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all question records, post: create new question record
 *
 * /:id:
 * get: get question record specified by id param
 * put: update question record specified by id param
 * delete: delete question record specified by id param
 */

import { Router } from 'express';

import {
  getQuestionSet,
  getQuestionSets,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
} from '../../controllers/v1/questions.js';

const router = Router();

router.route('/').get(getQuestionSets).post(createQuestionSet);
router.route('/:id').get(getQuestionSet).put(updateQuestionSet).delete(deleteQuestionSet);

export default router;

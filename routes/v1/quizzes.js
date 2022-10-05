/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets quiz based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all quiz records, post: create new quiz record
 *
 * /:id:
 * get: get quiz record specified by id param
 * delete: delete quiz record specified by id param
 *
 * /:id/participate: post: submit quiz user answers for analysis
 *
 * /:id/rate: post: creates new rating record
 *
 * /get/:timeFrame: get: get all quiz records based on time frame specified by timeFrame param
 */

import { Router } from 'express';

import {
  // getQuiz,
  getTimeQuizzes,
  getQuizzes,
  createQuiz,
  deleteQuiz,
  submitQuiz,
  takeQuiz,
  rateQuiz,
} from '../../controllers/v1/quizzes.js';

const router = Router();

router.route('/').get(getQuizzes).post(createQuiz);
router.route('/:id').get(takeQuiz).delete(deleteQuiz);
router.route('/:id/participate').post(submitQuiz);
router.route('/:id/rate').post(rateQuiz);
router.route('/get/:timeFrame').get(getTimeQuizzes);

export default router;

import { Router } from 'express';

import {
  getQuiz,
  getTimeQuizzes,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  takeQuiz,
  rateQuiz,
} from '../../controllers/v1/quizzes.js';

const router = Router();

router.route('/').get(getQuizzes).post(createQuiz);
router.route('/:id').get(takeQuiz).put(updateQuiz).delete(deleteQuiz);
router.route('/:id/participate').post(submitQuiz);
router.route('/:id/rate').post(rateQuiz);
router.route('/get/:timeFrame').get(getTimeQuizzes);

export default router;

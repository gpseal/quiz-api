import { Router } from 'express';

import {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  takeQuiz,
} from '../../controllers/v1/quizzes.js';

const router = Router();

router.route('/').get(getQuizzes).post(createQuiz);
router.route('/:id').get(takeQuiz).put(updateQuiz).delete(deleteQuiz);
router.route('/:id/participate').post(submitQuiz);
// router.route('/submit').post(submitQuiz);

export default router;

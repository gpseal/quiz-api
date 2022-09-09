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
router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);
router.route('/take').post(takeQuiz);
router.route('/submit').post(submitQuiz);

export default router;

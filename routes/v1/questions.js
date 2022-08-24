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
router
  .route('/:id')
  .get(getQuestionSet)
  .put(updateQuestionSet)
  .delete(deleteQuestionSet);

export default router;

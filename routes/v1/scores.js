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

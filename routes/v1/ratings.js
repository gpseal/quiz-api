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

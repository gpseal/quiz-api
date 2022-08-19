import { Router } from 'express';

import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../controllers/v1/categories.js';

// test

const router = Router();

router.route('/').get(getCategories).post(createCategory);
router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;

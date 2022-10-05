/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets category based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /:
 * get: get all categories, post: create new category
 *
 * /:id:
 * get: get category specified by id param
 * put: update category specified by id param
 * delete: delete category specified by id param
 *
 * /seed:  seed categories to database
 */

import { Router } from 'express';

import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} from '../../controllers/v1/categories.js';

const router = Router();

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory);
router.route('/seed').post(seedCategories);

export default router;

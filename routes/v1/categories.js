import { Router } from "express";

import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} from "../../controllers/v1/categories.js";

const router = Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;

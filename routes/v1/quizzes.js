import { Router } from "express";
const router = Router();

import {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  seedQuizzes,
} from "../../controllers/v1/quizzes.js";

router.route("/").get(getQuizzes).post(createQuiz);
router.route("/:id").get(getQuiz).put(updateQuiz).delete(deleteQuiz);

export default router;

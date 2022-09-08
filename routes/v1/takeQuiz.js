import { Router } from 'express';

import { takeQuiz } from '../../controllers/v1/takeQuiz.js';

const router = Router();

router.route('/:id').post(takeQuiz);

export default router;

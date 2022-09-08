import axios from 'axios';
import prisma from '../../utils/prisma.js';

import { catchReturn } from './base.js';

const takeQuiz = async (req, res) => {
  try {
    let score = 0;
    const { answers } = req.body; // gets answers from user post
    const { id } = req.params; // defines record to be displayed from URL params
    const questions = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        questions: true,
      },
      // finds record using ID from URL params
    });

    //  Finding user details
    const { user } = req.user;

    answers.forEach((answer, index) => {
      if (answer === questions.questions[0].questions[index].correct_answer) {
        score += 1;
      }
    });

    console.log('score', score);
    // checks that record exists
    if (!questions) {
      return res.status(200).json({
        msg: `No quiz with the id: ${id} found`,
      });
    }

    return res.status(200).json({
      Score: score,
      data: questions,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

const test = 'test';

export { takeQuiz, test };

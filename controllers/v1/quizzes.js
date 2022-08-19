import axios from 'axios';
import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
} from './base.js';

const tableName = 'quiz';

const getQuiz = (req, res) => {
  getResource(req, res, prisma.quiz, tableName);
};

const getQuizzes = (_, res) => {
  getResources(res, prisma.quiz, tableName);
};

const createQuiz = async (req, res) => {
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=18&difficulty=${req.body.difficulty}&type=${req.body.type}`,
    );
    const questions = response.data.results; // assigning api data

    const { quizName, categoryid } = req.body;

    await prisma.quiz.create({
      data: { quizName, categoryid, questions },
    });

    const newQuizzes = await prisma.quiz.findMany();

    return res.status(201).json({
      msg: 'Quiz successfully created',
      data: newQuizzes,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateQuiz = (req, res) => {
  updateResource(req, res, prisma.quiz, tableName);
};

const deleteQuiz = (req, res) => {
  deleteResource(req, res, prisma.quiz, tableName);
};

// Ask about why this one is being combined to one line
// prettier-ignore
export {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};

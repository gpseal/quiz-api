import axios from 'axios';
import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
  catchReturn,
} from './base.js';

const tableName = 'quiz';

const include = {
  questions: true,
};

const getQuiz = (req, res) => {
  getResource(req, res, prisma.quiz, tableName, include);
};

const getQuizzes = (_, res) => {
  getResources(res, prisma.quiz, tableName, include);
};

const createQuiz = async (req, res) => {
  // createResource(req, res, prisma.quiz, tableName);
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    //  create quiz using req data
    await prisma.quiz.create({
      data: {
        ...req.body,
        userId: id,
      },
    });

    //  collecting data for api request
    const { categoryid, difficulty, type } = req.body;

    //  requesting questions from api
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=${categoryid}&difficulty=${difficulty}&type=${type}`,
    );

    const questions = response.data.results;

    //  finding quiz id to associate questions with (highest ID)
    const latestEntry = await prisma.quiz.findMany({
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });

    const quizid = latestEntry[0].id;

    //  adding questions to newly created quiz
    await prisma.questions.create({
      data: {
        quizid,
        questions,
      },
    });

    const newResources = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
    }); // for displaying all records

    return res.status(201).json({
      msg: `${tableName} successfully created`,
      data: newResources, // show all records
    });
  } catch (err) {
    return catchReturn(res, err);
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

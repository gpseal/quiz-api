import axios from 'axios';
import prisma from '../../utils/prisma.js';

import { getResource, deleteResource, getResources, updateResource } from './base.js';

const tableName = 'quiz';

const include = {
  questions: true,
};

const getQuestionSet = (req, res) => {
  getResource(req, res, prisma.questions, tableName);
};

const getQuestionSets = (_, res) => {
  getResources(res, prisma.questions, tableName);
};

const createQuestionSet = async (req, res) => {
  try {
    const quizInfo = await axios.get(`http://localhost:3000/api/v1/quizzes/1`);
    const { categoryid } = quizInfo.data.data;
    console.log('categoryid: ', categoryid);

    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=${categoryid}`,
    );

    const questions = response.data.results; // assigning api data

    const { quizid } = req.body;

    await prisma.questions.create({
      data: {
        quizid,
        questions,
      },
    });

    const newQuestions = await prisma.questions.findMany();

    return res.status(201).json({
      msg: 'Question Set successfully created',
      data: newQuestions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateQuestionSet = (req, res) => {
  updateResource(req, res, prisma.questions, tableName);
};

const deleteQuestionSet = (req, res) => {
  deleteResource(req, res, prisma.questions, tableName);
};

// Ask about why this one is being combined to one line
// prettier-ignore
export {
  getQuestionSet,
  getQuestionSets,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};

import axios from 'axios';
// import { response } from 'express';
import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
  catchReturn,
} from './base.js';

const dateFormat = 'T00:00:00.000Z';

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

    // formatting date to prisma format

    const startDate = req.body.start_date + dateFormat;
    const endDate = req.body.end_date + dateFormat;

    console.log('startDate', startDate);
    console.log('endDate', endDate);
    console.log('Date.now()', Date.now());

    console.log(Date.now());

    //  create quiz using req data
    await prisma.quiz.create({
      data: {
        ...req.body,
        start_date: req.body.start_date + dateFormat,
        end_date: req.body.end_date + dateFormat,
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

    // creating quiz rating table
    await prisma.rating.create({
      data: {
        quizId: quizid,
        userId: id,
        rating: 0,
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

// allows users to participate in quizzes within quiz dates
const takeQuiz = async (req, res) => {
  try {
    const { quizID: id } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        questions: true,
      },
    });

    if (Date.now() < quiz.start_date) {
      return res.status(200).json({
        msg: `Quiz has not yet begun`,
      });
    }

    if (Date.now() > quiz.end_date) {
      return res.status(200).json({
        msg: `Quiz is has already been completed`,
      });
    }

    const formattedQuestions = [];

    quiz.questions[0].questions.forEach((question, index) => {
      const quest = question.question;
      const answers = question.incorrect_answers;
      answers.push(question.correct_answer);
      const shuffledQuestions = answers.sort((a, b) => 0.5 - Math.random());
      const questionList = {
        question: quest,
        answers: shuffledQuestions,
      };
      formattedQuestions.push(questionList);
    });

    return res.json({
      data: formattedQuestions,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

const submitQuiz = async (req, res) => {
  try {
    let score = 0;
    const { answers } = req.body; // gets answers from user post
    const { quizID: id } = req.body; // defines record to be displayed from URL params

    if (answers.length !== 10) {
      return res.status(200).json({
        msg: `You must answer all ten questions to submit`,
      });
    }
    // getting questions answers to compare with user post
    const questions = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        questions: true,
      },
      // finds record using ID from URL params
    });

    // checks that record exists
    if (!questions) {
      return res.status(200).json({
        msg: `No quiz with the id: ${id} found`,
      });
    }

    //  Finding user details
    const { id: userID } = req.user;
    const userDetails = await prisma.user.findUnique({
      where: {
        id: Number(userID),
      },
      // finds record using ID from URL params
    });

    answers.forEach((answer, index) => {
      if (answer === questions.questions[0].questions[index].correct_answer) {
        score += 1;
      }
    });

    // creating score rating table
    await prisma.score.create({
      data: {
        quizID: Number(id),
        userId: userID,
        score,
      },
    });

    const scores = await prisma.score.findMany({
      where: {
        quizID: Number(id),
      },
      // finds record using ID from URL params
    });

    // calculate average score of quiz
    let sum = 0;

    scores.forEach((quizScore) => {
      sum += quizScore.score;
    });

    const avg = (sum / scores.length).toFixed(2);

    return res.status(200).json({
      msg: `${userDetails.username} has successfully participated in ${questions.name}`,
      Score: score,
      Quiz_Average: avg,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

// Ask about why this one is being combined to one line
// prettier-ignore
export {
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  takeQuiz,
};

import axios from 'axios';
// import { response } from 'express';
import prisma from '../../utils/prisma.js';
import { lengthChecks, checkCharacterType } from '../../utils/validation.js';
import authCheck from '../../utils/authorization.js';
import { getResource, deleteResource, getResources, updateResource, catchReturn } from './base.js';

const tableName = 'quiz';

const include = {
  questions: true,
  scores: true,
  rating: true,
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

    if (authCheck(user, res, 'ADMIN_USER', 'SUPER_ADMIN_USER')) return;

    //  preparing dates for checking
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    const currentDate = new Date();
    const dateAddFive = new Date();
    dateAddFive.setDate(startDate.getDate() + 5);

    // checking that start date is valid
    if (startDate < currentDate) {
      return res.status(400).json({
        msg: `start date must be greater than today's date `,
      });
    }

    // checking that end date is valid
    if (endDate > dateAddFive || endDate < startDate) {
      return res.status(400).json({
        msg: `End date must be greater than the start date & no longer than five days`,
      });
    }

    if (lengthChecks('quiz name', req.body.name, 5, 30, res)) return;
    if (
      checkCharacterType('quiz name', req.body.name, /^[A-Za-z]+$/, 'alpha characters only', res)
    ) {
      return;
    }

    //  create quiz using req data
    await prisma.quiz.create({
      data: {
        ...req.body,
        start_date: startDate,
        end_date: endDate,
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
  deleteResource(req, res, prisma.quiz, tableName, authCheck);
};

// allows users to participate in quizzes within quiz dates
const takeQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userID } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userID),
      },
    });

    // checking user authentication
    if (authCheck(user, res, 'BASIC_USER')) return;

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
        msg: `Quiz has already been completed`,
      });
    }

    //  fomatting quiz to display only questions & shuffled answers
    const formattedQuestions = [];

    quiz.questions[0].questions.forEach((question) => {
      const quest = question.question;
      //  creating array to shuffle and display all possible answers
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
      questions: formattedQuestions,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

const submitQuiz = async (req, res) => {
  try {
    let score = 0;
    const { answers } = req.body; // gets answers from user post
    const { id } = req.params; // defines record to be displayed from URL params

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

    //  calculate score by comparing submitted answers to correct answers
    answers.forEach((answer, index) => {
      if (answer === questions.questions[0].questions[index].correct_answer) {
        score += 1;
      }
    });

    // creating score table
    await prisma.score.create({
      data: {
        quizID: Number(id),
        userId: userID,
        score,
      },
    });

    //  calculating total average of quiz
    const average = await prisma.score.aggregate({
      _avg: {
        score: true,
      },
      where: {
        quizID: Number(id),
      },
    });

    // adding newly calculated average to quiz table
    await prisma.quiz.update({
      where: {
        id: Number(id),
      },
      data: {
        // eslint-disable-next-line no-underscore-dangle
        average: average._avg.score,
      },
    });

    return res.status(200).json({
      msg: `${userDetails.username} has successfully participated in ${questions.name}`,
      Score: score,
      // eslint-disable-next-line no-underscore-dangle
      Quiz_Average: average._avg.score.toFixed(2),
    });
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

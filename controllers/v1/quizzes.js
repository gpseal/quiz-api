/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For handling all functions regarding quizzes
 *
 * getQuizzes: Finds and displays all quizzes to users, applying appropriate queries
 * getTimeQuizzes: Finds and displays quizzes based on time frame entered as URL param
 * createQuiz: Creates quiz from external API based on information contained in the request by user
 * deleteQuiz: Removes quiz from database based on request params
 * takeQuiz: Finds and displays formatted version of quiz for user to participate
 * submitQuiz:  Takes array of answers from user and compares to correct answers stored in quiz.
 *              Adds entry to score table, generates quiz average score and adds to quiz record.
 *              Calculates current highest score for quiz and ads username as winner of quiz.
 * rateQuiz:  Allows user to add rating to quiz.  Adds rating to table, calculates average quiz
 *            rating and ads to quiz record
 */

import axios from 'axios';
import prisma from '../../utils/prisma.js';
import { fieldValidation } from '../../utils/validation.js';
import authCheck from '../../utils/authorization.js';
import { deleteResource, getResources, catchReturn } from './base.js';
import { getUserInfo } from '../../utils/misc.js';

const tableName = 'quiz';

// creating query to add to quiz requests
const baseQuery = {
  include: {
    questions: true,
    scores: true,
    rating: true,
  },
};

/**
 * Finds and displays all quizzes to user
 * @param {Request} req
 * @param {Response} res
 */
const getQuizzes = (req, res) => {
  getResources(req, res, prisma.quiz, tableName, baseQuery);
};

//  creating queries to add to time based requests
const past = {
  where: {
    end_date: {
      lt: new Date(),
    },
  },
  include: {
    questions: true,
    scores: true,
    rating: true,
  },
};

const current = {
  where: {
    end_date: {
      gte: new Date(),
    },
    start_date: {
      lt: new Date(),
    },
  },
  include: {
    questions: true,
    scores: true,
    rating: true,
  },
};

const future = {
  where: {
    start_date: {
      gte: new Date(),
    },
  },
  include: {
    questions: true,
    scores: true,
    rating: true,
  },
};

/**
 * Finds and displays quizzes based on param entered in URL
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 200
 * @returns JSON error message if status = 500
 */
const getTimeQuizzes = (req, res) => {
  //  adjusts queries based on time frame from URL params
  const { timeFrame } = req.params;
  if (timeFrame === 'past') {
    getResources(req, res, prisma.quiz, tableName, past);
  }
  if (timeFrame === 'current') {
    getResources(req, res, prisma.quiz, tableName, current);
  }
  if (timeFrame === 'future') {
    getResources(req, res, prisma.quiz, tableName, future);
  }
};

/**
 * Creates quiz after Validating data and checking user authorisation
 * Populates quiz with questions / answers from external API
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 401, 400, 201
 * @returns JSON error message if status = 500
 */
const createQuiz = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await getUserInfo(id);

    //  checking user is authorised to create quiz
    if (authCheck(user, 'ADMIN_USER', 'SUPER_ADMIN_USER') !== true) {
      return res.status(401).json({
        msg: `not authorised to perform this action`,
      });
    }

    //  preparing dates for checking
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    const currentDate = new Date();
    const dateAddFive = new Date();
    dateAddFive.setDate(startDate.getDate() + 5);

    // checking that start date is valid
    if (startDate < currentDate) {
      return res.status(400).json({
        msg: `start date must be greater than today's date`,
      });
    }
    // checking that end date is valid
    if (endDate > dateAddFive || endDate < startDate) {
      return res.status(400).json({
        msg: `End date must be greater than the start date & no longer than five days`,
      });
    }

    //  checking validation of quiz name
    const alphaOnly = /^[A-Za-z]+$/;
    if (fieldValidation('quiz name', req.body.name, 5, 30, alphaOnly, 'alpha characters only')) {
      return res.status(400).json({
        msg: fieldValidation('quiz name', req.body.name, 5, 30, alphaOnly, 'alpha characters only'),
      });
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

    //  finding quiz id to associate questions with
    //  (highest ID, which will be the quiz just created)
    const latestEntry = await prisma.quiz.findMany({
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });

    const quizid = latestEntry[0].id;

    //  adding questions and associating with newly created quiz
    await prisma.questions.create({
      data: {
        quizid,
        questions,
      },
    });
    // fetching newly created quiz to display to user
    const newQuiz = await prisma.quiz.findFirst({
      where: {
        id: quizid,
      },
      include: {
        questions: true,
      },
    });

    return res.status(201).json({
      msg: `${tableName} successfully created`,
      data: newQuiz, // show all records
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Deletes quiz after checking user authorisation
 * @param {Request} req
 * @param {Response} res
 */
const deleteQuiz = (req, res) => {
  deleteResource(req, res, prisma.quiz, tableName, 'SUPER_ADMIN_USER');
};

/**
 * allows users to participate in quizzes
 * Checks user authorisation, checks if quiz is currently available
 * Formats quiz to display to users
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 401, 400, 200
 * @returns JSON error message if status = 500
 */
const takeQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userID } = req.user;

    const user = await getUserInfo(userID);

    // checking user authorisation
    if (authCheck(user, 'BASIC_USER') !== true) {
      return res.status(401).json({
        msg: `not authorised to perform this action `,
      });
    }

    //  getting quiz to display to user
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        questions: true,
      },
    });

    //  Checking if quiz is currently available (based on dates)
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

    //  formatting quiz to display only questions & shuffled answers
    const formattedQuestions = [];

    quiz.questions[0].questions.forEach((question) => {
      const quest = question.question;
      //  creating array of correct and incorrect answers
      const answers = question.incorrect_answers;
      answers.push(question.correct_answer);
      //  shuffles array of answers
      const shuffledQuestions = answers.sort((a, b) => 0.5 - Math.random());
      //  creating object containing questions and shuffled answers
      const questionList = {
        question: quest,
        answers: shuffledQuestions,
      };
      //  adding object to array
      formattedQuestions.push(questionList);
    });

    // displaying formatted questions to user
    return res.status(200).json({
      questions: formattedQuestions,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * allows users to submit answers for quizzes
 * Checks user authorisation, checks if quiz is currently available
 * Checks that all answers have been submitted
 * Compares user answers with corrects answers to produce a score
 * Calculates total average score of quiz
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 401, 400, 200
 * @returns JSON error message if status = 500
 */
const submitQuiz = async (req, res) => {
  try {
    //  Finding user details
    const { id: userID } = req.user;
    const userDetails = await getUserInfo(userID);

    if (authCheck(userDetails, 'BASIC_USER') !== true) {
      return res.status(401).json({
        msg: `not authorised to perform this action `,
      });
    }

    let score = 0;
    const answers = req.body; // gets answers from user post
    const { id } = req.params; // defines record to be displayed from URL params

    //  making sure all 10 questions have been answered
    if (answers.length !== 10) {
      return res.status(200).json({
        msg: `You must answer all ten questions to submit`,
      });
    }
    // getting question answers to compare with user post
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        questions: true,
      },
      // finds record using ID from URL params
    });

    // checks that quiz exists
    if (!quiz) {
      return res.status(200).json({
        msg: `No quiz with the id: ${id} found`,
      });
    }

    //  calculate score by comparing submitted answers to correct answers
    answers.forEach((answer, index) => {
      // eslint-disable-next-line max-len
      if (
        answer.toLowerCase() === quiz.questions[0].questions[index].correct_answer.toLowerCase()
      ) {
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

    //  finding current leader to add as quiz winner
    const scores = await prisma.score.findMany({
      where: {
        quizID: Number(id),
      },
    });

    //  finding the winning score
    let maxScore = 0;
    scores.forEach((scoreRecord) => {
      if (scoreRecord.score > maxScore) {
        maxScore = score;
      }
    });

    //  collecting winning userIDs and adding to array
    const winnerIDs = [];
    scores.forEach((scoreRecord) => {
      if (scoreRecord.score === maxScore) {
        winnerIDs.push(scoreRecord.userId);
      }
    });

    //  collecting user IDs so that we can record names into database
    const allUsers = await prisma.user.findMany();
    let winnerUserNames = [];
    allUsers.forEach((user) => {
      if (winnerIDs.includes(user.id)) {
        winnerUserNames.push(user.username);
      }
    });

    //  formatting usernames into string to place into database record
    winnerUserNames = winnerUserNames.toString().replace(',', ', ');

    //  Calculating quiz average
    const average = await prisma.score.aggregate({
      _avg: {
        score: true,
      },
      where: {
        quizID: Number(id),
      },
    });

    // adding newly calculated average and winner(s) to quiz table
    await prisma.quiz.update({
      where: {
        id: Number(id),
      },
      data: {
        // eslint-disable-next-line no-underscore-dangle
        avgScore: average._avg.score,
        winner: winnerUserNames,
      },
    });

    return res.status(200).json({
      msg: `${userDetails.username} has successfully participated in ${quiz.name}`,
      Score: score,
      // eslint-disable-next-line no-underscore-dangle
      Quiz_Average: average._avg.score.toFixed(2),
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * allows users to submit a quiz rating, calculates quiz average
 * and adds to quiz table
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 401, 400, 200
 * @returns JSON error message if status = 500
 */
const rateQuiz = async (req, res) => {
  try {
    const { id } = req.user;
    const { id: quizID } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: Number(quizID),
      },
    });

    if (!quiz) {
      return res.status(200).json({
        msg: `No quiz with the id ${quizID} found`,
      });
    }

    await prisma.rating.create({
      data: {
        ...req.body,
        quizID: Number(quizID),
        userId: id,
      },
    });

    //  calculating total average of quiz
    const average = await prisma.rating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        quizID: Number(quizID),
      },
    });

    // adding newly calculated average to quiz table
    await prisma.quiz.update({
      where: {
        id: Number(quizID),
      },
      data: {
        // eslint-disable-next-line no-underscore-dangle
        avgScore: average._avg.rating,
      },
    });

    const newResources = await prisma.rating.findMany(); // for displaying all records

    return res.status(201).json({
      msg: `Rating for quiz ${quizID} successfully added`,
      data: newResources, // show all records
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

// prettier-ignore
export {
  getQuizzes,
  getTimeQuizzes,
  createQuiz,
  deleteQuiz,
  submitQuiz,
  takeQuiz,
  rateQuiz,
};

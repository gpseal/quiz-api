import prisma from "../../utils/prisma.js";
import axios from "axios";

import {
  getResource,
  deleteResource,
  getResources,
  createResource,
  updateResource,
  seedData,
} from "./base.js";

const tableName = "quiz";

const getQuiz = (req, res) => {
  getResource(req, res, prisma.quiz, tableName);
};

const getQuizzes = (_, res) => {
  getResources(res, prisma.quiz, tableName);
};

// const createQuiz = (req, res) => {
//   createResource(req, res, prisma.quiz, tableName);
// };

const createQuiz = async (req, res) => {
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=18&difficulty=${req.body.difficulty}&type=${req.body.type}`,
    );
    const questions = response.data.results; //assigning api data
    console.log(questions);

    const { quizName, categoryid } = req.body;

    await prisma.quiz.create({
      data: { quizName, categoryid, questions },
    });

    const newQuizzes = await prisma.quiz.findMany();

    return res.status(201).json({
      msg: "Quiz successfully created",
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

const deptURL =
  "https://gist.githubusercontent.com/gpseal/c93ae295594b4a095935bef266eab86f/raw/71e4d284cfcbb4895bc2ab29019030961db95b2f/departments.json";

const seedQuizzes = (req, res) => {
  seedData(req, res, prisma.quiz, tableName, deptURL);
};

export { getQuiz, getQuizzes, createQuiz, updateQuiz, deleteQuiz, seedQuizzes };

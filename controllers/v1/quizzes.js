import axios from 'axios';
import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
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

const createQuiz = (req, res) => {
  createResource(req, res, prisma.quiz, tableName);
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

import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
} from './base.js';

const tableName = 'score';

const getScore = (req, res) => {
  getResource(req, res, prisma.score, tableName);
};

const getScores = (_, res) => {
  getResources(res, prisma.score, tableName);
};

const createScore = (req, res) => {
  createResource(req, res, prisma.score, tableName);
};

const updateScore = (req, res) => {
  updateResource(req, res, prisma.score, tableName);
};

const deleteScore = (req, res) => {
  deleteResource(req, res, prisma.score, tableName);
};

// Ask about why this one is being combined to one line
// prettier-ignore
export {
  getScore,
  getScores,
  createScore,
  updateScore,
  deleteScore,
};

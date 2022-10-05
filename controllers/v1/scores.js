/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For handling all functions regarding score
 *
 * getScore: finds and displays individual score record
 * getScores: finds and displays all score records
 * createScore: Creates a new score record
 * updateScore: Updates an existing score record
 * deleteScore: Deletes a specified score record
 */

import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
} from './base.js';

const tableName = 'score';

/**
 * Function finds and displays individual score record
 * @param {Request} req
 * @param {Response} res
 */
const getScore = (req, res) => {
  getResource(req, res, prisma.score, tableName);
};

/**
 * Function finds and displays all score records
 * @param {Request} req
 * @param {Response} res
 */
const getScores = (_, res) => {
  getResources(res, prisma.score, tableName);
};

/**
 * Function creates individual score record
 * @param {Request} req
 * @param {Response} res
 */
const createScore = (req, res) => {
  createResource(req, res, prisma.score, tableName);
};

/**
 * Function finds and updates specified score record
 * @param {Request} req
 * @param {Response} res
 */
const updateScore = (req, res) => {
  updateResource(req, res, prisma.score, tableName);
};

/**
 * Function finds and deletes specified score record
 * @param {Request} req
 * @param {Response} res
 */
const deleteScore = (req, res) => {
  deleteResource(req, res, prisma.score, tableName);
};

// prettier-ignore
export {
  getScore,
  getScores,
  createScore,
  updateScore,
  deleteScore,
};

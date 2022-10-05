/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For handling all functions regarding ratings
 *
 * getRating: finds and displays individual rating record
 * getRatings: finds and displays all rating records
 * createRating: Creates a new rating record
 * updateRating: Updates an existing rating record
 * deleteRating: Deletes a specified rating record
 */

import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
} from './base.js';

const tableName = 'rating';

/**
 * Function finds and displays individual rating record
 * @param {Request} req
 * @param {Response} res
 */
const getRating = (req, res) => {
  getResource(req, res, prisma.rating, tableName);
};

/**
 * Function finds and displays all rating records
 * @param {Request} req
 * @param {Response} res
 */
const getRatings = (_, res) => {
  getResources(res, prisma.rating, tableName);
};

/**
 * Function creates individual rating record
 * @param {Request} req
 * @param {Response} res
 */
const createRating = (req, res) => {
  createResource(req, res, prisma.rating, tableName);
};

/**
 * Function finds and updates specified rating record
 * @param {Request} req
 * @param {Response} res
 */
const updateRating = (req, res) => {
  updateResource(req, res, prisma.rating, tableName);
};

/**
 * Function finds and deletes specified rating record
 * @param {Request} req
 * @param {Response} res
 */
const deleteRating = (req, res) => {
  deleteResource(req, res, prisma.rating, tableName);
};

// prettier-ignore
export {
  getRating,
  getRatings,
  createRating,
  updateRating,
  deleteRating,
};

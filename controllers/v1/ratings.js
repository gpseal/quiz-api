import prisma from '../../utils/prisma.js';

import {
  getResource,
  deleteResource,
  getResources,
  updateResource,
  createResource,
} from './base.js';

const tableName = 'rating';

const getRating = (req, res) => {
  getResource(req, res, prisma.rating, tableName);
};

const getRatings = (_, res) => {
  getResources(res, prisma.rating, tableName);
};

const createRating = (req, res) => {
  createResource(req, res, prisma.rating, tableName);
};

const updateRating = (req, res) => {
  updateResource(req, res, prisma.rating, tableName);
};

const deleteRating = (req, res) => {
  deleteResource(req, res, prisma.rating, tableName);
};

// Ask about why this one is being combined to one line
// prettier-ignore
export {
  getRating,
  getRatings,
  createRating,
  updateRating,
  deleteRating,
};

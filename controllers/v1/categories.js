import prisma from '../../utils/prisma.js';
import {
  getResource,
  deleteResource,
  getResources,
  createResource,
  updateResource,
  seedData,
} from './base.js';

const tableName = 'category';

const getCategory = (req, res) => {
  getResource(req, res, prisma.category, tableName);
};

const include = {
  quizzes: true,
};

const getCategories = (_, res) => {
  getResources(res, prisma.category, tableName, include);
};

const createCategory = (req, res) => {
  createResource(req, res, prisma.category, tableName);
};

const updateCategory = (req, res) => {
  updateResource(req, res, prisma.category, tableName);
};

const deleteCategory = (req, res) => {
  deleteResource(req, res, prisma.category, tableName);
};

const deptURL =
  'https://gist.githubusercontent.com/gpseal/c93ae295594b4a095935bef266eab86f/raw/71e4d284cfcbb4895bc2ab29019030961db95b2f/departments.json';

const seedCategories = (req, res) => {
  seedData(req, res, prisma.category, tableName, deptURL);
};

export {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};

import axios from 'axios';
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

const URL = 'https://opentdb.com/api_category.php';

const seedCategories = async (req, res) => {
  await prisma.category.deleteMany({
    // empty
  });
  await seedData(req, res, prisma.category, tableName, URL);
};

export {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};

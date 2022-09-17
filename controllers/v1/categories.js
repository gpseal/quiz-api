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
  seedData(req, res, prisma.category, tableName, URL);
  // try {
  //   const response = await axios.get('https://opentdb.com/api_category.php');
  //   const data = response.data.trivia_categories; // assigning api data

  //   await prisma.category.createMany({
  //     data,
  //   }); // check this, should it be data:data?

  //   const newResources = await prisma.category.findMany();

  //   return res.status(201).json({
  //     msg: `Categories successfully created`,
  //     data: newResources,
  //   });
  // } catch (err) {
  //   return res.status(500).json({
  //     msg: err.message,
  //   });
  // }
};

export {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};

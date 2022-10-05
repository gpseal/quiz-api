/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Base functions for handling various user requests
 *
 * getResource: Gets and displays single resource
 * getResources: Get and display a group of resources
 * deleteResource: Authenticates user and deletes a single resource
 * createResource: Creates a single resource
 * updateResource: Updates a single resource
 * seedData: Seeds data from a specified URL
 * seedUsers: Authenticates user and seeds user accounts from a specified URL
 */

import axios from 'axios';
import bcryptjs from 'bcryptjs';
import prisma from '../../utils/prisma.js';
import { checkInputs } from '../../utils/validation.js';
import authCheck from '../../utils/authorization.js';

/**
 * This function returns a 500 status and error message
 * @param {Request} req
 * @param {Error} err
 * @returns JSON error message if status = 500
 */
const catchReturn = (res, err) => {
  res.status(500).json({
    msg: err.message,
  });
};

/**
 * This function finds and displays a single resource based on req params
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @param {Object} include prisma query parameters
 * @returns JSON message if status = 200
 * @returns JSON error message if status = 500
 */
const getResource = async (req, res, model, tableName, include) => {
  try {
    //  getting resource id from req params
    const { id } = req.params;
    //  if "include" exists, apply to prisma query
    const resource = !include
      ? await model.findUnique({
          where: {
            id: Number(id),
          }, // finds record using ID from URL params
        })
      : await model.findUnique({
          where: {
            id: Number(id),
          },
          include,
        });

    // checks that record exists, returns error if not
    if (!resource) {
      return res.status(200).json({
        msg: `No ${tableName} with the id: ${id} found`,
      });
    }

    // displays record if it exists
    return res.status(200).json({
      data: resource,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Finds and displays all records in a table
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @param {Object} include prisma query parameters
 * @returns JSON message if status = 200
 * @returns JSON error message if status = 500
 */
const getResources = async (req, res, model, tableName, include) => {
  try {
    /**
     * The findMany function returns all records
     */
    // checks to see if 'include' exists as an argument, adds to findMany if it does
    // prettier-ignore
    const resources = !include ?
      await model.findMany() :
      await model.findMany(
        {
          include,
        },
      );

    // if array is empty
    if (resources.length === 0) {
      return res.json({
        msg: `No ${tableName} found`,
      });
    }

    return res.status(200).json({
      data: resources,
    }); // displays all resources
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Finds and deletes a single resource based on req params
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @param {Object} include prisma query parameters
 * @returns JSON message if status = 200
 * @returns JSON error message if status = 500
 */
const deleteResource = async (req, res, model, tableName, userType) => {
  try {
    const userID = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userID),
      },
    });

    /*  check if authorization function has been given as argument,
    if so, check if user has proper authorization */
    if (authCheck(user, userType) !== true) {
      return res.status(401).json({
        msg: `not authorised to perform this action `,
      });
    }

    const { id } = req.params; // defines record to be delete with URL params

    const resource = await model.findUnique({
      where: {
        id: Number(id),
      }, // finds record using ID from URL params
    });

    // check record exists
    if (!resource) {
      return res.status(200).json({
        msg: `No ${tableName} with the id ${id} found`,
      });
    }

    await model.delete({
      where: {
        id: Number(id),
      }, // deletes record that matches ID
    });

    return res.status(200).json({
      msg: `${tableName} with the id ${id} successfully deleted`,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Creates a single database resource
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @returns JSON message if status = 201
 * @returns JSON error message if status = 500
 */
const createResource = async (req, res, model, tableName) => {
  try {
    // Get the authenticated user's id from the Request's user property
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    await model.create({
      data: {
        ...req.body,
        userId: id,
      },
    });
    /**
     * creates record with req body plus ID of user creating it
     * which is added to request in middleware
     */

    const newResources = await model.findMany(); // for displaying all records

    return res.status(201).json({
      msg: `${tableName} successfully created`,
      data: newResources, // show all records
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Updates a single database record
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @returns JSON message if status = 201
 * @returns JSON error message if status = 500
 */
const updateResource = async (req, res, model, tableName) => {
  try {
    const { id } = req.params; // defines record to be updated with URL params

    let resource = await model.findUnique({
      // finds record using ID from URL params
      where: {
        id: Number(id),
      },
    });

    // check record exists
    if (!resource) {
      return res.status(200).json({
        msg: `No ${tableName} with the id: ${id} found`,
      });
    }

    /**
     * The update function updates a single record using an
     * id or unique identifier
     */
    resource = await model.update({
      where: {
        id: Number(id),
      },
      data: req.body, // replaces existing data with new payload data
    });

    return res.json({
      msg: `${tableName} with the id: ${id} successfully updated`,
      data: resource, // displays new record data
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Seeds data from a specified URL
 * @param {Request} req
 * @param {Response} res
 * @param {Property} model references prisma model
 * @param {String} tableName name of the table being referenced
 * @param {String} URL url to seed data from
 * @param {String} userType1 user type to be checked for authorization
 * @param {String} userType2 user type to be checked for authorization
 * @returns JSON message if status = 201
 * @returns JSON error message if status = 500
 */
const seedData = async (req, res, model, tableName, URL, userType1, userType2) => {
  try {
    const { id: userID } = req.user;
    // const userID = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userID),
      },
    });

    //  collection data from URL
    const response = await axios.get(URL);
    // eslint-disable-next-line camelcase
    const { trivia_categories } = response.data; // assigning api data

    // Insert documents into the collection
    await model.createMany({
      // eslint-disable-next-line camelcase
      data: trivia_categories,
    });

    return res.status(201).json({
      msg: `${tableName}s successfully created`,
      // eslint-disable-next-line camelcase
      data: trivia_categories,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

/**
 * Authenticates requesting user and Seeds user data from a specified URL
 * @param {Request} req
 * @param {Response} res
 * @param {String} usersURL url to seed data from
 * @param {String} userType1 user type to be checked for authorization
 * @param {String} userType2 user type to be checked for authorization
 * @returns JSON message if status = 201
 * @returns JSON error message if status = 500
 */
const seedUsers = async (req, res, usersURL, userType1, userType2) => {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    //  checking if user is authorised to seed users
    if (authCheck(user, userType1, userType2) !== true) {
      return res.status(401).json({
        msg: `not authorised to perform this action `,
      });
    }

    //  collection data from specified URL
    const response = await axios.get(usersURL);
    const { data: userData } = response; // assigning api data

    //  checking that user data credentials are correct
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userData.length; i++) {
      if (checkInputs(userData[i])) {
        return res.status(400).json({
          msg: checkInputs(userData[i]),
        });
      }
    }

    //  checking role of users to be seeded
    let { role } = userData[0];
    //  if no role specified, default to BASIC_USER
    if (!role) {
      role = 'BASIC_USER';
    }

    //  removing existing users based on role
    await prisma.user.deleteMany({
      where: {
        role,
      },
    });

    //  salting passwords of data to be inserted
    const data = await Promise.all(
      userData.map(async (userEntry) => {
        const salt = await bcryptjs.genSalt();
        userEntry.password = await bcryptjs.hash(userEntry.password, salt);
        delete userEntry.confirmPassword;
        return {
          ...userEntry,
        };
      }),
    );

    //  Inserting data into database
    await prisma.user.createMany({
      data,
    });

    //  Removing passwords from data to be displayed
    data.forEach((userEntry) => {
      delete userEntry.password;
    });

    //  Displaying data
    return res.status(200).json({
      msg: 'Users successfully added',
      data,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

// eslint-disable-next-line max-len
export {
  getResource,
  getResources,
  deleteResource,
  updateResource,
  createResource,
  seedData,
  catchReturn,
  seedUsers,
};

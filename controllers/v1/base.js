import axios from 'axios';
import prisma from '../../utils/prisma.js';

const catchReturn = (res, err) => {
  res.status(500).json({
    msg: err.message,
  });
};

// single resource
const getResource = async (req, res, model, tableName) => {
  try {
    const { id } = req.params; // defines record to be displayed from URL params

    const resource = await model.findUnique({
      where: {
        id: Number(id),
      }, // finds record using ID from URL params
    });

    // checks that record exists
    if (!resource) {
      return res.status(200).json({
        msg: `No ${tableName} with the id: ${id} found`,
      });
    }

    return res.json({
      data: resource,
    }); // displays record
  } catch (err) {
    return catchReturn(res, err);
  }
};

// all resources
const getResources = async (res, model, tableName, include) => {
  try {
    /**
     * The findMany function returns all records
     */
    // checks to see if 'include' exists as an argument, adds to findMany if it does
    // prettier-ignore
    const resources = !include
      ? await model.findMany()
      : await model.findMany({
        include,
      });

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

// delete single resource
const deleteResource = async (req, res, model, tableName) => {
  try {
    const userID = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userID),
      },
    });

    if (user.role !== 'SUPER_ADMIN_USER') {
      return res.status(403).json({
        msg: 'Not authorized to access this route',
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
        msg: `No ${tableName} with the id: ${id} found`,
      });
    }

    await model.delete({
      where: {
        id: Number(id),
      }, // deletes record that matches ID
    });

    return res.json({
      msg: `${tableName} with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

// Create single resource
const createResource = async (req, res, model, tableName) => {
  try {
    /**
     * The create function creates a new record using the required fields,
     * i.e., name, region and country
     */

    // Get the authenticated user's id from the Request's user property
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    /**
     * Now you will know which authenticated user created which institution
     */

    /**
     * If the authenticated user is not an admin, they can
     * not create a new record
     */
    // if ((user.role !== "ADMIN_USER") && (user.role !== "SUPER_ADMIN_USER")) {
    //   return res.status(403).json({
    //     msg: "Not authorized to access this route",
    //   });
    // }
    // console.log(first)

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

const updateResource = async (req, res, model, tableName) => {
  try {
    // const userID = req.user.id;

    // const user = await prisma.user.findUnique({ where: { id: Number(userID) } });

    // if ((user.role !== "ADMIN_USER") && (user.role !== "SUPER_ADMIN_USER")) {
    //   return res.status(403).json({
    //     msg: "Not authorized to access this route",
    //   });
    // }

    const { id } = req.params; // defines record to be updated with URL params
    // payload = req.body; // populates payload object with properties of PUT request

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

const seedData = async (req, res, model, tableName, URL) => {
  try {
    const response = await axios.get(URL);
    const { data } = response; // assigning api data

    // console.log(data);

    // const newDepartments = await prisma.department.findMany();
    // await prisma.department.deleteMany()
    // Delete all documents in the departments collection
    // Insert documents into the collection (from api axios get)
    await model.createMany({
      data,
    }); // check this, should it be data:data?

    const newResources = await model.findMany();

    return res.status(201).json({
      msg: 'Departments successfully created',
      data: newResources,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

export { getResource, getResources, deleteResource, updateResource, createResource, seedData };

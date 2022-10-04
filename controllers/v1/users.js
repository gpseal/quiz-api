import bcryptjs from 'bcryptjs';
import prisma from '../../utils/prisma.js';
import { checkCredentials } from '../../utils/validation.js';
import { seedUsers, getResource, getResources, deleteResource, updateResource } from './base.js';
import { catchReturn, notAuthorized, getUserInfo } from '../../utils/misc.js';

const tableName = 'users';
// prettier-ignore
const usersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/basic-users.json";
// prettier-ignore
const adminUsersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/admin-users.json";

const table = prisma.user;

const getUsers = async (req, res) => {
  try {
    const { id: userID } = req.user;
    // getting user record
    const user = await getUserInfo(userID);
    if (user.role === 'BASIC_USER') return notAuthorized(res);

    let users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(200).json({
        msg: 'No users found',
      });
    }

    if (user.role === 'ADMIN_USER') {
      users = await prisma.user.findMany({
        where: {
          role: {
            not: 'SUPER_ADMIN_USER',
          },
        },
      });
    }

    return res.json({
      data: users,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

const getUser = async (req, res) => {
  try {
    const { id: recordID } = req.params;
    const { id: userID } = req.user;

    // getting user record
    const user = await getUserInfo(userID);

    // getting record to view
    const record = await getUserInfo(recordID);

    if (!record) {
      return res.status(200).json({
        msg: `No user with the id: ${recordID} found`,
      });
    }

    //  Authorization for users
    //  prevents admin user from viewing super admin user profiles
    if (record.role === 'SUPER_ADMIN_USER' && user.role === 'ADMIN_USER') {
      return notAuthorized(res);
    }

    //  prevents basic users from viewing other user profiles
    if (user.role === 'BASIC_USER' && user.id !== record.id) {
      return notAuthorized(res);
    }

    return res.json({
      data: record,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: recordID } = req.params;
    const { id: userID } = req.user;

    //  check for valid inputs for updating user
    if (checkCredentials(req.body)) {
      return res.status(400).json({
        msg: checkCredentials(req.body),
      });
    }

    if (req.body.password) {
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    // getting user record
    const user = await getUserInfo(userID);

    // getting record to view
    let record = await getUserInfo(recordID);

    if (!record) {
      return res.status(200).json({
        msg: `No user with the id: ${recordID} found`,
      });
    }

    /* prevents admin user from editing another admin user
    restricts basic user to editing only their own profile
    prevents super admin users from editing other super admin users  */
    if (
      ((record.role === 'ADMIN_USER' && user.role === 'ADMIN_USER') ||
        user.role === 'BASIC_USER' ||
        (record.role === 'SUPER_ADMIN_USER' && user.role === 'SUPER_ADMIN_USER')) &&
      user.id !== record.id
    ) {
      return notAuthorized(res);
    }

    //  prevents admin user from editing Super Admin user
    if (user.role === 'ADMIN_USER' && record.role === 'SUPER_ADMIN_USER') {
      return notAuthorized(res);
    }

    record = await prisma.user.update({
      where: {
        id: Number(recordID),
      },
      data: req.body, // replaces existing data with new payload data
    });

    delete record.password;

    return res.json({
      msg: `User ${user.username} successfully updated`,
      data: record, // displays new record data
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const { id: recordID } = req.params;
    const { id: userID } = req.user;

    // getting user record
    const user = await getUserInfo(userID);

    // getting record to view
    const record = await getUserInfo(recordID);

    if (!record) {
      return res.status(200).json({
        msg: `No user with the id ${recordID} found`,
      });
    }

    //  prevents super admin users deleting super admin accounts
    if (record.role === 'SUPER_ADMIN_USER' && user.role === 'SUPER_ADMIN_USER') {
      return notAuthorized(res);
    }

    deleteResource(req, res, prisma.user, 'User', 'SUPER_ADMIN_USER');
  } catch (err) {
    return catchReturn(res, err);
  }
};

//  Seeding users
const seedBasicUsers = (req, res) => {
  seedUsers(req, res, usersURL, 'SUPER_ADMIN_USER', 'ADMIN_USER');
};

const seedAdminUsers = (req, res) => {
  seedUsers(req, res, adminUsersURL, 'SUPER_ADMIN_USER');
};

export { seedBasicUsers, seedAdminUsers, getUser, updateUser, deleteUsers, getUsers };

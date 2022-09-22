/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { checkCredentials } from '../../utils/validation.js';
import { seedUsers } from './base.js';
import authCheck from '../../utils/authorization.js';

const catchReturn = (res, err) => {
  res.status(500).json({
    msg: err.message,
  });
};

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    // prettier-ignore
    const { first_name,
      last_name,
      email,
      username,
      password,
      role,
      confirmPassword } = req.body;

    // if (role === "ADMIN_USER" || role === "SUPER_ADMIN_USER") {
    //   return res.status(403).json({
    //     msg: 'You are not authorized to perform this action',
    //   });
    // }

    //  checking that inputs are all correct
    if (checkCredentials(req.body)) {
      return res.status(400).json({
        msg: checkCredentials(req.body),
      });
    }

    // console.log(first_name);
    // Check for unique email and username
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    // Testing which item was not unique
    if (user) {
      if (username === user.username) {
        return res.status(409).json({
          msg: 'Username already exists',
        });
      }
      return res.status(409).json({
        msg: 'email already exists',
      });
    }

    const picture = `https://avatars.dicebear.com/api/avataaars/${username}.svg`;

    /**
     * A salt is random bits added to a password before it is hashed. Salts
     * create unique passwords even if two users have the same passwords
     */
    const salt = await bcryptjs.genSalt();

    /**
     * Generate a hash for a given string. The first argument
     * is a string to be hashed, i.e., Pazzw0rd123 and the second
     * argument is a salt, i.e., E1F53135E559C253
     */
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        username,
        password: hashedPassword,
        picture,
        role,
      },
    });

    /**
     * Delete the password property from the user object. It
     * is a less expensive operation than querying the User
     * table to get only user's email and name
     */
    delete user.password;

    return res.status(201).json({
      msg: 'User successfully registered',
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        msg: 'Invalid email',
      });
    }
    /**
     * Compare the given string, i.e., Pazzw0rd123, with the given
     * hash, i.e., user's hashed password
     */
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: 'Invalid password',
      });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    /**
     * Return a JWT. The first argument is the payload, i.e., an object containing
     * the authenticated user's id and name, the second argument is the secret
     * or public/private key, and the third argument is the lifetime of the JWT
     */
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_LIFETIME,
      },
    );

    console.log('token', token);

    return res.status(200).json({
      msg: `${user.username} successfully logged in`,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

// // prettier-ignore
// const usersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/basic-users.json";
// // prettier-ignore
// const adminUsersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/admin-users.json";

// // deleteResource(req, res, prisma.quiz, tableName, authCheck, 'SUPER_ADMIN_USER');
// //  Seeding users
// const seedBasicUsers = (req, res) => {
//   seedUsers(req, res, usersURL, 'SUPER_ADMIN_USER', 'ADMIN_USER');
// };

// const seedAdminUsers = (req, res) => {
//   seedUsers(req, res, adminUsersURL, 'SUPER_ADMIN_USER');
// };

export { register, login };

/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { checkCrudentials } from '../../utils/validation.js';
// import {
//   seedData,
// } from './base.js';

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

    if (checkCrudentials(req.body)) {
      return res.status(400).json({
        msg: checkCrudentials(req.body),
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
    console.log('user here');

    // const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
    // const emailFormat = /^([A-Za-z0-9_.-]+)@([\da-zA-Z.-]+)\.([a-z.]{2,5})$/;
    // const alphaOnly = /^[A-Za-z]+$/;
    // const alphaNumeric = /^[0-9a-zA-Z]+$/;

    // // Checking correct lengths of inputs
    // if (lengthChecks('first name', first_name, 2, 50, res)) return;
    // if (checkCharacterType('first name', first_name, alphaOnly, 'alpha characters only', res)) {
    //   return;
    // }

    // if (lengthChecks('last name', last_name, 2, 50, res)) return;
    // if (checkCharacterType('last name', first_name, alphaOnly, 'alpha characters only', res)) {
    //   return;
    // }

    // if (
    //   checkCharacterType(
    //     'email',
    //     email,
    //     emailFormat,
    //     'an @ special character & a second-level domain',
    //     res,
    //   )
    // ) {
    //   return;
    // }

    // if (lengthChecks('username', username, 5, 10, res)) return;
    // if (
    //   checkCharacterType(
    //     'username',
    //     username,
    //     alphaNumeric,
    //     'alphanumeric characters only',
    //     res,
    //   )
    // ) {
    //   return;
    // }

    // if (lengthChecks('password', password, 5, 12, res)) return;
    // if (
    //   checkCharacterType(
    //     'password',
    //     password,
    //     passwordFormat,
    //     '1 numeric character & 1 special character',
    //     res,
    //   )
    // ) {
    //   return;
    // }

    // if (confirmPassword !== password) {
    //   return res.status(400).json({
    //     msg: 'passwords do not match',
    //   });
    // }

    // if (username !== email.split('@')[0]) {
    //   return res.status(400).json({
    //     msg: 'email prefix must match username ',
    //   });
    // }

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

// prettier-ignore
const usersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/basic-users.json";
// prettier-ignore
const adminUsersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/admin-users.json";

//  Seeding users
const seedUsers = async (req, res) => {
  try {
    const response = await axios.get(adminUsersURL);
    const { data } = response; // assigning api data

    for (let i = 0; i < data.length; i++) {
      // if (checkCrudentials(data[i], res)) return;
      if (checkCrudentials(data[i])) {
        return res.status(400).json({
          msg: checkCrudentials(data[i]),
        });
      }
      // eslint-disable-next-line no-await-in-loop
      const salt = await bcryptjs.genSalt();
      // eslint-disable-next-line no-await-in-loop
      data[i].password = await bcryptjs.hash(data[i].password, salt);
      delete data[i].confirmPassword;
    }

    console.log('data', data);

    await prisma.user.createMany({
      data,
    });

    data.forEach((user) => {
      delete user.password;
      delete user.confirmPassword;
    });

    return res.status(200).json({
      msg: 'Users successfully added',
      data,
    });
  } catch (err) {
    return catchReturn(res, err);
  }
};

export { register, login, seedUsers };

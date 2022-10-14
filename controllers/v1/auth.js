/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For handling registration and login functions
 *
 * register: Checks credentials, Registers new users and stores data
 * login: Compares login details to registered users, if valid,
 * creates JWT for authentication, returns token for use in future requests
 * logout: Logs out user, stores existing JWT token within database and eliminates
 * it from future use.  Deletes stored tokens that are older than one hour
 */

/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { checkInputs } from '../../utils/validation.js';

const prisma = new PrismaClient();

/**
 * This function registers a new user once all checks have been passed
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 400, 409, 201
 * @returns JSON error message if status = 500
 */
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

    //  checking that inputs are all structures accordingly
    if (checkInputs(req.body)) {
      return res.status(400).json({
        msg: checkInputs(req.body),
      });
    }

    // Check for already existing email and username
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

    // If user exists, testing which item was not unique and returning appropriate message
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

    // setting image of user with username as differentiator
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

    //  storing user credentials in the prisma database
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

    //  Returns message if user has been successfully stored, displays user data
    return res.status(201).json({
      msg: 'User successfully registered',
      data: user,
    });
    //  returns error if there was an error registering user
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

/**
 * This function logs in a user by comparing posted user credentials
 * with existing user profiles already stored in the database.
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 200, 401
 * @returns JSON error message if status = 500
 */
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    //  checking for matching username or email from request body
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    //  return appropriate error if there is no matching record
    if (!user) {
      if (email) {
        return res.status(401).json({
          msg: 'Invalid email',
        });
      }
      return res.status(401).json({
        msg: 'Invalid username',
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
        userName: user.username,
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

/**
 * This function logs out a user by checking for a valid token in the request
 * and storing it in the database, making it unusable in future requests.
 * In addition, the function will check the database for existing tokens older
 * than one hour and delete accordingly (as the token will be expired).
 * @param {Request} req
 * @param {Response} res
 * @returns JSON message if status = 201
 * @returns JSON message if status = 403
 * @returns JSON error message if status = 500
 */
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({
        msg: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    //  adds token to database so that it can no longer be used
    await prisma.token.create({
      data: {
        token,
      },
    });

    /* setting expire time variable to check if old tokens are to be
    deleted from database, as after one hour they become void and there
    is no need for them to remain in the database */
    const expTime = new Date();
    expTime.setTime(expTime.getTime() - 1 * 60 * 60 * 1000);

    // removing saved tokens that are older than expire time (1 hr)
    await prisma.token.deleteMany({
      where: {
        createdAt: {
          lt: expTime,
        },
      },
    });

    //  getting user info
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return res.status(200).json({
      msg: `${user.username} successfully logged out`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { register, login, logout };

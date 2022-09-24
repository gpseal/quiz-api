/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { checkCredentials } from '../../utils/validation.js';
import { seedUsers } from './base.js';
import authCheck from '../../utils/authorization.js';
import { catchReturn, notAuthorized, getUserInfo } from '../../utils/misc.js';

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

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('res.cookie', res.cookie);
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

    const expTime = new Date();
    expTime.setTime(expTime.getTime() - 1 * 60 * 60 * 1000);

    // removing saved tokens that are older than one hr
    await prisma.token.deleteMany({
      where: {
        createdAt: {
          lt: expTime,
        },
      },
    });

    return res.status(200).json({
      msg: `successfully logged out`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: 'invalid token',
      // msg: err,
    });
  }
};

export { register, login, logout };

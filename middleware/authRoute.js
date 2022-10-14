/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For authenticating user requests and adding authenticated user details to request
 *
 * authRoute: authenticates users using JWT, adds user details to req.user
 */

import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

/**
 * This checks JWT attached to request, verifies user and adds user details to request
 * In addition, checks database for attached token an does not allow its use if it is stored there
 * @param {Request} req
 * @param {Response} res
 * @param {Any} next
 * @returns JSON message if status = 403, 498
 * @returns JSON error message if status = 500
 */
const authRoute = async (req, res, next) => {
  try {
    /**
     * The authorization request header provides information that authenticates
     * a user agent with a server, allowing access to a protected resource. The
     * information will be a bearer token, and a user agent is a middle man between
     * you and the server. An example of a user agent is Postman or a web browser
     * like Google Chrome
     */
    const authHeader = req.headers.authorization;
    /**
     * A bearer token will look something like this - Bearer <JWT>. A
     * response containing a 403 forbidden status code and message
     * is returned if a bearer token is not provided
     */
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({
        msg: 'No token provided',
      });
    }

    /**
     * Get the JWT from the bearer token
     */
    const token = authHeader.split(' ')[1];

    //  Checks to see if token exists in database
    const checkToken = await prisma.token.findFirst({
      where: {
        token,
      },
    });

    //  If token exists in the database, it must have been added after a user logged out,
    //  thus making it invalid
    if (checkToken) {
      return res.status(498).json({
        msg: 'Invalid Token',
      });
    }

    /**
     * Verify the signed JWT is valid. The first argument is the token,
     * i.e., JWT and the second argument is the secret or public/private key
     */
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    /**
     * Set Request's user property to the authenticated user
     */

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(403).json({
      msg: 'Not authorized to access this route',
    });
  }
};

export default authRoute;

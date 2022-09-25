import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

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

    /**
     * Verify the signed JWT is valid. The first argument is the token,
     * i.e., JWT and the second argument is the secret or public/private key
     */
    console.log('before verify');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('after verify');
    /**
     * Set Request's user property to the authenticated user
     */
    req.user = payload;
    // console.log('payload', payload);

    //  Checks to see if token exists in database
    const checkToken = await prisma.token.findFirst({
      where: {
        token,
      }, // finds record using ID from URL params
    });

    //  If token exists, does not allow its use, asks user to log in
    if (checkToken) {
      return res.status(403).json({
        msg: 'Invalid Token',
      });
    }

    return next();
  } catch (error) {
    return res.status(403).json({
      msg: 'Not authorized to access this route ',
    });
  }
};

export default authRoute;

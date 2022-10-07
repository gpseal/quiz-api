import dotenv from 'dotenv';
import express, { urlencoded, json, Router } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import listEndpoints from 'express-list-endpoints';
/**
 * You will create the routes for institutions and departments later
 */
import compression from 'compression';
import cacheRoute from './middleware/cacheRoute.js';
import categories from './routes/v1/categories.js';
import quizzes from './routes/v1/quizzes.js';
import questions from './routes/v1/questions.js';
import ratings from './routes/v1/ratings.js';
import scores from './routes/v1/scores.js';
import users from './routes/v1/users.js';
import auth from './routes/v1/auth.js';
import authRoute from './middleware/authRoute.js';

dotenv.config();

const app = express();

const BASE_URL = 'api';

/**
 * The current version of this API is 1
 */
const CURRENT_VERSION = 'v1';
const { PORT } = process.env;
const limit = rateLimit({
  //  settings for limiting traffic
  windowMs: 1 * 60 * 1000, //  1 min
  max: 25, //  25 requests every 1 min
});

app.use(helmet());
app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(json());
app.use(compression());
app.use(cacheRoute);
// app.use(limit); //  applies rate-limit to all requests

const getEndPoints = (req, res) => {
  const endPoints = listEndpoints(app);
  res.status(200).send({
    endPoints,
  });
};

app.get(`/${BASE_URL}/${CURRENT_VERSION}/`, getEndPoints);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/auth`, auth);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/categories`, authRoute, categories);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/quizzes`, authRoute, quizzes);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/questions`, authRoute, questions);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/ratings`, authRoute, ratings);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/scores`, authRoute, scores);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/users`, authRoute, users);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;

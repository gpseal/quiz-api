import dotenv from "dotenv";
import express, { urlencoded, json } from "express";
import helmet from "helmet";
/**
 * You will create the routes for institutions and departments later
 */
import categories from "./routes/v1/categories.js";
import quizzes from "./routes/v1/quizzes.js";
// import questions from "./routes/v1/questions.js";

dotenv.config();

const app = express();

const BASE_URL = "api";

/**
 * The current version of this API is 1
 */
const CURRENT_VERSION = "v1";

const PORT = process.env.PORT;

app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(`/${BASE_URL}/${CURRENT_VERSION}/categories`, categories);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/quizzes`, quizzes);
// app.use(`/${BASE_URL}/${CURRENT_VERSION}/questions`, questions);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
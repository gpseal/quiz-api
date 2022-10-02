// import axios from 'axios';
// import prisma from '../../utils/prisma.js';

// import { catchReturn } from './base.js';

// const takeQuiz = async (req, res) => {
//   try {
//     let score = 0;
//     const { answers } = req.body; // gets answers from user post
//     const { id } = req.params; // defines record to be displayed from URL params

//     if (answers.length !== 10) {
//       return res.status(200).json({
//         msg: `You must answer all ten questions to submit`,
//       });
//     }
//     // getting questions answers to compare with user post
//     const questions = await prisma.quiz.findUnique({
//       where: {
//         id: Number(id),
//       },
//       include: {
//         questions: true,
//       },
//       // finds record using ID from URL params
//     });

//     // checks that record exists
//     if (!questions) {
//       return res.status(200).json({
//         msg: `No quiz with the id: ${id} found`,
//       });
//     }

//     //  Finding user details
//     const { id: userID } = req.user;
//     const userDetails = await prisma.user.findUnique({
//       where: {
//         id: Number(userID),
//       },
//       // finds record using ID from URL params
//     });

//     answers.forEach((answer, index) => {
//       if (answer === questions.questions[0].questions[index].correct_answer) {
//         score += 1;
//       }
//     });

//     console.log('id', id);
//     console.log('userID', userID);

//     // creating score rating table
//     await prisma.score.create({
//       data: {
//         quizID: Number(id),
//         userId: userID,
//         score,
//       },
//     });

//     const scores = await prisma.score.findMany({
//       where: {
//         quizID: Number(id),
//       },
//       // finds record using ID from URL params
//     });

//     // calculate average score of quiz
//     let sum = 0;

//     scores.forEach((quizScore) => {
//       console.log('quizScore.score', quizScore.score);
//       sum += quizScore.score;
//       console.log('sum', sum);
//     });

//     const avg = (sum / scores.length).toFixed(2);

//     console.log('avg', avg);

//     return res.status(200).json({
//       msg: `${userDetails.username} has successfully participated in ${questions.name}`,
//       Score: score,
//       Quiz_Average: avg,
//     }); // displays record
//   } catch (err) {
//     return catchReturn(res, err);
//   }
// };

// const test = 'test';

// export { takeQuiz, test };

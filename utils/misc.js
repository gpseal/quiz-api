import prisma from './prisma.js';

const catchReturn = (res, err) => {
  res.status(500).json({
    msg: err.message,
  });
};

const notAuthorized = (res) => {
  res.status(403).json({
    msg: 'You are not authorized to perform this action',
  });
};

//  collects current user info from database
const getUserInfo = async (userID) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userID),
    },
  });
  return user;
};

const dateFormat = (days) => {
  const date = new Date();
  const newDate = new Date();
  newDate.setDate(date.getDate() + days);
  const returnDate = newDate.toISOString().split('T')[0];
  return returnDate;
};

export { catchReturn, notAuthorized, getUserInfo, dateFormat };

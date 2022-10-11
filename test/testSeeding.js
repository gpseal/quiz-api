import axios from 'axios';
import bcryptjs from 'bcryptjs';
import prisma from '../utils/prisma.js';

const seedUsers = async (URL) => {
  try {
    const baseURL =
      'https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb';
    //  collection data from specified URL
    const response = await axios.get(baseURL + URL);
    const { data: userData } = response; // assigning api data

    //  checking role of users to be seeded
    let { role } = userData[0];
    //  if no role specified, default to BASIC_USER
    if (!role) {
      role = 'BASIC_USER';
    }

    await prisma.user.deleteMany({
      where: {
        role,
      },
    });

    //  salting passwords of data to be inserted
    const data = await Promise.all(
      userData.map(async (userEntry) => {
        const salt = await bcryptjs.genSalt();
        userEntry.password = await bcryptjs.hash(userEntry.password, salt);
        delete userEntry.confirmPassword;
        return {
          ...userEntry,
        };
      }),
    );

    //  Inserting data into database
    await prisma.user.createMany({
      data,
    });
  } catch (err) {
    return console.log(err);
  }
};

export default seedUsers;

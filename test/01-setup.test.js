import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { before, after } from 'mocha';
import { seedCategories } from '../controllers/v1/categories.js';
import main from '../prisma/seed.js';
import seedUsers from './testSeeding.js';

const prisma = new PrismaClient();

const seed = async () => {
  await seedUsers('/basic-users.json');
  await seedUsers('/admin-users.json');
};

const deleteData = async () => {
  await prisma.user.delete({
    where: {
      email: 'simmos@email.com',
    },
  });

  await prisma.user.deleteMany({
    // empty
  });
};

// Before each test, seed the Category tables with data fetched from a GitHub Gist
before((done) => {
  console.log('seeding');
  seed();
  // seedUsers('/basic-users.json');
  done();
});

// After each test, do something
after((done) => {
  console.log('done');
  deleteData();
  done();
});

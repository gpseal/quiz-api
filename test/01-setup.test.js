import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { before, after } from 'mocha';
import { seedCategories } from '../controllers/v1/categories.js';
import main from '../prisma/seed.js';
import { seedBasicUsers, seedAdminUsers } from '../controllers/v1/users.js';

const prisma = new PrismaClient();

const seed = () => {
  seedCategories();
  main(); // seeding super admin
  seedAdminUsers();
  seedBasicUsers();
};

const deleteData = async () => {
  await prisma.user.deleteMany({
    // empty
  });
  await prisma.user.delete({
    where: {
      email: 'simmo@email.com',
    },
  });
};

// Before each test, seed the Category tables with data fetched from a GitHub Gist
before((done) => {
  console.log('seeding');
  seed();
  done();
});

// After each test, do something
await after(async () => {
  console.log('done');
  await deleteData();
  //   done();
});

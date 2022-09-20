import { seedUsers } from './base.js';

// prettier-ignore
const usersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/basic-users.json";
// prettier-ignore
const adminUsersURL = "https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb/admin-users.json";

// deleteResource(req, res, prisma.quiz, tableName, authCheck, 'SUPER_ADMIN_USER');
//  Seeding users
const seedBasicUsers = (req, res) => {
  // console.log('req', req);
  seedUsers(req, res, usersURL, 'SUPER_ADMIN_USER', 'ADMIN_USER');
};

const seedAdminUsers = (req, res) => {
  console.log('req', req);
  seedUsers(req, res, adminUsersURL, 'SUPER_ADMIN_USER');
};

export { seedBasicUsers, seedAdminUsers };

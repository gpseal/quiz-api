import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  //  removing existing super admin accounts
  await prisma.user.deleteMany({
    where: {
      role: 'SUPER_ADMIN_USER',
    },
  });
  //  creating hashed password
  let salt = await bcryptjs.genSalt();
  const johnPass = 'p@ss0rd45';
  const johnHashed = await bcryptjs.hash(johnPass, salt);

  //  inserting data, updating if it exists, creating if not
  const john = await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'Wayne',
      email: 'jWayne@mail.com',
      username: 'jWayne',
      password: johnHashed,
      picture: 'https://avatars.dicebear.com/api/avataaars/jWayne.svg',
      role: 'SUPER_ADMIN_USER',
    },
  });

  salt = await bcryptjs.genSalt();
  const samPass = 'p@ss0rd46';
  const samHashed = await bcryptjs.hash(samPass, salt);

  const samantha = await prisma.user.create({
    data: {
      first_name: 'Samantha',
      last_name: 'Hawk',
      email: 'hawker@mail.com',
      username: 'hawker',
      password: samHashed,
      picture: 'https://avatars.dicebear.com/api/avataaars/hawker.svg',
      role: 'SUPER_ADMIN_USER',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default main;

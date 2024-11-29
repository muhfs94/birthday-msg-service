import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@me.com',
      birthday: new Date('2000-11-29'),
      location: 'America/New_York',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@me.com',
      birthday: new Date('2000-11-29'),
      location: 'Europe/London',
    },
    {
      firstName: 'Ali',
      lastName: 'Khan',
      email: 'ali.khan@me.com',
      birthday: new Date('2000-11-29'),
      location: 'Asia/Jakarta',
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log('Users seeded successfully!');
  await prisma.$disconnect();
}

seedUsers().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

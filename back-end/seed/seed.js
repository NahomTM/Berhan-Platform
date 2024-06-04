const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const { hashPassword } = require('../utils/passwordUtils'); // Importing the hash function

const seedAdminUser = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {

      const hashedPassword = await hashPassword('securepassword');

      const adminUser = await prisma.user.create({
        data: {
          firstName: 'Admin',
          middleName: 'A',
          lastName: 'User',
          gender: 'Other',
          dateOfBirth: new Date('1990-01-01'),
          role: 'admin',
          phoneNumber: '1234567890',
          email: 'admin@example.com',
          password: hashedPassword,
          username: 'admin_user',
          address: '123 Admin Street',
          profilePic: 'uploads/defaultProfilePage.svg',
        },
      });

      console.log('Admin user created:', adminUser);
    } else {
      console.log('Admin user already exists:', existingAdmin);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = seedAdminUser;

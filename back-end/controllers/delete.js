const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteUserById = async () => {
  try {

    const userId = 21
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return;
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    console.log(`User with ID ${userId} deleted successfully.`);

  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation
  }
};

// Delete user with ID 4
module.exports = deleteUserById

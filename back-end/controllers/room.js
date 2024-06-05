const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRoomsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Assume req.id is set by the middleware
    
    // Step 1: Get all classes where userId matches req.id
    const classes = await prisma.class.findMany({
      where: {
        userId: userId
      }
    });

    // If no classes found, return 404
    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for this user.' });
    }

    // Step 2: Get all rooms for the retrieved classes
    const classIds = classes.map(cls => cls.id);
    const rooms = await prisma.room.findMany({
      where: {
        classId: {
          in: classIds
        }
      },
      include: {
        user: true,
        class: true
      }
    });

    // Return the rooms
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getRoomsByUserId };

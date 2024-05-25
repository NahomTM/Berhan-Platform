
const {verifyAccessToken} = require('../utils/authUtils')
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// Verify token endpoint
const verifyToken = async (req, res) => {
  const { token } = req.body;
  const result = verifyAccessToken(token);
  if (result.valid) {
    res.json({ valid: true, decoded: result.decoded });
  } else {
    res.status(401).json({ valid: false, error: result.error.message });
  }
};

// Get user by ID
const getId =  async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Update user information
const updateTemp = async (req, res) => {
  const { username, password, passChanged } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { username, password, passChanged },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

module.exports = {updateTemp, getId, verifyToken};

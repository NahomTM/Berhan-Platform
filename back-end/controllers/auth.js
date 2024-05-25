const { verifyPassword } = require('../utils/passwordUtils');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const { createAccessToken, verifyAccessToken } = require('../utils/authUtils');
const signIn = async (req, res) => {
  const { email, password, role} = req.body;
  const normalizedRole = role.toLowerCase()

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.role !== normalizedRole) {
      return res.status(401).json({error: 'Invalid role'})
    }

    const accessToken = createAccessToken(user);

    res.json({
      message: 'Sign-in successful',
      user,
      accessToken,
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyRole = async (req, res) => {
    const token = req.body.token; // Get the token from the request body

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    const { valid, decoded, error } = verifyAccessToken(token);

    if (!valid) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    const role = decoded.role;

    return res.status(200).json({ role });
};

module.exports = { signIn, verifyRole };

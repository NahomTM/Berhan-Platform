const bcrypt = require('bcrypt'); 

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Hashing with a salt
  return hashedPassword;
};

const verifyPassword = async (plainTextPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword); // Compare the plaintext with the hash
  return isMatch;
};

module.exports = { hashPassword, verifyPassword };

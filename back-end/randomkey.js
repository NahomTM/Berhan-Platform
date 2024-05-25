const crypto = require('crypto');

const generate32ByteKey = () => {
  // Generate 32 random bytes
  const key = crypto.randomBytes(32).toString('hex'); // Convert to hexadecimal
  return key;
};

console.log(generate32ByteKey());

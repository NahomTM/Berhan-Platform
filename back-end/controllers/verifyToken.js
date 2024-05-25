const {verifyAccessToken} = require('../utils/authUtils')

const validateToken = async(req, res) => {
    const token = req.body.token; // Get the token from the request body

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    const { valid, decoded, error } = verifyAccessToken(token);

    if (!valid) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    const role = decoded.role;

    return res.status(200).json({ message: "success" });
}

module.exports = {validateToken}
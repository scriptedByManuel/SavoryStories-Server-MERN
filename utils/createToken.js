const jwt = require("jsonwebtoken")

const createToken = async (id) => {
    return await jwt.sign({id}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN }
)
}

module.exports = createToken
const jwt = require('jsonwebtoken')

const authenticate = async(req, res, next) => {
    console.log("head", req.headers.authorization)
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1] || "";
        console.log("token", token)

    }


    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.verifiedUser = verified.user;
        console.log("verification success")
        next()

    } catch (err) {
        console.log("verification failed")
        next()
    }
}

module.exports = { authenticate }
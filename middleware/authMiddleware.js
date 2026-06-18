const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to protect routes
const protect = async ( req, res, next) => {
    let token;

    try {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            // spliting the token from the "Bearer" string
            token = req.headers.authorization.split(" ")[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

           // getting user from the token and attaching it to the request object
            req.user = await User.findById(decoded.id).select("-password");
           // edge case if user is not found
            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found"
                });
            }
            // using return since we don't want to execute the next line of code if the token is valid and user is found
            return next(); 
        }
        // edge case if token is not found  
        if(!token) {
              return res.status(401).json({
              success: false,
              message: "Not authorized, no token"
             });
        }
    } catch(error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed"
        });
    }
};

module.exports = { protect };
// /middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../model/user');

const protect = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        // console.log( 'token is ' ,token);
        
        // console.log(token)
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decoded",decoded);

        const email= decoded.email
        
        const user = await User.findOne({email});
        // console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;  // Attach user to request object
        next();
    } catch (err) {
        console.error(err);  // Log error for debugging
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports =  protect










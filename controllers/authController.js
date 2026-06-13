const User = require("../models/userModel");
const bcrypt = reuire("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    //validation
    if( !username || !email || !password ) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required"
            });
    } 

    try {
        // check if user exists
        const existingUser = await User.findbyUser(username);
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // check if email already exists
        const existingEmail = await User.findByEmail(email);
        
        if(existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email 
            }
        });
        
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
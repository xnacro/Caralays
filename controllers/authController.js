const User = require("../models/userModel");
const bcrypt = require("bcrypt");
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

exports.login = async (req, res) => {

    let { identifiers, password } = req.body;

    // validation
    if( !identifiers || !password ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // find user by username or email
        const user = await User.findByIdentifiers(identifiers);

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // create token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
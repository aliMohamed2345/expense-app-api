import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateLogInCredentials, validateSignUpCredentials } from "../utils/validateUserCredentials.js";


export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        const { message, isValid } = validateLogInCredentials(email, password)
        if (!isValid) {
            return res.status(400).json({ success: isValid, message })
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,//for protecting against XSS attacks by not accessing the cookies via javascript
            secure: process.env.NODE_ENV === 'production', //Ensures that cookie only works in the https protocol
            sameSite: 'Strict',// Helps to prevent CSRF attacks by ensuring that the cookie is only sent in requests originating from the same site
            maxAge: 24 * 60 * 60 * 1000 //1 day in milliseconds
        });

        return res.status(200).json({ success: true, message: "Logged in successfully", user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }

}

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const { message, isValid } = validateSignUpCredentials(email, password, username)

        if (!isValid) {
            return res.status(400).json({ success: isValid, message })
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10), // Hash the password
            isAdmin: false // Default to false unless specified otherwise
        });
        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,//for protecting against XSS attacks by not accessing the cookies via javascript
            secure: process.env.NODE_ENV === 'production', //Ensures that cookie only works in the https protocol
            sameSite: 'Strict',// Helps to prevent CSRF attacks by ensuring that the cookie is only sent in requests originating from the same site
            maxAge: 24 * 60 * 60 * 1000 //1 day in milliseconds
        });

        return res.status(201).json({ success: true, message: "User created successfully", user: { id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }

}

export const getProfile = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const user = await User.findById(userId).select('-password  -__v'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, user })

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}



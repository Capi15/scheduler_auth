'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

// Handles user authentication (login) and token generation
exports.sessionsLogin = async (user) => {

    const { username, password } = user;

    try {
        // Check if both username and password are provided
        if (!username || !password) {
            return {
                status: 400,
                message: "Username and password are required"
            };
        }

        // Look for a user with the given username
        const userfind = await User.findOne({ username });

        // If the user is not found in the database
        if (!userfind) {
            return {
                status: 404,
                message: "User not found"
            };
        }

        // Compare the given password (with secret salt prepended) against the stored hash
        const salt = process.env.SECRET_SALT;
        const isMatch = await bcryptjs.compare(salt + password, userfind.password);

        // If passwords do not match, reject the login
        if (!isMatch) {
            return {
                status: 401,
                message: "Incorrect password"
            };
        }

        // Generate a JWT token containing user ID, username and role
        const token = jwt.sign(
            {
                id: userfind._id,
                username: userfind.username,
                role: userfind.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1d" } // Token valid for 1 day
        );

        // If user has the "external" role, they are authenticated but with no permissions
        if (userfind.role === process.env.ROLE_EXTERNAL) {
            return {
                status: 200,
                message: "User logged in successfully but has no permissions",
                token: "",
                user: {
                    id: userfind._id,
                    username: userfind.username,
                    email: userfind.email,
                    role: userfind.role,
                },
            };
        }

        // If login is successful and user has permissions
        return {
            status: 200,
            message: "User logged in successfully",
            token, // Include the JWT token
            user: {
                id: userfind._id,
                username: userfind.username,
                email: userfind.email,
                role: userfind.role,
            }
        };

    } catch (error) {
        // Handle and log unexpected errors
        console.error("Internal error:", error);
        return {
            status: 500,
            message: "An error occurred: " + error.message
        };
    }
};

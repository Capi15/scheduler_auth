'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

// Handles the logic for resetting a user's password using a reset token
exports.resetMyPassword = async ({ email, token, password }) => {
    try {
        // Look for the user by email
        const userExists = await User.findOne({ email });

        // If no user is found, return a 404 error
        if (!userExists) {
            return {
                status: 404,
                message: "User not found"
            };
        }

        // Check if the reset token has expired
        const compareDate = new Date(userExists.tokens.resetPassword.expiresAt);
        const today = new Date();
        if (compareDate < today) {
            return {
                status: 401,
                message: "Token expired"
            };
        }

        // Verify if the provided token matches the one stored
        if (userExists.tokens.resetPassword.token !== token) {
            return {
                status: 401,
                message: "Invalid token"
            };
        }

        // Generate a new hashed password with a secret salt
        const salt = process.env.SECRET_SALT;
        const passwordHash = await bcryptjs.hash(salt + password, 10);

        // Update the user's password
        userExists.password = passwordHash;
        await userExists.save(); // Persist changes in the database

        // Return success message
        return {
            status: 200,
            message: "Password updated successfully"
        };

    } catch (error) {
        // Catch unexpected errors
        console.error("Internal error:", error);
        return {
            status: 500,
            message: "An error occurred: " + error.message
        };
    }
};
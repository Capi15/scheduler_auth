'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

// Handles password change for an authenticated user
exports.usersChangepwd = async (user) => {
    const { token, oldPassword, newPassword } = user;

    try {
        // Ensure all required fields are provided
        if (!oldPassword || !newPassword || !token) {
            return ({ status: 400, message: "token, oldPassword and newPassword are required" });
        }

        // Check if the new password meets minimum length requirement
        if (newPassword < process.env.MINIMUM_PASSWORD_REQUIREMENT) {
            return ({ 
                status: 400, 
                message: "Password must be at least " + process.env.MINIMUM_PASSWORD_REQUIREMENT + " characters" 
            });
        }

        // Decode the JWT token to extract the user ID
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const _id = decoded.id;

        // Fetch the user from the database by ID
        const userExists = await User.findOne({ _id });
        if (!userExists) {
            return ({ status: 404, message: "User not found" });
        }

        // Check if the old password matches the stored hash
        const salt = process.env.SECRET_SALT;
        const passwordMatch = await bcryptjs.compare(salt + oldPassword, userExists.password);
        if (!passwordMatch) {
            return ({ status: 401, message: "Invalid password" });
        }

        // Hash the new password and update it
        const passwordHash = await bcryptjs.hash(salt + newPassword, 10);
        userExists.password = passwordHash;
        await userExists.save(); // Persist the new password

        // Return success response
        return {
            status: 200,
            message: "Password updated successfully"
        };

    } catch (err) {
        console.log(err);
        return ({ status: 500, message: "Something went wrong" });
    }
};
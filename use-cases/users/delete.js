'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

exports.usersDelete = async (user) => {
    const { token, username, password } = user;

    try {
        // Ensure all required fields are provided
        if (!username || !password || !token) {
            return ({ status: 400, message: "token, username and password are required" });
        }

        // Verify the token's authenticity
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Check if the user to delete exists
        const userCheck = await User.findOne({ username });
        if (!userCheck) {
            return ({ status: 404, message: "User not found" });
        }

        // Compare provided password with the stored one (with salt)
        const salt = process.env.SECRET_SALT;
        const passwordMatch = await bcryptjs.compare(salt + password, userCheck.password);

        // If the password doesn't match
        if (!passwordMatch) {
            // Only allow admins to delete without password match
            if (decoded.role !== process.env.ROLE_ADMIN) {
                return ({ status: 403, message: "Access denied. Admins only." });
            }

            // Admin is allowed to force delete
            const user = await User.findOne({ username: username });
            if (!user) {
                return ({ status: 404, message: "User not found" });
            }

            // Soft delete the user by marking as inactive
            await User.updateOne({ _id: user._id }, { active: false });
            return ({ status: 200, message: "User deleted" });
        }

        // Password matches, allow deletion
        await User.updateOne({ _id: userCheck._id }, { active: false });
        return ({ status: 200, message: "User deleted" });

    } catch (err) {
        // Catch and log unexpected errors
        console.log(err);
        return ({ status: 500, message: "Something went wrong" });
    }
}
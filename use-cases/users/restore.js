'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

exports.usersRestore = async (user) => {
    const { token, username, password } = user;
    try {
        // Ensure required fields are present
        if (!username || !password || !token) {
            return ({ status: 400, message: "token, username and password are required" });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Find the user by username
        const userCheck = await User.findOne({ username });
        if (!userCheck) {
            return ({ status: 404, message: "User not found" });
        }

        // Check if the provided password matches the stored one
        const salt = process.env.SECRET_SALT;
        const passwordMatch = await bcryptjs.compare(salt + password, userCheck.password);

        if (!passwordMatch) {
            // If password is incorrect and user is not an admin, deny access
            if (decoded.role !== process.env.ROLE_ADMIN) {
                return ({ status: 403, message: "Access denied. Admins only." });
            }

            // Admin override: restore user by username
            const user = await User.findOne({ username: username });
            if (!user) {
                return ({ status: 404, message: "User not found" });
            }

            await User.updateOne({ _id: user._id }, { active: true });
            return ({ status: 200, message: "User restored" });
        }

        // If password matches, restore user directly
        await User.updateOne({ _id: userCheck._id }, { active: true });
        return ({ status: 200, message: "User restored" });

    } catch (err) {
        // Log unexpected errors and return generic server error
        console.log(err);
        return ({ status: 500, message: "Something went wrong" });
    }
};

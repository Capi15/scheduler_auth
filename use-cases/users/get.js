'use strict'
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.usersGet = async ({ token, page, limit, search, role }) => {
    try {
        // Ensure the token is provided
        if (!token) {
            return ({ status: 400, message: "token is required" });
        }

        // Verify the token; reject access if invalid
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return ({ status: 403, message: "Access denied" });
        }

        // Build MongoDB query based on filters
        const query = {};

        // Optional search filter: match name or email (case-insensitive)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Optional role filter (transformed to lowercase for consistency)
        if (role) {
            query.role = role.toLowerCase();
        }

        query.active = true;

        // Calculate how many documents to skip based on pagination
        const skip = (page - 1) * limit;

        // Run queries in parallel: fetch paginated results and total count
        const [users, total] = await Promise.all([
            User.find(query).skip(skip).limit(limit),
            User.countDocuments(query)
        ]);

        if (!users) {
            return ({ status: 404, message: "Users not found" });
        }

        // Return paginated users along with metadata
        return {
            status: 200,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            users
        };
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.usersGetByUsername = async (user) => {
    const { token, username } = user;
    try {
        // Validate required fields
        if (!token || !username) {
            return ({ status: 400, message: "token and username are required" });
        }

        // Validate token authenticity
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return ({ status: 403, message: "Access denied" });
        }

        // Find the user by username
        const user = await User.findOne({ username, active: true });

        if (!user) {
            return ({ status: 404, message: "User not found" });
        }

        // Return user if found
        return ({ status: 200, user });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
}
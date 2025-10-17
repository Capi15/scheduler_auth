'use strict'
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


// Assign a role to a user using the role's ID
exports.assign = async (requestedRole) => {
    const { token, username, role_id } = requestedRole;

    try {
        // Validate required fields
        if (!token || !username || !role_id) {
            return ({ status: 400, message: "username, role_id and token are required" });
        }

        // Verify token and check if user is admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });
        }

        // Validate role ID format
        const _id = role_id;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return ({ status: 400, message: "id is not a valid ObjectId" });
        }

        // Look up role by ID
        const role = await Role.findOne({ _id });
        if (!role) {
            return ({ status: 404, message: "Role not found" });
        }

        // Find user by username
        const user = await mongoose.model("User").findOne({ username });
        if (!user) {
            return ({ status: 404, message: "User not found" });
        }

        // Assign role name to user and save
        user.role = role.name;
        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return ({ status: 500, message: "Role could not be assigned" });
        }

        // Return success
        return ({ status: 200, message: "Role assigned successfully", user });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};

// Assign a role to a user using the role's name
exports.assignByName = async (requestedRole) => {
    const { token, username, role_name } = requestedRole;

    try {
        // Validate required fields
        if (!token || !username || !role_name) {
            return ({ status: 400, message: "username, role_name and token are required" });
        }

        // Verify token and check if user is admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });
        }

        // Look up role by name
        const name = role_name;
        const role = await Role.findOne({ name });
        if (!role) {
            return ({ status: 404, message: "Role not found" });
        }

        // Find user by username
        const user = await mongoose.model("User").findOne({ username });
        if (!user) {
            return ({ status: 404, message: "User not found" });
        }

        // Assign role name to user and save
        user.role = role.name;
        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return ({ status: 500, message: "Role could not be assigned" });
        }

        // Return success
        return ({ status: 200, message: "Role assigned successfully", user });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};
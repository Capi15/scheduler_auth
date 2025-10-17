'use strict'
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


// Retrieves a specific role by its MongoDB ObjectId (admin-only)
exports.getById = async (role) => {
    const { token, id } = role;

    try {
        // Check for required fields
        if (!token || !id) {
            return ({ status: 400, message: "token and id are required" });
        }

        const _id = id;

        // Validate the MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return ({ status: 400, message: "id is not a valid ObjectId" });
        }

        // Decode token and check if the requester is an admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });
        }

        // Find the role by ID
        const role = await Role.findById(_id);

        if (!role) {
            return ({ status: 404, message: "Role not found" });
        }

        // Return the role
        return ({ status: 200, role });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};

// Retrieves a specific role by its name (admin-only)
exports.getByName = async (role) => {
    const { token, name } = role;

    try {
        // Check for required fields
        if (!token || !name) {
            return ({ status: 400, message: "token and name are required" });
        }

        // Decode token and check if the requester is an admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });
        }

        // Find the role by name
        const role = await Role.findOne({ name });

        if (!role) {
            return ({ status: 404, message: "Role not found" });
        }

        // Return the role
        return ({ status: 200, role });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};


// Retrieves all available roles from the database (admin-only)
exports.get = async (token) => {
    try {
        // Check if token is provided
        if (!token) {
            return ({ status: 400, message: "token is required" });
        }

        // Decode token and verify if the user is an admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });
        }

        // Retrieve all roles from the database
        const roles = await Role.find({});

        // Return the list of roles
        return ({ status: 200, roles });

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};
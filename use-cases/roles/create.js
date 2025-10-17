'use strict'
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();



// Create a new role in the system (admin-only)
exports.create = async (role) => {
    const { name, description, token } = role;

    try {
        // Check for required fields
        if (!name || !description || !token) {
            return ({ status: 400, message: "name, description and token are required" });
        }

        // Validate the token and ensure the requester is an admin
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({ status: 403, message: "Access denied. Admins only." });   
        }

        // Check if a role with the same name already exists
        const find_role = await Role.findOne({ name });
        if (find_role) {
            return ({ status: 500, message: "Role already exists" });
        }

        // Create the new role
        const response = await Role.create({ name, description });

        // Return success message
        return ({ status: 200, message: "Role created successfully" });

    } catch (error) {
        // Catch unexpected errors
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
};
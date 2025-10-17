'use strict'
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require("../../framework/db/mongoDB/models/fileModel");
const File = mongoose.model("File");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require("path");
const fs = require('fs');

exports.usersGetProfilePicture = async (user) => {
    const { token, id, quality } = user;
    try {
        // Validate required fields
        if (!token || !id) {
            return ({ status: 400, message: "token and id are required" });
        }

        // Validate token authenticity
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return ({ status: 403, message: "Access denied" });
        }

        // Find the user by id
        const user = await User.findOne({ _id: id });

        if (!user) {
            return ({ status: 404, message: "User not found" });
        }

        if (!user.file_name) {
            return ({ status: 404, message: "User has no profile picture" });
        }

        const file = await File.findOne({ hidden_name: user.file_name });

        if (!file) {
            return ({ status: 404, message: "File not found" });
        }

        const filePath = path.join(__dirname, '../../uploads/', file.hidden_name);

        if (!fs.existsSync(filePath)) {
            return ({ status: 404, message: "File not found" });
        }

        return {
            status: 200,
            data: fs.readFileSync(filePath),
            headers: {
                'Content-Type': file.extension,
                'Content-Disposition': `inline; filename="${file.real_name}"`,
            }
        };

    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong" });
    }
}
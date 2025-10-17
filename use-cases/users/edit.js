'use strict'
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require("../../framework/db/mongoDB/models/fileModel");
const File = mongoose.model("File");
require('dotenv').config();

exports.usersEdit = async ({ token, id, email, first_name, last_name, birthdate, profilePicture }) => {

    try {
        // Validate token presence
        if (!token || !id) {
            return ({ status: 400, message: "token and id are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { status: 400, message: "id must be a valid id" };
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (
                decoded.role !== process.env.ROLE_ADMIN &&
                decoded.role !== process.env.ROLE_MANAGER &&
                decoded.role !== process.env.ROLE_USER
            ) {
                return { status: 403, message: "Access denied" };
            }
        } catch (err) {
            console.log("err", err);
            return { status: 403, message: "Access denied" };
        }

        // Decode and verify the JWT token
        let userData = await User.findOne({ _id: id });

        if(decoded.role === process.env.ROLE_MANAGER || decoded.role === process.env.ROLE_USER) {

            if (decoded.id !== id) {
                return { status: 403, message: "Access denied" };
            }
        }

        // Ensure user exists in the database
        if (!userData) {
            return ({ status: 400, message: "user not found" });
        }

        // Email format validation (if email is being updated)
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (email && !isValidEmail(email)) {
            return ({ status: 400, message: "invalid email format" });
        }

        let birthDate = null;

        // Validate and parse birthdate if provided
        if (birthdate) {
            const birthDateRegex = /^(19|20)\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])$/;
            const isValidFormat = birthDateRegex.test(birthdate);

            if (!isValidFormat) {
                return ({ status: 400, message: "invalid birth date format, should be yyyy-mm-dd or yyyy/mm/dd" });
            }

            const [year, month, day] = birthdate.split(/[-/]/).map(Number);
            birthDate = new Date(year, month - 1, day);
        }

        let fileName = null;

        // Handle and validate profile picture upload
        if (profilePicture) {
            const allowedExtensions = [".jpeg", ".png"];
            const extension = path.extname(profilePicture.originalname).toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                return ({ status: 400, message: "only jpeg and png extensions are allowed" });
            }

            // Create and save a new file document in the database
            const newFile = new File({
                hidden_name: profilePicture.filename,
                real_name: profilePicture.originalname,
                insert_date: new Date().toISOString(),
                extension,
                active: "true",
            });

            const savedFile = await newFile.save();
            fileName = savedFile.hidden_name;
        }

        // Prepare the update object with only the fields provided
        const updateObject = {};
        if (email) updateObject.email = email;
        if (first_name) updateObject.first_name = first_name;
        if (last_name) updateObject.last_name = last_name;
        if (fileName) updateObject.file_name = fileName;
        if (birthdate) updateObject.birthdate = birthDate;

        // Update user in the database if any field was modified
        if (Object.keys(updateObject).length > 0) {
            await User.updateOne(
                { username: userData.username },
                {
                    $set: updateObject,
                    $setOnInsert: { last_sign_in: new Date() }, // only set if new doc is inserted (edge case)
                }
            );
        }

        // If profile picture exists, confirm file exists and return success with filename
        if (profilePicture) {
            const image = await File.findOne({ hidden_name: fileName });
            if (image) {
                try {
                    const imagePath = path.join(__dirname, `../../uploads/${image.hidden_name}`);
                    await fs.promises.readFile(imagePath); // ensures file exists

                    return {
                        status: 200,
                        message: 'success',
                        fileName: image.real_name
                    };
                } catch (error) {
                    console.error("Error reading image file:", error);
                    return ({ status: 500, message: "Error reading image file." });
                }
            } else {
                return ({ status: 404, message: "image not found" });
            }
        }

        // If no profile picture involved, just confirm successful edit
        return ({ status: 200, message: "user edited" });


    } catch (error) {
        // Catch token-related or other unexpected errors
        console.log("Error in userEditPersistence:", error);
        return ({ status: 400, message: "invalid token" });
    }
}

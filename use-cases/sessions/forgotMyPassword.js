'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

// Handles the password recovery process for a given user email
exports.forgotMyPassword = async ({ email }) => {
    try {
        // Look for a user with the provided email
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return {
                status: 404,
                message: "User not found"
            };
        }

        // Fallback to username if user name is not defined
        const emailName = userExists.name || userExists.username;

        // Default to local URL if REACT_URL is not set
        const websitUrl = process.env.REACT_URL || 'http://localhost:3000';

        // Generate a temporary token (hash of the email) for reset link
        const tempToken = await bcryptjs.hash(email, 10);

        // Set expiry time for the token (30 minutes from now)
        const tokenExpiryTime = Date.now() + 30 * 60 * 1000;

        // Save the reset token and expiry to the user's document in MongoDB
        const resetToken = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    "tokens.resetPassword": {
                        token: tempToken,
                        expiresAt: tokenExpiryTime
                    }
                }
            },
            { new: true } // Return the updated user document
        );

        // Construct the full URL for the password reset page
        const resetPasswordUrl = `${websitUrl}/reset-password?email=${email}&token=${tempToken}`;

        // Configure Nodemailer transport using SMTP credentials
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Compose email message with the reset password link
        const mailOptions = {
            from: "Scheduler <" + process.env.EMAIL_SENDER + ">", // Sender info
            to: email,
            subject: "Recuperar palavra-passe", // Email subject
            html: `<p>Olá, <br>${emailName}<br>
                Para recuperar a sua palavra-passe por favor clique no link abaixo: <br><br>
                <a href="${resetPasswordUrl}">Recuperar palavra-passe</a><br><br><br>
                Atentamente,<br>
                Equipa do Scheduler</p>`
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);

        // Return success message
        return {
            status: 200,
            message: "Email sent successfully"
        };

    } catch (error) {
        // Catch and log any unexpected errors
        console.error("Internal error:", error);
        return {
            status: 500,
            message: "An error occurred: " + error.message
        };
    }
};
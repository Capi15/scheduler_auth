const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");

exports.usersCreate = async (user) => {

    // Destructures username and password from the user object
    const { username, password } = user;

    try {
        // Adds a custom salt prefix to the password before hashing for additional security
        const salt = process.env.SECRET_SALT;
        const passwordHash = await bcryptjs.hash(salt + password, 10); 
        
        // Creates the user in the database with default email and role
        const response = await User.create({
            username,
            password: passwordHash,
            email: `${username}@alunos.ipca.pt`, // default email structure
            role: "external" // default role assigned
        });
        
        // Returns success response
        return ({ status: 200, message: "User created successfully" });
    } catch (error) {
        console.log("error", error);

        // If the user already exists (duplicate key error in MongoDB)
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }

        // Fallback error response
        return ({ status: 500, message: "Something went wrong" });
    }
}

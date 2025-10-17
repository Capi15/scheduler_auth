const mongoose = require("mongoose");

//database schema access
require("../../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");

// admin seeding, creates the first admin
exports.usersCreateAdmin = async () => {

    try {

        const userCount = await User.countDocuments();
        console.log("userCount", userCount);
        if (userCount != 0) return ({ status: 200, message: "Database has users no action required" });

        const user = await User.seedAdminUser();
        console.log("user", user);
        return ({ status: 201, message: "Admin user created successfully" });
        
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Admin user not created" });
    }
}

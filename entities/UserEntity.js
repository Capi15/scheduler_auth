const bcryptjs = require('bcryptjs');
const Role = require('../framework/db/mongoDB/models/roleModel');

exports.UserEntity = class UserEntity {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this.email = user.email || `${this.username}@gmail.com`; // corrigido aqui!
        this.first_name = user.first_name || null;
        this.last_name = user.last_name || null;
        this.register_date = user.register_date || new Date();
        this.last_sign_in = user.last_sign_in || new Date();
        this.birthdate = user.birthdate || null;
        this.file_name = user.file_name || null;
        this.active = user.active !== undefined ? user.active : true;
        this.token = user.token || null;
        this.role = user.role || 'external';
    }

    async validator() {
        if (!this.username || !this.password) {
            return ({ status: 400, message: "username and password are required" });
        }

        if (this.password.length < 8) {
            return ({ status: 400, message: "password must be at least 8 characters" });
        }


        //Increased password security for today standards
        const hasUppercase = /[A-Z]/.test(this.password);
        const hasLowercase = /[a-z]/.test(this.password);
        const hasDigit = /[0-9]/.test(this.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

        if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
            return {
                status: 400,
                message:
                    "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            };
        }

        return ({ status: 200, message: "user registered" });

    }
}
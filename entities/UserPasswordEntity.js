exports.UserPasswordEntity = class UserPasswordEntity {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }

    async validatePassword(password) {
        if (password.length < 8) {
            return ({ status: 400, message: "password must be at least 8 characters" });
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
            return {
                status: 400,
                message:
                    "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            };
        }

        return ({ status: 200, message: "password meets requirements" });
    }

};
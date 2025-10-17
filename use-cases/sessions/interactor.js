'use strict';

const { UserEntity } = require("../../entities/UserEntity");
const { UserPasswordEntity } = require("../../entities/UserPasswordEntity");

exports.login = async ({ sessionsLogin }, { username, password }) => {
    try {

        const user = new UserEntity({ username, password });
        const loginuser = await sessionsLogin(user);

        // Verifica se sessionsLogin devolveu um objeto válido
        if (!loginuser || typeof loginuser !== 'object') {
            return { status: 500, message: 'Erro inesperado ao autenticar utilizador' };
        }

        return loginuser;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: " + error });
    }
}

exports.register = async ({ usersCreate }, { username, password }) => {
    try {

        const user = new UserEntity({ username, password, register_date: new Date(), last_sign_in: new Date() });
        console.log("user", user);

        const validation = await user.validator();
        if (validation.status !== 200) {
            return validation;
        }

        const registeruser = await usersCreate(user);

        return registeruser;
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong: " + error });
    }
}
exports.forgotPassword = async ({ forgotMyPassword }, { email }) => {
    try {

        const verify = await forgotMyPassword({ email });

        return verify;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong: " + error });
    }
}

exports.resetPassword = async ({ resetMyPassword }, { email, token, password }) => {
    try {
        const user = new UserPasswordEntity({ email, password });
        const validation = await user.validatePassword(password);
        if (validation.status !== 200) {
            return validation;
        }

        const verify = await resetMyPassword({ email, token, password });

        return verify;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong: " + error });
    }
}
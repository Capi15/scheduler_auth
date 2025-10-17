'use strict';

const {UserEntity} = require("../../entities/UserEntity");
const {UserStateEntity} = require("../../entities/UserStateEntity");
const {JwtUserEntity} = require("../../entities/JwtUserEntity");
const {UserJwtEntity} = require("../../entities/UserJwtEntity");


exports.createAdmin = async ({usersCreateAdmin}, {}) => {
    try {
        const registeruser = await usersCreateAdmin();
        return registeruser;
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.changepwd = async ({usersChangepwd}, {token, oldPassword, newPassword}) => {
    try {

        const userChangePwd = new JwtUserEntity(
            {
               token,
               oldPassword,
               newPassword
            }
        );
        const changepwdUser = await usersChangepwd(userChangePwd)
        return changepwdUser;
    } catch (error) {
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.delete = async ({usersDelete}, {token, username, password}) => {
    try {

        const user = new UserStateEntity({token, username, password, active: false});
        const deleteruser = await usersDelete(user);
        return deleteruser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.restore = async ({usersRestore}, {token, username, password}) => {
    try {
        const user = new UserStateEntity({token, username, password, active: true});
        const deleteruser = await usersRestore(user);
        return deleteruser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.edit = async ({usersEdit}, {token, id, email, first_name, last_name, birthdate, profilePicture}) => {
    try {
        const edituser = await usersEdit({token, id, email, first_name, last_name, birthdate, profilePicture});
        return edituser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   
exports.getByUsername = async ({usersGetByUsername}, {token, username}) => {
    try {
        const userjwt = new UserJwtEntity({token, username});
        const user = await usersGetByUsername(userjwt);
        return user;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   

exports.get = async ({usersGet}, {token, page, limit, search, role}) => {
    try {
        const user = await usersGet({token, page, limit, search, role});
        return user;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.getProfilePicture = async ({usersGetProfilePicture}, {token, id, quality}) => {
    try {
        const user = await usersGetProfilePicture({token, id, quality});
        return user;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   

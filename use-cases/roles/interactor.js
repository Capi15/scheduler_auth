'use strict';

const {JwtRoleEntity} = require("../../entities/JwtRoleEntity");
const Role = require("../../entities/JwtRoleEntity");

exports.createRoles = async ({rolesCreateRoles}, {}) => {
    try {
        const create_roles = await rolesCreateRoles();
        return create_roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.createRole = async ({create}, {name, description, token}) => {
    try {
        const role = new JwtRoleEntity({name, description, token});
        const create_role = await create(role);
        return create_role;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.getRoles = async ({get}, {token}) => {
    try {
        const roles = await get(token);
        return roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.getRoleById = async ({getById}, {token, id}) => {
    try {
        const roles = await getById({token, id});
        return roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}
exports.getRoleByName = async ({getByName}, {token, name}) => {
    try {
        const roles = await getByName({token, name});
        return roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}
exports.assignRole = async ({assign}, {username, role_id, token}) => {
    try {
        const assignrole = await assign({username, role_id, token});
        return assignrole;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}
exports.assignRoleByName = async ({assignByName}, {username, role_name, token}) => {
    try {
        const assignrole = await assignByName({username, role_name, token});
        return assignrole;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}


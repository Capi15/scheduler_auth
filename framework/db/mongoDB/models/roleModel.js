'use strict';
//database schema
const mongoose = require('mongoose');
const { normalize } = require('path');
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
},{collection:'roles', timestamps: true});

//admin
RoleSchema.statics.seedAdminRole = async function () {
    const adminRole = {
        name: "admin",
        description: "Administrador",
    };

    await this.updateOne(
        { name: adminRole.name }, // Query by name
        { $set: adminRole },      // Update or set data
        { upsert: true }           // Insert if not exists
    );
};

//manager
RoleSchema.statics.seedManagerRole = async function () {
    const managerRole = {
        name: "manager",
        description: "Gestor",
    };

    await this.updateOne(
        { name: managerRole.name }, // Query by name
        { $set: managerRole },      // Update or set data
        { upsert: true }             // Insert if not exists
    );
};

//user
RoleSchema.statics.seedUserRole = async function () {
    const userRole = {
        name: "user",
        description: "Utilizador",
    };

    await this.updateOne(
        { name: userRole.name }, // Query by name
        { $set: userRole },      // Update or set data
        { upsert: true }           // Insert if not exists
    );
};

//external
RoleSchema.statics.seedExternalRole = async function () {
    const externalRole = {
        name: "external",
        description: "Utilizador externo",
    };

    await this.updateOne(
        { name: externalRole.name }, // Query by name
        { $set: externalRole },      // Update or set data
        { upsert: true }             // Insert if not exists
    );
};
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
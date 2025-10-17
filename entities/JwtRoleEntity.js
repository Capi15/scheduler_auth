exports.JwtRoleEntity = class JwtRoleEntity {
    constructor({name, description, token}) {
        this.name = name;
        this.description = description;
        this.token = token;
    }
};
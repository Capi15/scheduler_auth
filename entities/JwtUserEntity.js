exports.JwtUserEntity = class JwtUserEntity {
    constructor({token, oldPassword, newPassword}) {
        this.token = token;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
};
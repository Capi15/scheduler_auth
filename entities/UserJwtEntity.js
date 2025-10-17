exports.UserJwtEntity = class UserJwtEntity {
    constructor({token, username}) {
        this.token = token;
        this.username = username
    }
};
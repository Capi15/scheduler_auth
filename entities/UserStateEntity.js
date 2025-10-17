exports.UserStateEntity = class UserStateEntity {
    constructor({token, username, password, active}) {
        this.token = token;
        this.username = username;
        this.password = password;
        this.active = active;
    }
};
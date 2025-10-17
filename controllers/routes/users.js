const { usersChangepwd } = require("../../use-cases/users/changepwd");
const { usersDelete } = require("../../use-cases/users/delete");
const { usersRestore } = require("../../use-cases/users/restore");
const { usersEdit } = require("../../use-cases/users/edit");
const { usersGet, usersGetByUsername } = require("../../use-cases/users/get");
const { usersGetProfilePicture } = require("../../use-cases/users/profilePicture");
const interactor = require("../../use-cases/users/interactor");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const router = require("express").Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
    }
});
const upload = multer({ storage });

/**
 * @api {patch} /users/change-password Change Password
 * @apiName ChangePassword
 * @apiGroup User
 * @apiParam {String} oldPassword Old password
 * @apiParam {String} newPassword New password
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {String} message Password changed successfully
 * @apiError {String} message Error message
 */
router.route('/users/change-password').patch(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers['token'];
    try {
        const user = await interactor.changepwd({ usersChangepwd }, { token, oldPassword, newPassword });
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in change password route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @api {patch} /users/delete Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {String} message User deleted successfully
 * @apiError {String} message Error message
 */
router.route('/users/delete').patch(async (req, res) => {
    const { username, password } = req.body;
    const token = req.headers['token'];
    try {
        const user = await interactor.delete({ usersDelete }, { token, username, password });
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in delete user route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @api {patch} /users/restore Restore User
 * @apiName RestoreUser
 * @apiGroup User
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {String} message User restored successfully
 * @apiError {String} message Error message
 */
router.route('/users/restore').patch(async (req, res) => {
    const { username, password } = req.body;
    const token = req.headers['token'];
    try {
        const user = await interactor.restore({ usersRestore }, { token, username, password });
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in restore user route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @api {put} /users Edit User
 * @apiName EditUser
 * @apiGroup User
 * @apiParam {String} email Email
 * @apiParam {String} first_name First name
 * @apiParam {String} last_name Last name
 * @apiParam {String} birthdate Birthdate
 * @apiParam {File} profilePicture Profile picture
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {String} message User edited successfully
 * @apiError {String} message Error message
 */
router.route('/users/:id').put(upload.single('profilePicture'), async (req, res) => {
    const { email, first_name, last_name, birthdate } = req.body;
    const token = req.headers['token'];
    const profilePicture = req.file;
    const id = req.params.id;
    
    try {
        const user = await interactor.edit({ usersEdit }, { token, id, email, first_name, last_name, birthdate, profilePicture });
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in edit user route:", error);
        res.status(500).send({
            status: 500,
            message: 'An error occurred: ' + error,
        });
    }
});


/**
 * @api {get} /users/getByUsername Get User By Username
 * @apiName GetUserByUsername
 * @apiGroup User
 * @apiParam {String} username Username
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {Object} user User details
 * @apiError {String} message Error message
 */
router.route('/users/getByUsername').get(async (req, res) => {
    const username = req.query.username;
    const token = req.headers['token']
    try {
        const user = await interactor.getByUsername({usersGetByUsername}, {token, username});
        res.status(user.status).send(user);
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: 'An error occurred: ' + error,
        });
    }
});

/**
 * @api {get} /users All Users
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiParam {Number} page Page number
 * @apiParam {Number} limit Number of users per page
 * @apiParam {String} search Search string
 * @apiParam {String} role Role to filter
 * @apiHeader {String} token JSON Web Token to authenticate
 * @apiSuccess {Array} users List of users
 * @apiError {String} message Error message
 */
router.route('/users').get(async (req, res) => {
    const token = req.headers['token']
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    try {
        const user = await interactor.get({usersGet}, {token, page, limit, search, role});
        res.status(user.status).send(user);
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: 'An error occurred: ' + error,
        });
    }
});


router.route('/users/:id/profilePicture').get(async (req, res) => {
    const token = req.headers['token']
    const id = req.params.id;
    const quality = req.query.quality || 100;

    try {
        const profilePicture = await interactor.getProfilePicture({usersGetProfilePicture}, {token, id, quality});
        res.status(profilePicture.status).send(profilePicture);
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: 'An error occurred: ' + error,
        });
    }
});

module.exports = router;
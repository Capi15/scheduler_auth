const { sessionsLogin } = require("../../use-cases/sessions/login");
const { usersCreate } = require("../../use-cases/users/create");
const { forgotMyPassword } = require("../../use-cases/sessions/forgotMyPassword");
const { resetMyPassword } = require("../../use-cases/sessions/resetMyPassword");
const interactor = require("../../use-cases/sessions/interactor");
const router = require("express").Router();


/**
 * @api {post} /session/login Login
 * @apiName Login
 * @apiGroup User
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiSuccess {String} token JSON Web Token that can be used to authenticate
 * @apiError {String} user/password not match
 * @apiError {String} user not found
 */
router.route('/sessions/login').post(
    async (req, res) => {
        const { username, password } = req.body;
        try {
           
            const user = await interactor.login({sessionsLogin},{username,password});

            // Validação defensiva do status
            const status = typeof user.status === 'number' && user.status >= 100 && user.status < 600
            ? user.status
            : 500;
            
            res.status(user.status).send(user)
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: 'An error occurred: ' + error,
            });
        }
       
    }
)

/**
 * @api {post} /session/register Register
 * @apiName Register
 * @apiGroup User
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiSuccess {String} token JSON Web Token that can be used to authenticate
 * @apiError {String} user/password not match
 * @apiError {String} user not found
 */
router.route('/sessions/register').post(
    async (req, res) => {
        const { username, password } = req.body;
        try {
           
            const user = await interactor.register({usersCreate},{username,password});
            //console.log(user)
            res.status(user.status).send(user)
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: 'An error occurred: ' + error,
            });
        }
       
    }
)

/**
 * @api {patch} /sessions/forgot-password Forgot Password
 * @apiName ForgotPassword
 * @apiGroup User
 * @apiParam {String} email email
 * @apiSuccess {String} message User created successfully
 * @apiError {String} user not found
 * @apiError {String} email not found
 */
router.route('/sessions/forgot-password').patch(
    async (req, res) => {
        const { email } = req.body;
        try {
           
            const forgotPass = await interactor.forgotPassword({forgotMyPassword},{email});
            
            res.status(forgotPass.status).send(forgotPass)
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: 'An error occurred: ' + error,
            });
        }
       
    }
)

/**
 * @api {patch} /sessions/reset-password Reset Password
 * @apiName ResetPassword
 * @apiGroup User
 * @apiParam {String} email email
 * @apiParam {String} token token
 * @apiParam {String} password password
 * @apiSuccess {String} message User created successfully
 * @apiError {String} user not found
 * @apiError {String} email not found
 * @apiError {String} token not found
 */
router.route('/sessions/reset-password').patch(
    async (req, res) => {
        const { email, token, password } = req.body;
        try {
           
            const resetPass = await interactor.resetPassword({resetMyPassword},{email, token,password});
            
            res.status(resetPass.status).send(resetPass)
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: 'An error occurred: ' + error,
            });
        }
       
    }
)



module.exports = router;
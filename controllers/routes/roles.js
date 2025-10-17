const { create } = require("../../use-cases/roles/create");
const { get, getByName, getById } = require("../../use-cases/roles/get");
const { assign, assignByName } = require("../../use-cases/roles/assign");
const interactor = require("../../use-cases/roles/interactor");
const router = require("express").Router();

/**
 * @api {post} /roles Create Role
 * @apiName CreateRole
 * @apiGroup Admin
 * @apiParam {String} id Role ID
 * @apiParam {String} name Role name
 * @apiParam {String} description Role description
 * @apiParam {Array} permissions Role permissions
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} role Created role details
 * @apiError {String} message Error message
 */
router.route('/roles').post(
    async (req, res) => {
        const {name, description} = req.body;
        const token = req.headers['token'];
        try {
           
            const role = await interactor.createRole({create},{name, description, token});
            //console.log(role)
            res.status(role.status).send(role)
        } catch (error) {
            throw error;
        }
       
    }
)

/**
 * @api {get} /roles All Roles
 * @apiName GetAllRoles
 * @apiGroup Admin
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Array} roles List of roles
 * @apiError {String} message Error message
 */
router.route('/roles').get(
    async (req, res) => {
        const token = req.headers['token'];
        try {
            const roles = await interactor.getRoles({get},{token});
            res.status(roles.status).send(roles);
        } catch (error) {
            console.error("Error in get all roles route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {get} /roles/getByName Get Role By Name
 * @apiName GetRoleByName
 * @apiGroup Admin
 * @apiParam {String} name Role name
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} role Role details
 * @apiError {String} message Error message
 */
router.route('/roles/getByName').get(
    async (req, res) => {
        const token = req.headers['token'];
        const name = req.query.name;
        try {
            const roles = await interactor.getRoleByName({getByName},{token, name});
            res.status(roles.status).send(roles);
        } catch (error) {
            console.error("Error in get all roles route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {patch} /roles/assign Assign Role
 * @apiName AssignRole
 * @apiGroup Admin
 * @apiParam {String} username Username
 * @apiParam {String} role Role ID
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} message Role assignment message
 * @apiError {String} message Error message
 */
router.route('/roles/assign').patch(
    async (req, res) => {
        const {username, role_id} = req.body;

        const token = req.headers['token'];
        try {
            const assignrole = await interactor.assignRole({assign},{username, role_id, token});
            res.status(assignrole.status).send(assignrole);
        } catch (error) {
            console.error("Error in assign role route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {patch} /roles/assignByName Assign Role By Name
 * @apiName AssignRoleByName
 * @apiGroup Admin
 * @apiParam {String} username Username
 * @apiParam {String} role_name Role Name
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} message Role assignment message
 * @apiError {String} message Error message
 */

router.route('/roles/assignByName').patch(
    async (req, res) => {
        const {username, role_name} = req.body;

        const token = req.headers['token'];
        try {
            const assignrole = await interactor.assignRoleByName({assignByName},{username, role_name, token});
            res.status(assignrole.status).send(assignrole);
        } catch (error) {
            console.error("Error in assign role route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {get} /roles/:id Get Role by ID
 * @apiName GetRoleById
 * @apiGroup Admin
 * @apiParam {String} id Role ID
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} role Role details
 * @apiError {String} message Error message
 */
router.route('/roles/:id').get(
    async (req, res) => {
        const token = req.headers['token'];
        const id = req.params.id;
        try {
            const roles = await interactor.getRoleById({getById},{token, id});
            res.status(roles.status).send(roles);
        } catch (error) {
            console.error("Error in get all roles route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);


module.exports = router;
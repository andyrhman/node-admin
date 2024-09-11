/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         fullName:
 *           type: string
 *           description: Full name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *         role:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *           description: Role assigned to the user
 *     RegisterDto:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *         username:
 *           type: string
 *           description: Username for the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         role_id:
 *           type: integer
 *           description: Role for the user
 *       required:
 *         - fullname
 *         - username
 *         - email
 *         - role_id
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *         username:
 *           type: string
 *           description: Username for the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         role_id:
 *           type: integer
 *           description: Role ID of the user
 *       required:
 *         - role_id
 */

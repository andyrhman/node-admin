/**
 * @swagger
 * components:
 *   schemas:
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
 *         password:
 *           type: string
 *           format: password
 *           description: Password for the user account
 *         password_confirm:
 *           type: string
 *           format: password
 *           description: Password confirmation
 */

/**
* @swagger
* components:
*   schemas:
*     UpdateInfoDTO:
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
*/
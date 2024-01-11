/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the Role
 *         name:
 *           type: string
 *           description: Name of the Role
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Unique identifier of the Permission
 *     UpdateRoleDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the Role
 *         permissions:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of IDs of the permissions
 *       required:
 *         - name
 *         - permissions
 */

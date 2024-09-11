/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - price
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the product
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         image:
 *           type: string
 *           description: The image URL of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCreateDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         image:
 *           type: string
 *           description: URL of the product image
 *         price:
 *           type: integer
 *           description: The price of the product in cents
 */

/**
* @swagger
* components:
*   schemas:
*     ProductUpdateDto:
*       type: object
*       properties:
*         title:
*           type: string
*           description: The title of the product
*         description:
*           type: string
*           description: The description of the product
*         image:
*           type: string
*           description: The image URL of the product
*         price:
*           type: number
*           format: float
*           description: The price of the product
*       required:
*         - title
*/

/**
* @swagger
* components:
*   schemas:
*     GetProduct:
*       type: object
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The auto-generated id of the product
*         title:
*           type: string
*           description: The title of the product
*         description:
*           type: string
*           description: The description of the product
*         image:
*           type: string
*           description: The image URL of the product
*         price:
*           type: number
*           format: float
*           description: The price of the product
*         created_at:
*           type: string
*           format: date-time
*           description: The date of the record creation
*         updated_at:
*           type: string
*           format: date-time
*           description: The date of the record update
*/
const { Product } = require('../../models');
const { isUUID } = require('class-validator');
const { formatValidationErrors } = require('../utility/validation.utility.js');
const { ProductCreateDto } = require('../validation/dto/create-product.dto.js');
const { ProductUpdateDto } = require('../validation/dto/update-product.dto.js');
const { ProductService } = require('../services/product.service.js');
const sanitizeHtml = require('sanitize-html');

// ? https://www.phind.com/search?cache=i2helomupthybetydx4fgtvt
/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products with optional search criteria. Returns a list of products or a 404 status code if no matching products are found.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found matching the search criteria.
 */
const Products = async (req, res) => {
    const repository = new ProductService();
    const take = 10;
    const page = parseInt(req.query.page || '1');
    let search = req.query.search;

    let result = await repository.paginate(page, take);

    // https://www.phind.com/search?cache=za3cyqzb06bugle970v91phl
    if (typeof search === 'string') {
        search = sanitizeHtml(search);
        if (search) {
            const search2 = search.toString().toLowerCase();
            result.data = result.data.filter(
                p => p.title.toLowerCase().indexOf(search2) >= 0 ||
                    p.description.toLowerCase().indexOf(search2) >= 0
            );

            // Check if the resulting filtered data array is empty
            if (result.data.length === 0) {
                // Respond with a 404 status code and a message
                return res.status(404).json({ message: `No ${search} matching your search criteria.` });
            }
        }
    }

    res.send(result);
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     description: Create a new product with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateDto'
 *     responses:
 *       201:
 *         description: The product was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error.
 */
const CreateProduct = async (req, res) => {
    const body = req.body;

    const input = new ProductCreateDto(body);

    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    const product = await Product.create(body);

    res.status(201).send(product);
}

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the product to get
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetProduct'
 *       400:
 *         description: Not Allowed
 */
const GetProduct = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    res.send(await Product.findOne({ where: { id: req.params.id } }));
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateDto'
 *     responses:
 *       202:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or not allowed
 *       404:
 *         description: The product was not found
 */
const UpdateProduct = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    const body = req.body;

    const input = new ProductCreateDto(body);

    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    await Product.update({
        title: body.title,
        description: body.description,
        image: body.image,
        price: body.price
    }, { where: { id: req.params.id } });

    res.status(202).send(await Product.findOne({ where: { id: req.params.id } }));
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the product to delete
 *     responses:
 *       204:
 *         description: The product was deleted successfully
 *       400:
 *         description: Not Allowed - Invalid UUID
 *       404:
 *         description: The product was not found
 */
const DeleteProduct = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    await Product.destroy({ where: { id: req.params.id } });

    res.status(204).send(null);
}

module.exports = { Products, CreateProduct, GetProduct, UpdateProduct, DeleteProduct };
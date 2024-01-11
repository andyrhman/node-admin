import { Request, Response } from "express"
import { myDataSource } from "../index"
import { plainToClass } from "class-transformer";
import { isUUID, validate } from "class-validator";
import { formatValidationErrors } from "../utility/validation.utility";
import { Product } from "../entity/product.entity";
import { ProductCreateDto } from "../validation/dto/create-product.dto";
import { ProductUpdateDto } from "../validation/dto/update-product.dto";
import { ProductService } from "../services/product.service";
import sanitizeHtml from 'sanitize-html';

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
export const Products = async (req: Request, res: Response) => {
    const repository = new ProductService();
    const take = 10;
    const page = parseInt(req.query.page as string || '1');
    let search = req.query.search;

    let result = await repository.paginate({}, page, take);

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
export const CreateProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(ProductCreateDto, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const repository = myDataSource.getRepository(Product);

    const product = await repository.save(body);

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
export const GetProduct = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const repository = myDataSource.getRepository(Product);

    res.send(await repository.findOne({ where: { id: req.params.id } }));
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
export const UpdateProduct = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const body = req.body;
    const input = plainToClass(ProductUpdateDto, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }
    const repository = myDataSource.getRepository(Product);

    await repository.update(req.params.id, body);

    res.status(202).send(await repository.findOne({ where: { id: req.params.id } }));
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
export const DeleteProduct = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const repository = myDataSource.getRepository(Product);

    await repository.delete(req.params.id);

    res.status(204).send(null);
}


import { Request, Response } from "express"
import { myDataSource } from "../index"
import { plainToClass } from "class-transformer";
import { isUUID, validate } from "class-validator";
import { formatValidationErrors } from "../validation/utility/validation.utility";
import { Product } from "../entity/product.entity";
import { ProductCreateDto } from "../validation/dto/create-product.dto";
import { ProductUpdateDto } from "../validation/dto/update-product.dto";
import { ProductService } from "../services/product.service";
import sanitizeHtml from 'sanitize-html';

// ? https://www.phind.com/search?cache=i2helomupthybetydx4fgtvt
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

export const GetProduct = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const repository = myDataSource.getRepository(Product);

    res.send(await repository.findOne({ where: { id: req.params.id } }));
}

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

export const DeleteProduct = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const repository = myDataSource.getRepository(Product);

    await repository.delete(req.params.id);

    res.status(204).send(null);
}


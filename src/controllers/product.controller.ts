import { Request, Response } from "express"
import { myDataSource } from "../index"
import { plainToClass } from "class-transformer";
import { isUUID, validate } from "class-validator";
import { formatValidationErrors } from "../validation/utility/validation.utility";
import { Product } from "../entity/product.entity";
import { ProductCreateDto } from "../validation/dto/create-product.dto";
import { ProductUpdateDto } from "../validation/dto/update-product.dto";

export const Products = async (req: Request, res: Response) => {
    const repository = myDataSource.getRepository(Product);

    let products = await repository.find();

    if (req.query.search) {
        const search = req.query.search.toString().toLowerCase();
        products = products.filter(
            p => p.title.toLowerCase().indexOf(search) >= 0 ||
                p.description.toLowerCase().indexOf(search) >= 0
        )
    }
    res.send(products)
}

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


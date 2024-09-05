import { Request, Response } from "express";
import { extname } from "path";
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import { plainToClass } from "class-transformer";
import { ProductCreateDto } from "../validation/dto/create-product.dto";
import { validate } from "class-validator";
import { myPrisma } from "../config/db.config";

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Upload successful, returns the URL of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 *       400:
 *         description: Error occurred during upload
 */
/**
 * @swagger
 * /api/uploads/{filename}:
 *   get:
 *     summary: Get an uploaded image
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The filename of the image to retrieve
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
// Memory storage for multer
const storage = multer.memoryStorage();

// Multer middleware
const upload = multer({ storage }).single('image');

export const Upload = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(400).send(err);
        }

        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        try {
            // Upload the image to Cloudinary in the specific folder
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'NodeAdmin',
                        public_id: `${Math.random().toString(20).slice(2, 12)}${extname(req.file.originalname)}`
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            res.send({
                url: (result as any).secure_url,
                public_id: (result as any).public_id
            });

        } catch (err) {
            res.status(500).json({ message: 'Server Error', error: err.message });
        }
    });
};

export const CreateProductWithImage = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(400).send(err);
        }

        if (!req.file) {
            return res.status(400).send({ message: "No image uploaded" });
        }

        try {
            // Upload the image to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "NodeAdmin" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            const body = req.body;
            const input = plainToClass(ProductCreateDto, {
                ...body,
                price: parseInt(body.price, 10),

                image: (result as any).secure_url,
                public_id: (result as any).public_id,
            });

            const validationErrors = await validate(input);

            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }
            
            // Create the product with the image URL and public_id
            const product = await myPrisma.product.create({
                data: {
                    ...body,
                    price: parseInt(body.price, 10),
                    image: (result as any).secure_url,
                    public_id: (result as any).public_id,
                }
            });

            res.status(201).send(product);
        } catch (err) {
            res.status(500).json({ message: "Server Error", error: err.message });
        }
    });
};
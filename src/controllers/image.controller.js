// import { Request, Response } from "express"
// import { extname } from "path";
// import multer from "multer";

// /**
//  * @swagger
//  * /api/upload:
//  *   post:
//  *     summary: Upload an image file
//  *     tags: [File Upload]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *                 description: Image file to upload
//  *     responses:
//  *       200:
//  *         description: Upload successful, returns the URL of the uploaded image
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 url:
//  *                   type: string
//  *                   description: URL of the uploaded file
//  *       400:
//  *         description: Error occurred during upload
//  */
// /**
//  * @swagger
//  * /api/uploads/{filename}:
//  *   get:
//  *     summary: Get an uploaded image
//  *     tags: [File Upload]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: filename
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The filename of the image to retrieve
//  *     responses:
//  *       200:
//  *         description: Image retrieved successfully
//  *         content:
//  *           image/png:
//  *             schema:
//  *               type: string
//  *               format: binary
//  *       404:
//  *         description: Image not found
//  */
// export const Upload = async (req: Request, res: Response) => {

//     const storage = multer.diskStorage({
//         destination: './uploads',
//         filename(_, file, callback){
//             const randomName = Math.random().toString(20).slice(2, 12);
//             return callback(null, `${randomName}${extname(file.originalname)}`);
//         }
//     });

//     // using image in single(image) for the form-data key
//     const upload = multer({storage}).single('image');

//     upload(req, res, (err: any) =>{
//         if (err) {
//             return res.status(400).send(err)
//         }

//         res.send({
//             url: `http://localhost:8000/api/uploads/${req.file.filename}`
//         })
//     })

// }
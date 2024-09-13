const { IsInt, IsNotEmpty, IsString } = require('class-validator');

export class ProductCreateDto {
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty()
    title;

    @IsString({ message: "Description must be a string" })
    @IsNotEmpty()
    description;

    @IsString({ message: "Image must be a string" })
    @IsNotEmpty()
    image;

    @IsInt({ message: "Price must be a Integer" })
    @IsNotEmpty()
    price
}
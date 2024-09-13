const { IsString, IsOptional, IsInt } = require('class-validator');

export class ProductUpdateDto {
    @IsString({ message: "Title must be a string" })
    @IsOptional()
    title;

    @IsString({ message: "Description must be a string" })
    @IsOptional()
    description;

    @IsString({ message: "Image must be a string" })
    @IsOptional()
    image;

    @IsInt({ message: "Price must be a string" })
    @IsOptional()
    price;
}
import { IsString, IsOptional, IsInt } from "class-validator";

export class ProductUpdateDto {
    @IsString({message: "Title must be a string"})
    @IsOptional()
    title?: string;

    @IsString({message: "Description must be a string"})
    @IsOptional()
    description?: string;

    @IsString({message: "Image must be a string"})
    @IsOptional()
    image?: string;

    @IsInt({message: "Price must be a string"})
    @IsOptional()
    price?: number
}
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProductCreateDto {
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty()
    title: string;

    @IsString({ message: "Description must be a string" })
    @IsNotEmpty()
    description: string;

    @IsString({ message: "Image must be a string" })
    @IsOptional()
    image: string;

    @IsString({ message: "Image public_id must be a string" })
    @IsOptional()
    public_id: string;

    @IsInt({ message: "Price must be a Integer" })
    @IsNotEmpty()
    price: number;
}
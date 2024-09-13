// ? https://www.phind.com/search?cache=aww4upilaldpb6wgjnpww7lu
const { ArrayMinSize, ArrayNotEmpty, IsInt, IsNotEmpty, IsString } = require('class-validator');

export class UpdateRoleDTO{
    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    name;

    @ArrayNotEmpty({ message: 'Permissions is required' })
    @ArrayMinSize(1, { message: 'Permissions should have at least 1 item' })
    @IsInt({each: true, message: 'Permissions must be a number'})
    permissions;
}
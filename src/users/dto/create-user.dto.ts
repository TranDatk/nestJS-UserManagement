import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    phone: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;
    age: number;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

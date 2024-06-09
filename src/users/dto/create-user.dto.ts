import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUnique } from 'src/decorator/validation/is-unique-constraint';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsUnique('email', { message: 'Email already exists' })
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

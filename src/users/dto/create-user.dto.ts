import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUnique } from 'src/custom-decorators/unique.decorator';


export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsUnique('User', 'email', { message: 'Email already exists' })
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

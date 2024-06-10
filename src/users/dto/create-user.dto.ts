import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { IsUnique } from 'src/custom-decorators/unique.decorator';

class Company {
    @IsNotEmpty()
    @IsMongoId()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

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

    @IsNotEmpty()
    gender: string;

    age: number;

    address: string;

    @IsNotEmpty()
    role: string;

    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => Company)
    // company: Company;

    // createdAt: Date;

    // updatedAt: Date;
}

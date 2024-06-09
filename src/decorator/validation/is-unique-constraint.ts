import { Injectable, Inject } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions
} from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async validate(value: any, args: ValidationArguments) {
        const [property] = args.constraints;
        const user = await this.userModel.findOne({ [property]: value });
        return !user;
    }

    defaultMessage(args: ValidationArguments) {
        const [property] = args.constraints;
        return `${property} already exists`;
    }
}

export function IsUnique(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsUniqueConstraint,
        });
    };
}

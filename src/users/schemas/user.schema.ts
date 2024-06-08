import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, dropDups: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    address: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
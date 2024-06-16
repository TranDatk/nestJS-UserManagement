import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    _id: string;

    @Prop({ required: true, unique: true, dropDups: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    gender: string;

    @Prop()
    age: number;

    @Prop()
    role: string;

    @Prop()
    address: string;

    @Prop()
    createdAt: Date;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
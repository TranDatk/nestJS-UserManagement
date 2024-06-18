import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission } from "src/permissions/schemas/permission.schema";

export type PermissionDocument = HydratedDocument<Role>;

export class Role {
    @Prop()
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, unique: true, dropDups: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
    permissions: Permission[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        name: string;
    };

    @Prop()
    createdAt: Date;

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
}

export const RoleSchema = SchemaFactory.createForClass(Role);
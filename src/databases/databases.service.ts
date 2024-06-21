import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './init-data';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        private configService: ConfigService,
        private userService: UsersService,
    ) { }

    async onModuleInit() {
        const isInit = this.configService.get<string>('SHOULD_INIT');
        if (Boolean(isInit)) {
            const permissionQuantity = await this.permissionModel.count({});
            const roleQuantity = await this.roleModel.count({});
            const userQuantity = await this.userModel.count({});


            if (permissionQuantity === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS);
            }

            if (roleQuantity === 0) {
                const permissions = await this.permissionModel.find({}).select("_id");
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: 'Full permission',
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: 'The users use the web',
                        isActive: true,
                        permissions: []
                    }
                ])
            }

            if (userQuantity === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModel.findOne({ name: USER_ROLE });
                await this.userModel.insertMany([
                    {
                        name: "I'm admin",
                        email: "admin@gmai.com",
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 22,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole._id
                    },
                    {
                        name: "I'm user 1",
                        email: "user1@gmai.com",
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 22,
                        gender: "MALE",
                        address: "VietNam",
                        role: userRole._id
                    },
                    {
                        name: "I'm user 2",
                        email: "user2@gmai.com",
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 22,
                        gender: "MALE",
                        address: "VietNam",
                        role: userRole._id
                    },
                ]);
            }

            if (userQuantity > 0 && roleQuantity > 0 && permissionQuantity > 0) {
                this.logger.log(">>> ALREADY INIT DATA...");
            }
        }
    }
}

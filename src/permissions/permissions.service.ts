import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ExistedException } from 'src/exceptions/existed.format.exception';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const isExist = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method
    })
    if (isExist) {
      throw new ExistedException(`apiPath: ${createPermissionDto.apiPath} and method: ${createPermissionDto.method}`);
    }
    const newPermissions = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: { _id: user._id, email: user.email }
    })
    return 'This action adds a new permission';
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}

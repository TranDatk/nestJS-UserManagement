import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import mongoose from "mongoose";
import { BadRequestCustomException } from 'src/exceptions/bad-request.exception';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    var bcrypt = require('bcryptjs');
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = (await this.userModel.create({ ...createUserDto, password: hashPassword }));
    return user
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.limit;
    delete filter.page;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      results
    };
  }

  async findOne(id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestCustomException(id);
    }

    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException(User.name);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      email: username
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestCustomException(id);
    }

    // This option allows the query to return new result.
    const option = { new: true }

    return (await this.userModel.findByIdAndUpdate(id, updateUserDto, option));
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestCustomException(id);
    }

    return await this.userModel.softDelete({ _id: id })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
}

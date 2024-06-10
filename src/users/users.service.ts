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
import { IUser } from './users.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    var bcrypt = require('bcryptjs');
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser): Promise<User> {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const userResult = (
      await this.userModel.create(
        {
          ...createUserDto,
          role: "ADMIN",
          password: hashPassword,
          createdBy: {
            _id: user._id,
            email: user.email,
            name: user.name,
          }
        }
      )
    );
    return userResult
  }

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.getHashPassword(registerUserDto.password);
    const userResult = (
      await this.userModel.create({
        ...registerUserDto,
        password: hashPassword,
        role: "USER"
      }
      )
    );
    return {
      _id: userResult?._id,
      createdAt: userResult?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.limit;
    delete filter.page;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.userModel.find(filter).select("-password")
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

    const user = await this.userModel.findById(id).select("-password")
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

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestCustomException(id);
    }

    // This option allows the query to return new result.
    const option = { new: true }

    return (await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
      option));
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestCustomException(id);
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return await this.userModel.softDelete({ _id: id })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
}

import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import mongoose from "mongoose";
import { BadRequestCustomException } from 'src/exceptions/bad-request.exception';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

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

  async findAll() {
    return `This action returns all users`;
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

    const { deletedCount } = await this.userModel.deleteOne({ _id: id })

    return deletedCount;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
}

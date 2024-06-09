import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IsUniqueConstraint } from 'src/custom-decorators/unique.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name, schema: UserSchema,
    }]),
  ],
  controllers: [UsersController],
  providers: [
    IsUniqueConstraint,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UsersService]
})
export class UsersModule { }

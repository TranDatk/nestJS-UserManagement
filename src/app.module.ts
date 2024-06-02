import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://root:2EUc3bmgk3BG3N3s@cluster0.ehxt9wg.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

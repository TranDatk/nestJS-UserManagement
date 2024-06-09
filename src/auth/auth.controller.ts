import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/custom-decorators/is-public-decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }

}

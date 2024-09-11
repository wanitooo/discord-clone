import { Controller, Res, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Response } from 'express';
import { User } from 'src/users/dto/users-dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    // auth guard validates the user first from the request then .login via passport-local generates an access token from passport-jwt
    return this.authService.login(user, response);
  }
}

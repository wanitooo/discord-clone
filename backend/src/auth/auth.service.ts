import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { User } from 'src/users/dto/users-dto';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { jwtConstants } from './constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User = await this.usersService.findOne(email);

    // should bcrypt.compare(password, hash)
    const matched = await compare(password, user.password);

    if (user && matched) {
      const { password, ...others } = user;
      return others;
    }
    return null;
  }

  async login(user: User, response: Response) {
    const expireAccessToken = new Date();

    expireAccessToken.setTime(
      expireAccessToken.getTime() + parseInt(jwtConstants.accessExpiry),
    );

    const expireRefreshToken = new Date();

    expireRefreshToken.setTime(
      expireRefreshToken.getTime() + parseInt(jwtConstants.refreshExpiry),
    );

    const payload = { email: user.email, sub: user.uuid };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: `${jwtConstants.accessExpiry}ms`,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: `${jwtConstants.refreshExpiry}ms`,
    });

    await this.usersService.updateUser(user.email, {
      refreshToken: await hash(refreshToken, 13),
    });
    // const cookieOpts = {
    //   httpOnly: true,
    //   secure: false, // __prod__
    //   sameSite: 'lax',
    //   path: '/',
    //   domain: '', // __prod__ ? `.${process.env.DOMAIN}` : ""
    //   maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
    // };

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: jwtConstants.nodeEnv === 'production' ? true : false,
      expires: expireAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: jwtConstants.nodeEnv === 'production' ? true : false,
      expires: expireRefreshToken,
    });
  }

  async verifyRefreshToken(email: string, refreshToken: string) {
    try {
      const user = await this.usersService.findOne(email);
      const authenticated = await compare(refreshToken, user.refreshToken);
      if (authenticated) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
}

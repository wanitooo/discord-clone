import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from 'src/nest-drizzle/discordSchema';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { User } from 'src/users/dto/users-dto';
import { ConfigService } from '@nestjs/config';
import exp from 'constants';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: typeof users.$inferSelect =
      await this.usersService.findOne(email);

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

    expireAccessToken.setMilliseconds(
      expireAccessToken.getMilliseconds() +
        parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRY')),
    );

    const payload = { email: user.email, sub: user.uuid };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRY')}ms`,
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
      secure:
        this.configService.getOrThrow('NODE_ENV') === 'production'
          ? true
          : false,
      expires: expireAccessToken,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from 'src/nest-drizzle/discordSchema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: typeof users.$inferSelect =
      await this.usersService.findOne(email);

    // should bcrypt.compare(password, hash)
    if (user && user.password == password) {
      const { password, ...others } = user;
      return others;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

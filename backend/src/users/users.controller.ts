import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, insertUserSchema } from './dto/users-dto';
import { ZodPipe } from 'src/pipes/zod-pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-user')
  createUser(@Body(new ZodPipe(insertUserSchema)) payload: CreateUserDto) {
    return this.usersService.createUser(
      payload.name,
      payload.password,
      payload.email,
    );
  }
}

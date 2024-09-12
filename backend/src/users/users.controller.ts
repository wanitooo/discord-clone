import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  insertUserSchema,
  UpdateUserDto,
  updateUserSchema,
} from './dto/users-dto';
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

  @Patch(':email')
  updateUser(@Param('email') email: string, @Body() payload: UpdateUserDto) {
    return this.usersService.updateUser(email, payload);
  }
}

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common/exceptions';
import { Users } from '@prisma/client';
import { LoggedUserDto } from '../users/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<LoggedUserDto> {
    const user = await this.usersService.user({
        username
    });
    const isMatch = await bcrypt.compare(pass, user.password);
    if(!isMatch) throw new HttpException('Username or password mismatch', 403)

    let token = await this.generateToken(user)
    return {
        username: user.username,
        token
    }
  }

  async generateToken(user: Users) {
    const payload = { username: user.username, id: user.id, accountId: user.accountId };
    return this.jwtService.sign(payload)
  }
}
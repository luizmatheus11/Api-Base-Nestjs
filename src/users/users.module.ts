import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, PrismaService, JwtService],
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }

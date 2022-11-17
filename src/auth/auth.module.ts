import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule)
  ],
  providers: [UsersService, PrismaService, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }

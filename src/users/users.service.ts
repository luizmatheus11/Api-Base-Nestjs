import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserLoginDto, UserDto, LoggedUserDto } from './dto/users.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService) { }

    async user(
        userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
    ): Promise<Users | null> {
        return this.prisma.users.findUniqueOrThrow({
            where: userWhereUniqueInput,
        });
    }

    async userInformation(
        userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
    ) {
        return this.prisma.users.findUnique({
            where: userWhereUniqueInput,
            select: {
                username: true,
                account: {
                    select: {
                        balance: true,
                        creditedTransaction: true,
                        debitedTransaction: true,
                        id: true
                    }
                }
            }
        });
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UsersWhereUniqueInput;
        where?: Prisma.UsersWhereInput;
        orderBy?: Prisma.UsersOrderByWithRelationInput;
    }): Promise<Users[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.users.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createUser(data: UserLoginDto): Promise<LoggedUserDto> {
        let { username, password } = data

        if (await this.user({ username })) throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST)

        if (!password.match('^(?=.*[A-Z])(?=.*[0-9]).{8}$')) throw new HttpException('Not a strong password', HttpStatus.BAD_REQUEST)

        data.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        let createUser = await this.prisma.users.create({
            data: {
                username,
                password: data.password,
                account: {
                    create: {
                        balance: 100,
                    }
                }
            }
        });

        let token = await this.authService.generateToken(createUser)

        return {
            token,
            username: createUser.username
        }
    }

    async updateUser(params: {
        where: Prisma.UsersWhereUniqueInput;
        data: Prisma.UsersUpdateInput;
    }): Promise<Users> {
        const { where, data } = params;
        return this.prisma.users.update({
            data,
            where,
        });
    }
}

import { Body, Controller, HttpCode, Post, HttpException, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandling } from 'src/config/error-handling';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { UserLoginDto, CreateUserDto, UserDto, LoggedUserDto } from './dto/users.dto';
import { HttpResponseDto } from '../config/http-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @ApiTags('users')
    @ApiOperation({ summary: 'Get User' })
    @ApiBearerAuth('Bearer')
    @ApiResponse({ status: 200, description: 'Get User Information', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
    @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(200)
    async user(@Req() { user }) {
        try {
            return this.usersService.userInformation({id: user.id})
        } catch (error) {
            new ErrorHandling(error);
        }
    }

    @ApiTags('users')
    @ApiOperation({ summary: 'Create User' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'Successfully Created', type: LoggedUserDto })
    @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
    @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
    @Post()
    @HttpCode(200)
    async createUser(@Body() data: UserLoginDto) {
        try {
            if (!data) throw new HttpException({ status: 400, error: "Invalid Body" }, 400);

            return this.usersService.createUser(data)

        } catch (error) {
            new ErrorHandling(error);
        }
    }

    @ApiTags('users')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: UserLoginDto })
    @ApiResponse({ status: 200, description: 'Successfully logged in', type: LoggedUserDto })
    @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
    @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
    @Post('/login')
    @HttpCode(200)
    async login(@Body() data: UserLoginDto) {
        try {
            if (!data) throw new HttpException({ status: 400, error: "Invalid Body" }, 400);

            return this.authService.validateUser(data.username, data.password)

        } catch (error) {
            new ErrorHandling(error);
        }
    }
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    password: string;
}

export class CreateUserDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    password: string;
}

export class LoggedUserDto {
    
    @ApiProperty({required: true})
    @IsNotEmpty()
    token: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;
}
export class UserDto {

    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    accountId: string;
}
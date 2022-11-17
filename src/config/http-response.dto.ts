import { ApiProperty } from '@nestjs/swagger';

export class HttpResponseDto {

    @ApiProperty()
    status : number;

    @ApiProperty()
    error : string;

}
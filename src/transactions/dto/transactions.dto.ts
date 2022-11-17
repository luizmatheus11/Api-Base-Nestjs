import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CashOutDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    value: number;
}

export class FindTransactionsDto {
    @ApiProperty({required: false, type: Number})
    limit?: number;

    @ApiProperty({required: false, type: Number})
    page?: number;

    @ApiProperty({required: false, type: Date, example: new Date()})
    date?: Date;

    @ApiProperty({required: false, type:'enum', enum: ['cashOutTransaction', 'cashInTransaction'] })
    transactionType?: string;
}

export class TransactionDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    accountIdToCredited: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    accountIdToDebited: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    value: number;

}

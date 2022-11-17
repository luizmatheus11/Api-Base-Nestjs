
import { Controller } from '@nestjs/common';
import { Body, Get, HttpCode, Post, Req, UseGuards, Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpResponseDto } from '../config/http-response.dto';
import { ErrorHandling } from '../config/error-handling';
import { TransactionsService } from './transactions.service';
import { CashOutDto, FindTransactionsDto } from './dto/transactions.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {

    constructor(
        private transactionsService: TransactionsService
    ) { }

    @ApiTags('transactions')
    @ApiOperation({ summary: 'Transaction to user' })
    @ApiBearerAuth('Bearer')
    @ApiResponse({ status: 200, description: 'Transaction Successfully'})
    @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
    @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
    @Get()
    @HttpCode(200)
    async transactions(@Req() { user }, @Query() data: FindTransactionsDto) {
        try {
            console.log(data)
            return this.transactionsService.transactions(user.accountId, data)
        } catch (error) {
            new ErrorHandling(error);
        }
    }

    @ApiTags('transactions')
    @ApiOperation({ summary: 'Get User' })
    @ApiBearerAuth('Bearer')
    @ApiBody({ type: CashOutDto })
    @ApiResponse({ status: 200, description: 'Transaction Successfully'})
    @ApiResponse({ status: 400, description: 'Bad Request', type: HttpResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden', type: HttpResponseDto })
    @ApiResponse({ status: 500, description: "Internal Server Error", type: HttpResponseDto })
    @Post('/cash-out')
    @HttpCode(200)
    async cashOut(@Req() { user }, @Body() data: CashOutDto) {
        try {
            return this.transactionsService.cashOut(user.username, data)
        } catch (error) {
            new ErrorHandling(error);
        }
    }
}

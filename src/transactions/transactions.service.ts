
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CashOutDto, TransactionDto, FindTransactionsDto } from './dto/transactions.dto';
import { UsersService } from '../users/users.service';
import { Users, Prisma, Transactions } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class TransactionsService {

    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
    ) { }

    async cashOut(username: string, data: CashOutDto) {
        let userToDebited = await this.usersService.userInformation({
            username
        })

        let userToCredited = await this.usersService.userInformation({
            username: data.username,
        })

        if (!userToDebited || !userToCredited || userToCredited.username == userToDebited.username) throw new HttpException(`Something went wrong`, HttpStatus.BAD_REQUEST)

        if (userToDebited.account.balance < data.value) throw new HttpException(`Your balance is low`, HttpStatus.BAD_REQUEST)

        await this.usersService.updateUser({
            data: {
                account: {
                    update: {
                        balance: {
                            decrement: data.value
                        }
                    }
                }
            },
            where: {
                username: userToDebited.username
            }
        })
        await this.usersService.updateUser({
            data: {
                account: {
                    update: {
                        balance: {
                            increment: data.value
                        }
                    }
                }
            },
            where: {
                username: userToCredited.username
            }
        })

        await this.createTransaction({
            accountIdToCredited: userToCredited.account.id,
            accountIdToDebited: userToDebited.account.id,
            value: data.value
        })

    }

    async createTransaction({ accountIdToCredited, accountIdToDebited, value }: TransactionDto) {
        await this.prisma.transactions.create({
            data: {
                creditedAccountId: accountIdToCredited,
                debitedAccountId: accountIdToDebited,
                value,
            }
        })
    }

    async transactions(accountId: string, data: FindTransactionsDto): Promise<Transactions[]> {
        let transactionType: string

        if (data.transactionType) {
            transactionType = data.transactionType == 'cashOutTransaction' ? 'debitedAccountId' : 'creditedAccountId'
        }

        if (!data.limit) data.limit = 10

        if (!data.page) data.page = 1

        return this.prisma.transactions.findMany({
            where: {
                ...(data.transactionType && { [transactionType]: accountId } || accountId && {
                    OR: [
                        {
                            creditedAccountId: accountId
                        },
                        {
                            debitedAccountId: accountId
                        }
                    ]
                }),
                ...(data.date && {
                    AND: [
                        {
                            createdAt: {
                                gte: startOfDay(new Date(data.date))
                            }
                        },
                        {
                            createdAt: {
                                lte: endOfDay(new Date(data.date))
                            }
                        }
                    ]
                })
            },
            take: Number(data.limit),
            skip: Number((data.page - 1) * data.limit),
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}

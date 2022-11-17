import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        UsersModule
    ],
    controllers: [TransactionsController ],
    providers: [ TransactionsService, PrismaService ],
})
export class TransactionsModule { }

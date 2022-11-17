import { ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersService: UsersService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handleRequest(err, user) {
    
    if(!user || err) throw new HttpException(`Not Authorized`, 401);
    
    const findUser = await this.usersService.user({username: user.username})

    if (!findUser) throw new HttpException(`Not Authorized`, 401);
    return user;
  }
}

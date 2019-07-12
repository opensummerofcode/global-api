import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.userService.checkCredentials(email, password);
  }

  async createToken(user: any, expiresIn?: any) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn });
  }

  async accountConfirmationToken(user: any) {
    return this.createToken(
      user,
      this.configService.get('CONFIRMATION_EXPIRES_IN'),
    );
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  async sign(user: any) {
    return {
      access_token: this.createToken(
        user,
        this.configService.get('EXPIRES_IN'),
      ),
    };
  }
}

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

  async login(email: string, password: string, { res }) {
    const user = await this.userService.checkCredentials(email, password);
    const token = await this.createToken(
      user,
      this.configService.get('EXPIRES_IN'),
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000, // 1d TODO to put inside .env or config
    });
    return user;
  }

  logout(res: any) {
    res.clearCookie('token');
    return true;
  }

  async loggedUser({ token }) {
    if (token) {
      // Verify the token
      try {
        const { sub: userId } = await this.verify(token);
        // Get the user
        return userId && (await this.userService.findById(userId));
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

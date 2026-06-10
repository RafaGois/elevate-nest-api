import { Body, Controller, Post } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './auth/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: SignInDTO) {
    await this.authService.signin(body);
    return body;
  }

  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    await this.authService.signup(body);
    return body;
  }
}

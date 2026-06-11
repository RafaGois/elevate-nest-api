import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: SignInDTO) {
    return await this.authService.signin(body);
  }

  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    return await this.authService.signup(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() request: Request) {
    console.log(request);
    return 'ok';
  }
}

import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('auth.register.user')
  registerUser() {
    return 'User registered successfully';
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return 'User logged in successfully';
  }

  @MessagePattern('auth.verify.user')
  verifyToek() {
    return 'User verified successfully';
  }
}

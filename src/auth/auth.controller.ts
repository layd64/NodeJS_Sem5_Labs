import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { UserProfile } from '../common/interfaces/user.interface';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Registration failed',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string): Promise<Omit<UserProfile, 'password'>> {
    const user = await this.authService.getUserProfile(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...profile } = user;
    return profile;
  }
}

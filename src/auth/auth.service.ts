import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { User } from '../common/interfaces/user.interface';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
      },
    });

    return {
      token: this.generateToken(newUser.id as unknown as string),
      user: {
        id: newUser.id as unknown as string,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email, password: loginDto.password },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return {
      token: this.generateToken(user.id as unknown as string),
      user: {
        id: user.id as unknown as string,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getUserProfile(userId: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return undefined;
    return {
      id: user.id as unknown as string,
      email: user.email,
      password: user.password,
      name: user.name,
      savedBooks: [],
      createdAt: user.createdAt as unknown as Date,
    };
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: updates.email,
        password: updates.password,
        name: updates.name,
      },
    });
  }

  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }
}

import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';

import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { User } from '../common/interfaces/user.interface';
import { FileStorageService } from '../common/services/file-storage.service';
import { USERS } from '../data/users.data';

@Injectable()
export class AuthService implements OnModuleInit {
  private users: User[] = [];
  private readonly storageFilename = 'users.json';

  constructor(private readonly fileStorage: FileStorageService) {}

  async onModuleInit() {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.users = await this.fileStorage.readFile<User[]>(this.storageFilename, [...USERS]);
  }

  private async saveUsers(): Promise<void> {
    await this.fileStorage.writeFile(this.storageFilename, this.users);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    await this.loadUsers();
    
    const existingUser = this.users.find((user) => user.email === registerDto.email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
    }

    const newUser: User = {
      id: String(this.users.length + 1),
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      savedBooks: [],
      createdAt: new Date(),
    };

    this.users.push(newUser);
    await this.saveUsers();

    return {
      token: this.generateToken(newUser.id),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    await this.loadUsers();
    
    const user = this.users.find(
      (u) => u.email === loginDto.email && u.password === loginDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return {
      token: this.generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getUserProfile(userId: string): Promise<User | undefined> {
    await this.loadUsers();
    return this.users.find((user) => user.id === userId);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await this.loadUsers();
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      await this.saveUsers();
    }
  }

  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }
}

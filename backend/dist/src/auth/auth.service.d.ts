import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { User } from '../common/interfaces/user.interface';
import { PrismaService } from '../common/services/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getUserProfile(userId: string): Promise<User | undefined>;
    getUserProfileWithoutPassword(userId: string): Promise<Omit<User, 'password'> | undefined>;
    updateUser(userId: string, updates: Partial<User>): Promise<void>;
    private generateToken;
}

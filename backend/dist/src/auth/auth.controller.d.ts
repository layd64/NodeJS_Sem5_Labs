import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { UserProfile } from '../common/interfaces/user.interface';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<Omit<UserProfile, 'password'>>;
}

export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

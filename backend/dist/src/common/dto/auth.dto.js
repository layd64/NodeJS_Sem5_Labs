"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = exports.LoginDto = exports.RegisterDto = void 0;
class RegisterDto {
    email;
    password;
    name;
}
exports.RegisterDto = RegisterDto;
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
class AuthResponseDto {
    token;
    user;
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth.dto.js.map
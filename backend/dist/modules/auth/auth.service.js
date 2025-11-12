var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const user = await this.usersService.create(dto);
        return user.toJSON();
    }
    async login(dto) {
        const user = await this.usersService.validateUser(dto.email, dto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user._id, email: user.email, roles: user.roles || [] };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService, JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map
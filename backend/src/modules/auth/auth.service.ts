import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return user.toJSON();
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: (user as any)._id, email: user.email, roles: (user as any).roles || [] };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}


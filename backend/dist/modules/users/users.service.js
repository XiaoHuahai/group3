var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema.js';
import bcrypt from 'bcryptjs';
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(dto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const created = new this.userModel({
            email: dto.email,
            passwordHash,
            name: dto.name
        });
        return created.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async validateUser(email, password) {
        const user = await this.findByEmail(email);
        if (!user)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        return ok ? user : null;
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map
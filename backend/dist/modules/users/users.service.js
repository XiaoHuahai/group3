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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema.js';
import { Role } from '../../common/enums/role.enum.js';
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
    async getUserStats() {
        const totalUsers = await this.userModel.countDocuments().exec();
        const stats = await this.userModel.aggregate([
            {
                $unwind: '$roles'
            },
            {
                $group: {
                    _id: '$roles',
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        const roleStats = {};
        stats.forEach((stat) => {
            roleStats[stat._id] = stat.count;
        });
        return {
            total: totalUsers,
            byRole: roleStats
        };
    }
    async findAll() {
        return this.userModel.find().select('-passwordHash').exec();
    }
    async findById(id) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.userModel.findById(id).select('-passwordHash').exec();
    }
    async updateRoles(userId, dto, adminId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // 检查是否是管理员在操作
        const admin = await this.userModel.findById(adminId);
        if (!admin || !admin.roles?.includes(Role.Admin)) {
            throw new BadRequestException('Only admins can update user roles');
        }
        // 确保至少有一个角色
        if (!dto.roles || dto.roles.length === 0) {
            throw new BadRequestException('User must have at least one role');
        }
        user.roles = dto.roles;
        return user.save();
    }
    async createAdmin(email, password, name) {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const admin = new this.userModel({
            email,
            passwordHash,
            name,
            roles: [Role.Admin]
        });
        return admin.save();
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map
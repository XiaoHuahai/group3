import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      email: dto.email,
      passwordHash,
      name: dto.name
    });
    return created.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, (user as any).passwordHash);
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

    const roleStats: Record<string, number> = {};
    stats.forEach((stat: any) => {
      roleStats[stat._id] = stat.count;
    });

    return {
      total: totalUsers,
      byRole: roleStats
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  async updateRoles(userId: string, dto: UpdateUserRolesDto, adminId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查是否是管理员在操作
    const admin = await this.userModel.findById(adminId);
    if (!admin || !(admin as any).roles?.includes(Role.Admin)) {
      throw new BadRequestException('Only admins can update user roles');
    }

    // 确保至少有一个角色
    if (!dto.roles || dto.roles.length === 0) {
      throw new BadRequestException('User must have at least one role');
    }

    user.roles = dto.roles;
    return user.save();
  }

  async createAdmin(email: string, password: string, name?: string): Promise<User> {
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
}


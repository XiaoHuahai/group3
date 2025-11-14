import { Controller, Get, Patch, Param, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/roles')
  @Roles(Role.Admin)
  updateRoles(
    @Param('id') id: string,
    @Body() dto: UpdateUserRolesDto,
    @Request() req: any
  ) {
    return this.usersService.updateRoles(id, dto, req.user.userId);
  }
}


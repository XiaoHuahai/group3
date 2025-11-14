import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../common/enums/role.enum.js';

export class UpdateUserRolesDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles!: Role[];
}


import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email?: string;

  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'Phone number',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({
    enum: Role,
    example: 'CUSTOMER',
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: 'newPassword123',
    description: 'New password',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

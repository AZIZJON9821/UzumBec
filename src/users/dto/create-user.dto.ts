import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    enum: Role,
    example: 'CUSTOMER',
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

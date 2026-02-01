import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: '+998901234567' })
  phone: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  fullName?: string;

  @ApiProperty({ enum: Role, example: 'CUSTOMER' })
  role: Role;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-01-31T12:00:00Z' })
  createdAt: Date;
}

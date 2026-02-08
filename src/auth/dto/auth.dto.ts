import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  Length,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: "Telefon raqam noto'g'ri formatda" })
  phone?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email?: string;
}

export class VerifyOtpDto {
  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '1234', description: 'OTP code sent to phone/email' })
  @IsString()
  @Length(4, 6, { message: "Kod 4-6 xonali bo'lishi kerak" })
  otp: string;
}

export class RegisterDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsPhoneNumber('UZ', { message: "Telefon raqam noto'g'ri formatda" })
  phone: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email: string;

  // Agar kelajakda parol kerak bo'lsa
  @ApiPropertyOptional({
    example: 'admin_password',
    description: 'Optional password',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class LoginDto {
  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'admin_password', description: 'User password' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '1234', description: 'OTP code' })
  @IsString()
  @Length(4, 6)
  otp: string;

  @ApiProperty({ example: 'admin_password', description: 'New password' })
  @IsString()
  @Length(6, 50, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  newPassword: string;
}

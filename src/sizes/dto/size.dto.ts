import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
    @ApiProperty({ example: 'XL' })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateSizeDto extends CreateSizeDto { }

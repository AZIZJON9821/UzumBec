import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productVariantId: string;

    @ApiProperty({ required: false, default: false })
    @IsBoolean()
    @IsOptional()
    isMain?: boolean;
}

export class UpdateImageDto {
    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isMain?: boolean;
}

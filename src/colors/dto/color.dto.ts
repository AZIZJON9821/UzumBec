import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
    @ApiProperty({ example: 'Qora' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '#000000' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: 'Hex code valid formatda bo’lishi kerak (#RRGGBB)',
    })
    hexCode: string;
}

export class UpdateColorDto extends CreateColorDto { }

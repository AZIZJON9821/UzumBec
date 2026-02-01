import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    comment?: string;
}

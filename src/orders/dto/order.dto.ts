import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
    CLICK = 'CLICK',
    PAYME = 'PAYME',
    CASH = 'CASH',
}

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    addressId: string;

    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod: PaymentMethod;
}

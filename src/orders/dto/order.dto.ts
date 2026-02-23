import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
    CLICK = 'CLICK',
    PAYME = 'PAYME',
    CASH = 'CASH',
}

export enum DeliveryType {
    DELIVERY = 'DELIVERY',
    PICKUP = 'PICKUP',
}

export class CreateOrderDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    addressId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    pickupPointId?: string;

    @ApiProperty({ enum: DeliveryType, default: DeliveryType.DELIVERY })
    @IsEnum(DeliveryType)
    @IsOptional()
    deliveryType?: DeliveryType;

    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod: PaymentMethod;
}

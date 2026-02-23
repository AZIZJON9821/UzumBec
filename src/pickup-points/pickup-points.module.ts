import { Module } from '@nestjs/common';
import { PickupPointsService } from './pickup-points.service';
import { PickupPointsController } from './pickup-points.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [PickupPointsController],
    providers: [PickupPointsService],
    exports: [PickupPointsService],
})
export class PickupPointsModule { }

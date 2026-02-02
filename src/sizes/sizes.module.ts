import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { OdooModule } from '../odoo/odoo.module';

@Module({
    imports: [OdooModule],
    controllers: [SizesController],
    providers: [SizesService],
    exports: [SizesService],
})
export class SizesModule { }

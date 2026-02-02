import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { OdooModule } from '../odoo/odoo.module';

@Module({
    imports: [OdooModule],
    controllers: [ColorsController],
    providers: [ColorsService],
    exports: [ColorsService],
})
export class ColorsModule { }

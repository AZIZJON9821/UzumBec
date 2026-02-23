import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PickupPointsService } from './pickup-points.service';
import { CreatePickupPointDto } from './dto/create-pickup-point.dto';
import { UpdatePickupPointDto } from './dto/update-pickup-point.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('pickup-points')
@Controller('pickup-points')
export class PickupPointsController {
    constructor(private readonly pickupPointsService: PickupPointsService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new pickup point (Admin only)' })
    create(@Body() createPickupPointDto: CreatePickupPointDto) {
        return this.pickupPointsService.create(createPickupPointDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all pickup points' })
    findAll(@Query('isActive') isActive?: string) {
        const activeOnly = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.pickupPointsService.findAll(activeOnly);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a pickup point by ID' })
    findOne(@Param('id') id: string) {
        return this.pickupPointsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a pickup point (Admin only)' })
    update(
        @Param('id') id: string,
        @Body() updatePickupPointDto: UpdatePickupPointDto,
    ) {
        return this.pickupPointsService.update(id, updatePickupPointDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a pickup point (Admin only)' })
    remove(@Param('id') id: string) {
        return this.pickupPointsService.remove(id);
    }
}

import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { SupabaseService } from './supabase.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadController {
    constructor(private readonly supabaseService: SupabaseService) { }

    @Post('image')
    @ApiOperation({ summary: 'Rasm yuklash (Supabase)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit to prevent OOM
            },
        }),
    )
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({ fileType: 'image/(jpeg|jpg|png|webp|heic|heif)' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const result = await this.supabaseService.uploadImage(file);
        return {
            message: 'Rasm muvaffaqiyatli yuklandi',
            url: result.url,
        };
    }
}

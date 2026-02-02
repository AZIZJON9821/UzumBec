import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { SupabaseService } from './supabase.service';

@Module({
    controllers: [UploadController],
    providers: [SupabaseService],
})
export class UploadModule { }

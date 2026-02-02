import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('SUPABASE_URL or SUPABASE_KEY is missing in .env');
        }

        this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    }

    async uploadImage(file: Express.Multer.File) {
        const bucket = process.env.SUPABASE_BUCKET || 'uzum';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filePath = `${uniqueSuffix}${ext}`;

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(
                `Supabase upload error: ${error.message}`,
            );
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            url: publicUrlData.publicUrl,
            path: data.path,
        };
    }
}

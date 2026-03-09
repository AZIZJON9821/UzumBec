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

    async onModuleInit() {
        const bucket = process.env.SUPABASE_BUCKET || 'uzum';
        console.log(`Verifying Supabase bucket: ${bucket}...`);

        try {
            const { data, error } = await this.supabase.storage.getBucket(bucket);
            if (error) {
                console.error(`Supabase bucket error: ${error.message}`);
                console.error('Please make sure you have created the bucket in Supabase dashboard.');
            } else {
                console.log(`Supabase bucket "${bucket}" found and accessible.`);
            }
        } catch (err) {
            console.error('Unexpected error during Supabase bucket verification:', err);
        }
    }

    async uploadImage(file: Express.Multer.File) {
        const bucket = process.env.SUPABASE_BUCKET || 'uzum';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filePath = `${uniqueSuffix}${ext}`;

        console.log(`Uploading file to Supabase: ${filePath} in bucket: ${bucket}`);

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error details:', error);
            throw new InternalServerErrorException(
                `Supabase upload error [${error.name || 'Error'}]: ${error.message}. Bucket: ${bucket}`,
            );
        }

        if (!data) {
            throw new InternalServerErrorException('Supabase upload failed: No data returned from Supabase');
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

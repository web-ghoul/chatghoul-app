import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File, folder: string = 'chatghoul'): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed'));
                    resolve(result.secure_url);
                },
            );

            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const publicId = this.extractPublicId(imageUrl);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    private extractPublicId(imageUrl: string): string | null {
        // Matches /upload/v12345/folder/subfolder/filename.ext
        const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
        return matches ? matches[1] : null;
    }
}

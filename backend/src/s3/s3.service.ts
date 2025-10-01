import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.MINIO_BUCKET_NAME || 'small-step-for-earth';

        this.s3Client = new S3Client({
            region: process.env.MINIO_REGION_NAME || 'us-east-1',
            endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
            credentials: {
                accessKeyId: process.env.MINIO_ROOT_USER || 'minioadmin',
                secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin123',
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async uploadFile(file: any, folder = 'images'): Promise<string> {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
            const key = `${folder}/${fileName}`;

            // Upload to MinIO
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read', // Make files publicly accessible
            });

            await this.s3Client.send(command);

            // Return the public URL
            const baseUrl = process.env.MINIO_PUBLIC_URL || `http://localhost:9000/${this.bucketName}`;
            return `${baseUrl}/${key}`;
        } catch (error) {
            console.error('File upload error:', error);
            throw new Error('Failed to upload file');
        }
    }

    async getFile(folder: string, fileName: string): Promise<Buffer> {
        try {
            const key = `${folder}/${fileName}`;

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const response = await this.s3Client.send(command);

            if (!response.Body) {
                throw new Error('File not found');
            }

            // Convert stream to buffer
            const chunks: Uint8Array[] = [];
            const reader = response.Body.transformToByteArray();
            const buffer = await reader;
            return Buffer.from(buffer);
        } catch (error) {
            console.error('File read error:', error);
            throw new Error('Failed to read file');
        }
    }

    async getSignedUrl(folder: string, fileName: string, expiresIn = 3600): Promise<string> {
        try {
            const key = `${folder}/${fileName}`;

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
            return signedUrl;
        } catch (error) {
            console.error('Error generating signed URL:', error);
            throw new Error('Failed to generate signed URL');
        }
    }

    // Legacy methods for backward compatibility (return MinIO URLs)
    getFilePath(folder: string, fileName: string): string {
        const baseUrl = process.env.MINIO_PUBLIC_URL || `http://localhost:9000/${this.bucketName}`;
        return `${baseUrl}/${folder}/${fileName}`;
    }

    async fileExists(folder: string, fileName: string): Promise<boolean> {
        try {
            const key = `${folder}/${fileName}`;
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
            return true;
        } catch (error) {
            return false;
        }
    }
}
import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], // Export S3Service to make it available to other modules
})
export class S3Module {}

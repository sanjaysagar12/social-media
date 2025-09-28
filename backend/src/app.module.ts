import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, PostModule, S3Module],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

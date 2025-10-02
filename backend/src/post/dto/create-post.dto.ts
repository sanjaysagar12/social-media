import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsArray()
    images?: string[];
}
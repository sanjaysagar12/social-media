import { Controller, Get, Injectable, Logger, UseGuards, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Roles, Role } from 'src/application/common/decorator/roles.decorator';
import { JwtGuard } from '../application/common/guards/jwt.guard';
import { RolesGuard } from '../application/common/guards/roles.guard';
import { UserService } from './user.service';
import { GetUser } from 'src/application/common/decorator/get-user.decorator';
@Controller("api/user")


export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {
    
        
    }
    @Get('me')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async getUserMe(
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} requested profile information`);
        const data =  await this.userService.getUserMe(userId);
        return {
            status: 'success',
            data: data,
        };
    }

    @Get(':id')
    async getUserById(
        @Param('id') userId: string,
    ) {
        this.logger.log(`Fetching user profile for ID: ${userId}`);
        try {
            const data = await this.userService.getUserById(userId);
            return {
                status: 'success',
                data: data,
            };
        } catch (error) {
            if (error.message === 'User not found') {
                throw new HttpException({
                    status: 'error',
                    message: 'User not found',
                }, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
}

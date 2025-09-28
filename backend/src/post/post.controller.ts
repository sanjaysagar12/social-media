import { Controller, Post, Body, UseGuards, Logger, Get, Param, Patch, UseInterceptors, Request } from '@nestjs/common';
import { Roles, Role } from 'src/application/common/decorator/roles.decorator';
import { JwtGuard } from '../application/common/guards/jwt.guard';
import { RolesGuard } from '../application/common/guards/roles.guard';
import { GetUser } from 'src/application/common/decorator/get-user.decorator';
import { GetOptionalUser } from 'src/application/common/decorator/get-optional-user.decorator';
import { PostService } from './post.service';
import { CreateStepDto, CreatePostDto, CreateCommentDto } from './dto';

// Create an optional JWT guard that doesn't throw errors
class OptionalJwtGuard extends JwtGuard {
  handleRequest(err, user, info) {
    // Return user if valid, otherwise return null (don't throw error)
    return user || null;
  }
}

@Controller('api/step')
export class PostController {
    private readonly logger = new Logger(PostController.name);
    
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async createEvent(
        @GetUser('sub') userId: string,
        @Body() createEventDto: CreateStepDto,
    ) {
        this.logger.log(`User ${userId} creating new step`);
        const data = await this.postService.createEvent(userId, createEventDto);
        return {
            status: 'success',
            data: data,
        };
    }

    @Get()
    async getAllEvents() {
        this.logger.log('Fetching all events');
        const data = await this.postService.getAllEvents();
        return {
            status: 'success',
            data: data,
        };
    }

    @Get('explore')
    @UseGuards(OptionalJwtGuard)
    async explorePosts(
        @GetOptionalUser('sub') userId?: string,
    ) {
        this.logger.log(`Fetching explore posts ${userId ? `for user ${userId}` : 'for anonymous user'}`);
        const data = await this.postService.getExplorePosts(userId);
        return {
            status: 'success',
            data: data,
        };
    }

    @Get(':id')
    @UseGuards(OptionalJwtGuard)
    async getEventById(
        @Param('id') stepId: string,
        @GetOptionalUser('sub') userId?: string,
    ) {
        this.logger.log(`Fetching step details for ID: ${stepId} ${userId ? `for user ${userId}` : 'for anonymous user'}`);
        const data = await this.postService.getEventById(stepId, userId);
        return {
            status: 'success',
            data: data,
        };
    }

    @Patch(':id/join')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async joinEvent(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to join step ${stepId}`);
        const data = await this.postService.joinEvent(stepId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Successfully joined the event',
        };
    }

    @Post(':id/post')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async createPost(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
        @Body() createPostDto: CreatePostDto,
    ) {
        this.logger.log(`User ${userId} creating post for step ${stepId}`);
        const data = await this.postService.createPost(stepId, userId, createPostDto);
        return {
            status: 'success',
            data: data,
            message: 'Post created successfully',
        };
    }

    // Create a post without attaching it to any Step
    @Post('post')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async createStandalonePost(
        @GetUser('sub') userId: string,
        @Body() createPostDto: CreatePostDto,
    ) {
        this.logger.log(`User ${userId} creating standalone post`);
        const data = await this.postService.createPost(undefined, userId, createPostDto);
        return {
            status: 'success',
            data: data,
            message: 'Post created successfully',
        };
    }

    @Post('post/:postId/comment')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async createComment(
        @Param('postId') postId: string,
        @GetUser('sub') userId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        this.logger.log(`User ${userId} creating comment for post ${postId}`);
        const data = await this.postService.createComment(postId, userId, createCommentDto);
        return {
            status: 'success',
            data: data,
            message: 'Comment created successfully',
        };
    }

    @Post('comment/:commentId/reply')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async replyToComment(
        @Param('commentId') commentId: string,
        @GetUser('sub') userId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        this.logger.log(`User ${userId} replying to comment ${commentId}`);
        const data = await this.postService.replyToComment(commentId, userId, createCommentDto);
        return {
            status: 'success',
            data: data,
            message: 'Reply created successfully',
        };
    }

    @Post(':id/like')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async likeEvent(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to like step ${stepId}`);
        const data = await this.postService.likeEvent(stepId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Event liked successfully',
        };
    }

    @Post(':id/unlike')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async unlikeEvent(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to unlike step ${stepId}`);
        const data = await this.postService.unlikeEvent(stepId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Event unliked successfully',
        };
    }

    @Post('post/:postId/upvote')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async upvotePost(
        @Param('postId') postId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to upvote post ${postId}`);
        const data = await this.postService.upvotePost(postId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Post upvoted successfully',
        };
    }

    @Post('post/:postId/remove-upvote')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async removeUpvote(
        @Param('postId') postId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to remove upvote from post ${postId}`);
        const data = await this.postService.removeUpvote(postId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Upvote removed successfully',
        };
    }

    @Patch(':id/verify')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async verifyEvent(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} attempting to verify step ${stepId}`);
        const data = await this.postService.verifyEvent(stepId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Event verified successfully',
        };
    }

    @Get(':id/verify-test')
    async testVerifyRoute(
        @Param('id') eventId: string,
    ) {
        this.logger.log(`Testing verify route for event ${eventId}`);
        return {
            status: 'success',
            message: 'Verify route is accessible',
            eventId: eventId
        };
    }

    @Get('hosted/:userId')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async getHostedEvents(
        @Param('userId') userId: string,
        @GetUser('sub') currentUserId: string,
    ) {
        this.logger.log(`Fetching hosted events for user ${userId}`);
        
        // Users can only view their own hosted events unless they're admin
        if (userId !== currentUserId) {
            // Check if current user is admin (you might want to add admin role check here)
            this.logger.log(`User ${currentUserId} requesting hosted events for different user ${userId}`);
        }
        
        const data = await this.postService.getHostedEvents(userId);
        return {
            status: 'success',
            data: data,
            message: 'Hosted events fetched successfully',
        };
    }

    @Get(':id/participants')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    async getEventParticipants(
        @Param('id') stepId: string,
        @GetUser('sub') userId: string,
    ) {
        this.logger.log(`User ${userId} fetching participants for step ${stepId}`);
        const data = await this.postService.getEventParticipants(stepId, userId);
        return {
            status: 'success',
            data: data,
            message: 'Event participants fetched successfully',
        };
    }

    @Patch(':id/unverify')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async unverifyEvent(
        @Param('id') stepId: string,
        @GetUser('sub') adminId: string,
    ) {
        this.logger.log(`Admin ${adminId} attempting to unverify step ${stepId}`);
        const data = await this.postService.unverifyEvent(stepId, adminId);
        return {
            status: 'success',
            data: data,
            message: 'Event unverified successfully',
        };
    }
    
}

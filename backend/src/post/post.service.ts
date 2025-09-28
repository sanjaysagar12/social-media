import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStepDto, CreatePostDto, CreateCommentDto } from './dto';

@Injectable()
export class PostService {
    private readonly logger = new Logger(PostService.name);

    constructor(private prisma: PrismaService) {}
    
    async createEvent(userId: string, createEventDto: CreateStepDto) {
        return await this.prisma.step.create({
            data: {
                title: createEventDto.title,
                description: createEventDto.description,
                thumbnail: createEventDto.thumbnail,
                startDate: new Date(createEventDto.startDate),
                endDate: new Date(createEventDto.endDate),
                creatorId: userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                verified: true,
                startDate: true,
                endDate: true,
                isActive: true,
                createdAt: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }).then(event => {
            return event;
        }).catch(error => {
            console.error('Error creating step:', error);
            throw new Error('Failed to create step');
        });
    }

    async getAllEvents() {
        return await this.prisma.step.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                verified: true,
                startDate: true,
                endDate: true,
                isActive: true,
                createdAt: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        participants: true,
                        posts: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }).then(events => {
            return events;
        }).catch(error => {
            console.error('Error fetching events:', error);
            throw new Error('Failed to fetch events');
        });
    }

    async getExplorePosts(userId?: string) {
        return await this.prisma.post.findMany({
            select: {
                id: true,
                content: true,
                image: true,
                upvotes: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                step: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        verified: true,
                        isActive: true,
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                comments: {
                    where: {
                        parentId: null, // Only top-level comments
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                        replies: {
                            select: {
                                id: true,
                                content: true,
                                createdAt: true,
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatar: true,
                                    },
                                },
                                replies: {
                                    select: {
                                        id: true,
                                        content: true,
                                        createdAt: true,
                                        author: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: 'asc',
                                    },
                                },
                            },
                            orderBy: {
                                createdAt: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 3, // Limit to first 3 comments for explore feed
                },
                _count: {
                    select: {
                        comments: true,
                        userUpvotes: true,
                    },
                },
                userUpvotes: userId ? {
                    where: {
                        userId: userId,
                    },
                    select: {
                        id: true,
                    },
                } : false,
            },
            where: {
                OR: [
                    { step: { isActive: true } },
                    { step: null },
                ],
            },
            orderBy: [
                {
                    createdAt: 'desc',
                },
                {
                    userUpvotes: {
                        _count: 'desc', // Secondary sort by upvote count
                    },
                },
            ],
            take: 20, // Limit to 20 posts for pagination
        }).then(posts => {
            // Transform the data to include user interaction flags
            const transformedPosts = posts.map(post => ({
                ...post,
                isUpvotedByUser: userId ? post.userUpvotes.length > 0 : false,
                userUpvotes: undefined, // Remove the raw userUpvotes data
            }));

            return transformedPosts;
        }).catch(error => {
            console.error('Error fetching explore posts:', error);
            throw new Error('Failed to fetch explore posts');
        });
    }

    async getEventById(stepId: string, userId?: string) {
        return await this.prisma.step.findUnique({
            where: { id: stepId },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                verified: true,
                likes: true,
                startDate: true,
                endDate: true,
                isActive: true,
                createdAt: true,
                creator: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
                participants: { select: { id: true, name: true, email: true, avatar: true } },
                posts: {
                    select: {
                        id: true,
                        content: true,
                        image: true,
                        upvotes: true,
                        createdAt: true,
                        author: { select: { id: true, name: true, email: true, avatar: true } },
                        comments: {
                            where: { parentId: null },
                            select: {
                                id: true,
                                content: true,
                                createdAt: true,
                                author: { select: { id: true, name: true, email: true, avatar: true } },
                                replies: {
                                    select: {
                                        id: true,
                                        content: true,
                                        createdAt: true,
                                        author: { select: { id: true, name: true, email: true, avatar: true } },
                                        replies: {
                                            select: { id: true, content: true, createdAt: true, author: { select: { id: true, name: true, email: true, avatar: true } } },
                                            orderBy: { createdAt: 'asc' },
                                        },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                },
                            },
                            orderBy: { createdAt: 'desc' },
                        },
                        _count: { select: { comments: true, userUpvotes: true } },
                        userUpvotes: userId ? { where: { userId }, select: { id: true } } : false,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                userLikes: userId ? { where: { userId }, select: { id: true } } : false,
                _count: { select: { participants: true, posts: true, userLikes: true } },
            },
        }).then(step => {
            if (!step) throw new Error('Step not found');

            const transformed = {
                ...step,
                isLikedByUser: userId ? step.userLikes.length > 0 : false,
                posts: step.posts.map(post => ({
                    ...post,
                    isUpvotedByUser: userId ? post.userUpvotes.length > 0 : false,
                    userUpvotes: undefined,
                })),
                userLikes: undefined,
            };
            return transformed;
        }).catch(error => {
            console.error('Error fetching step:', error);
            if (error.message === 'Step not found') throw new Error('Step not found');
            throw new Error('Failed to fetch step');
        });
    }

    async joinEvent(stepId: string, userId: string) {
        // First, check if the step exists and get step details
        const event = await this.prisma.step.findUnique({
            where: { id: stepId },
            include: {
                creator: { select: { id: true } },
                participants: { select: { id: true } },
            },
        });

        if (!event) throw new Error('Step not found');

        // Check if user is the event creator (host)
        if (event.creator.id === userId) {
            throw new Error('Step host cannot join their own step');
        }

        // Check if user is already a participant
        const isAlreadyParticipant = event.participants.some(participant => participant.id === userId);
        if (isAlreadyParticipant) {
            throw new Error('You are already a participant in this event');
        }

        // Check if event is active
        if (!event.isActive) {
            throw new Error('Cannot join an inactive step');
        }

        // Check if event has not ended
        if (new Date() > event.endDate) {
            throw new Error('Cannot join a step that has already ended');
        }

        // Add user to participants
        return await this.prisma.step.update({
            where: { id: stepId },
            data: {
                participants: {
                    connect: { id: userId },
                },
            },
            select: {
                id: true,
                title: true,
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        participants: true,
                    },
                },
            },
        }).then(updatedEvent => {
            return {
                event: {
                    id: updatedEvent.id,
                    title: updatedEvent.title,
                    participantCount: updatedEvent._count.participants,
                },
                message: 'Successfully joined the event',
            };
        }).catch(error => {
            console.error('Error joining event:', error);
            throw new Error('Failed to join event');
        });
    }

    async createPost(stepId: string | undefined, userId: string, createPostDto: CreatePostDto) {
        // If stepId provided, enforce step participation rules
        if (stepId) {
            const step = await this.prisma.step.findUnique({
                where: { id: stepId },
                include: { creator: { select: { id: true } }, participants: { select: { id: true } } },
            });

            if (!step) throw new Error('Step not found');
            if (!step.isActive) throw new Error('Cannot post to an inactive step');

            const isCreator = step.creator.id === userId;
            const isParticipant = step.participants.some(p => p.id === userId);

            if (!isParticipant) {
                if (isCreator) throw new Error('Step creator must join the step to post');
                throw new Error('You must join the step to post');
            }
        }

        // Create the post (attach stepId only if provided)
        const data: any = {
            content: createPostDto.content,
            image: createPostDto.image,
            authorId: userId,
        };
        if (stepId) data.stepId = stepId;

        return await this.prisma.post.create({
            data,
            select: {
                id: true,
                content: true,
                image: true,
                upvotes: true,
                createdAt: true,
                author: { select: { id: true, name: true, email: true, avatar: true } },
                step: { select: { id: true, title: true } },
                _count: { select: { comments: true, userUpvotes: true } },
            },
        }).then(post => post).catch(error => {
            console.error('Error creating post:', error);
            throw new Error('Failed to create post');
        });
    }

    async createComment(postId: string, userId: string, createCommentDto: CreateCommentDto) {
        // First, check if the post exists and get post details with step info
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: { step: { include: { creator: { select: { id: true } }, participants: { select: { id: true } } } } },
        });

        if (!post) throw new Error('Post not found');

        // If the post is attached to a step, enforce step rules. If standalone, allow commenting.
        if (post.step) {
            if (!post.step.isActive) throw new Error('Cannot comment on posts in an inactive step');

            const isCreator = post.step.creator.id === userId;
            const isParticipant = post.step.participants.some(p => p.id === userId);
            if (!isParticipant && !isCreator) throw new Error('You must be a participant or creator to comment on this post');
        }

        // Create the comment
        return await this.prisma.comment.create({
            data: { content: createCommentDto.content, postId, authorId: userId },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: { id: true, name: true, email: true, avatar: true } },
                post: { select: { id: true, step: { select: { id: true, title: true } } } },
            },
        }).then(comment => comment).catch(error => {
            console.error('Error creating comment:', error);
            throw new Error('Failed to create comment');
        });
    }

    async replyToComment(commentId: string, userId: string, createCommentDto: CreateCommentDto) {
        // First, check if the parent comment exists and get post+step info
        const parentComment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { post: { include: { step: { include: { creator: { select: { id: true } }, participants: { select: { id: true } } } } } } },
        });

        if (!parentComment) throw new Error('Comment not found');

        if (parentComment.post.step) {
            if (!parentComment.post.step.isActive) throw new Error('Cannot reply to comments in an inactive step');

            const isCreator = parentComment.post.step.creator.id === userId;
            const isParticipant = parentComment.post.step.participants.some(p => p.id === userId);
            if (!isParticipant && !isCreator) throw new Error('You must be a participant or creator to reply to this comment');
        }

        // Create the reply comment
        return await this.prisma.comment.create({
            data: { content: createCommentDto.content, postId: parentComment.postId, authorId: userId, parentId: commentId },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: { id: true, name: true, email: true, avatar: true } },
                parent: { select: { id: true, author: { select: { name: true, email: true } } } },
                post: { select: { id: true, step: { select: { id: true, title: true } } } },
            },
        }).then(reply => reply).catch(error => {
            console.error('Error creating reply:', error);
            throw new Error('Failed to create reply');
        });
    }

    async likeEvent(eventId: string, userId: string) {
        // First, check if the event exists
    const event = await this.prisma.step.findUnique({ where: { id: eventId } });

        if (!event) {
            throw new Error('Event not found');
        }

        // Check if user already liked this event
        const existingLike = await this.prisma.stepLike.findUnique({
            where: {
                userId_stepId: {
                    userId: userId,
                    stepId: eventId,
                },
            },
        });

        if (existingLike) {
            throw new Error('You have already liked this event');
        }

        // Create the like
    return await this.prisma.stepLike.create({
            data: {
                userId: userId,
                stepId: eventId,
            },
            select: {
                id: true,
                createdAt: true,
                step: { select: { id: true, title: true, _count: { select: { userLikes: true } } } },
            },
        }).then(like => {
            return {
                event: {
          id: like.step.id,
          title: like.step.title,
          likesCount: like.step._count.userLikes,
                },
                message: 'Event liked successfully',
            };
        }).catch(error => {
            console.error('Error liking event:', error);
            throw new Error('Failed to like event');
        });
    }

    async unlikeEvent(eventId: string, userId: string) {
        // Check if user has liked this event
    const existingLike = await this.prisma.stepLike.findUnique({
            where: {
                userId_stepId: {
                    userId: userId,
                    stepId: eventId,
                },
            },
        });

        if (!existingLike) {
            throw new Error('You have not liked this event');
        }

        // Remove the like
    return await this.prisma.stepLike.delete({
            where: {
                userId_stepId: {
                    userId: userId,
                    stepId: eventId,
                },
            },
            select: {
                step: { select: { id: true, title: true, _count: { select: { userLikes: true } } } },
            },
        }).then(deletedLike => {
            return {
                event: {
                    id: deletedLike.step.id,
                    title: deletedLike.step.title,
                    likesCount: deletedLike.step._count.userLikes,
                },
                message: 'Event unliked successfully',
            };
        }).catch(error => {
            console.error('Error unliking event:', error);
            throw new Error('Failed to unlike event');
        });
    }

    async upvotePost(postId: string, userId: string) {
    // First, check if the post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { step: { include: { creator: { select: { id: true } }, participants: { select: { id: true } } } } },
    });

        if (!post) {
            throw new Error('Post not found');
        }

    // If post attached to a step, check if user is either the creator or a participant
    if (post.step) {
      const isCreator = post.step.creator.id === userId;
      const isParticipant = post.step.participants.some(participant => participant.id === userId);
      if (!isParticipant && !isCreator) throw new Error('You must be a participant or creator to upvote posts in this step');
    }

        // Check if user already upvoted this post
        const existingUpvote = await this.prisma.upvote.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (existingUpvote) {
            throw new Error('You have already upvoted this post');
        }

        // Create the upvote
        return await this.prisma.upvote.create({
            data: {
                userId: userId,
                postId: postId,
            },
            select: {
                id: true,
                createdAt: true,
                post: {
                    select: {
                        id: true,
                        content: true,
                        _count: {
                            select: {
                                userUpvotes: true,
                            },
                        },
                    },
                },
            },
        }).then(upvote => {
            return {
                post: {
                    id: upvote.post.id,
                    upvotesCount: upvote.post._count.userUpvotes,
                },
                message: 'Post upvoted successfully',
            };
        }).catch(error => {
            console.error('Error upvoting post:', error);
            throw new Error('Failed to upvote post');
        });
    }

    async removeUpvote(postId: string, userId: string) {
        // Check if user has upvoted this post
        const existingUpvote = await this.prisma.upvote.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (!existingUpvote) {
            throw new Error('You have not upvoted this post');
        }

        // Remove the upvote
        return await this.prisma.upvote.delete({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
            select: {
                post: {
                    select: {
                        id: true,
                        content: true,
                        _count: {
                            select: {
                                userUpvotes: true,
                            },
                        },
                    },
                },
            },
        }).then(deletedUpvote => {
            return {
                post: {
                    id: deletedUpvote.post.id,
                    upvotesCount: deletedUpvote.post._count.userUpvotes,
                },
                message: 'Upvote removed successfully',
            };
        }).catch(error => {
            console.error('Error removing upvote:', error);
            throw new Error('Failed to remove upvote');
        });
    }

    /**
   * Verify an event (Event host or Admin only)
   */
  async verifyEvent(eventId: string, userId: string) {
    try {
      // Check if step exists
      const step = await this.prisma.step.findUnique({ where: { id: eventId }, include: { creator: { select: { id: true } } } });
      if (!step) throw new Error('Step not found');
      if (step.creator.id !== userId) throw new Error('Only step hosts can verify their steps');
      if (step.verified) throw new Error('Step is already verified');

      const updated = await this.prisma.step.update({ where: { id: eventId }, data: { verified: true, updatedAt: new Date() }, include: { creator: { select: { id: true, name: true, email: true, avatar: true } }, _count: { select: { participants: true, posts: true, userLikes: true } } } });
      this.logger.log(`Step ${eventId} verified by host ${userId}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to verify step ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Remove verification from an event (Admin only)
   */
  async unverifyEvent(eventId: string, adminId: string) {
    try {
      const step = await this.prisma.step.findUnique({ where: { id: eventId }, include: { creator: { select: { id: true } } } });
      if (!step) throw new Error('Step not found');
      const updated = await this.prisma.step.update({ where: { id: eventId }, data: { verified: false, updatedAt: new Date() }, include: { creator: { select: { id: true, name: true, email: true, avatar: true } }, _count: { select: { participants: true, posts: true, userLikes: true } } } });
      this.logger.log(`Step ${eventId} unverified by admin ${adminId}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to unverify step ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get all events hosted by a specific user
   */
  async getHostedEvents(userId: string) {
    try {
      const hosted = await this.prisma.step.findMany({ where: { creatorId: userId }, select: { id: true, title: true, description: true, thumbnail: true, verified: true, startDate: true, endDate: true, isActive: true, likes: true, createdAt: true, updatedAt: true, creator: { select: { id: true, name: true, email: true, avatar: true } }, _count: { select: { participants: true, posts: true, userLikes: true } } }, orderBy: { createdAt: 'desc' } });
      this.logger.log(`Found ${hosted.length} hosted steps for user ${userId}`);
      return hosted;
    } catch (error) {
      this.logger.error(`Failed to fetch hosted steps for user ${userId}:`, error);
      throw new Error('Failed to fetch hosted steps');
    }
  }

  /**
   * Get all participants of a specific event
   */
  async getEventParticipants(eventId: string, requesterId: string) {
    try {
      const step = await this.prisma.step.findUnique({ where: { id: eventId }, select: { id: true, title: true, isActive: true, verified: true, endDate: true, creatorId: true, creator: { select: { id: true, name: true, email: true } }, participants: { select: { id: true, name: true, email: true, avatar: true, createdAt: true }, orderBy: { createdAt: 'asc' } }, _count: { select: { participants: true } } } });
      if (!step) throw new Error('Step not found');

      const isHost = step.creatorId === requesterId;
      const isParticipant = step.participants.some(p => p.id === requesterId);
      if (!isHost && !isParticipant) throw new Error('You must be the step host or a participant to view participants');

      const sanitized = step.participants.map(p => ({ id: p.id, name: p.name, email: isHost ? p.email : undefined, avatar: p.avatar, createdAt: p.createdAt }));

      this.logger.log(`Returning ${step.participants.length} participants for step ${eventId} to user ${requesterId}`);
      return { event: { id: step.id, title: step.title, totalParticipants: step._count.participants, isActive: step.isActive, verified: step.verified, endDate: step.endDate, creator: step.creator }, participants: sanitized };
    } catch (error) {
      this.logger.error(`Failed to fetch participants for step ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Select winner for an event and distribute prize to their wallet
   */
  async selectWinner(eventId: string, hostId: string, winnerId: string) {
    throw new Error('Winner selection and prize distribution have been removed from the system');
  }
}

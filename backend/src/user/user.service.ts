import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async getUserMe(userId: string) {
        return await this.prisma.user.findUnique({
            where: {
                id: userId, 
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                walletAddress: true,
                
                // Steps created by user (hosted steps)
                createdSteps: {
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
                        _count: { select: { participants: true, posts: true, userLikes: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                
                // Steps joined by user
                joinedSteps: {
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
                        creator: { select: { id: true, name: true, email: true, avatar: true } },
                        _count: { select: { participants: true, posts: true, userLikes: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                
                // (No won steps relation in schema)
                
                // Posts created by user
                posts: {
                    select: {
                        id: true,
                        content: true,
                        image: true,
                        upvotes: true,
                        createdAt: true,
                        step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true } },
                        _count: {
                            select: {
                                comments: true,
                                userUpvotes: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10, // Limit to recent 10 posts
                },
                
                // Comments created by user
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        post: {
                            select: {
                                id: true,
                                content: true,
                                step: { select: { id: true, title: true, isActive: true } },
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        parent: {
                            select: {
                                id: true,
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10, // Limit to recent 10 comments
                },
                
                // Upvotes given by user
                upvotes: {
                    select: {
                        id: true,
                        createdAt: true,
                        post: {
                            select: {
                                id: true,
                                content: true,
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                                step: { select: { id: true, title: true, isActive: true } },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10, // Limit to recent 10 upvotes
                },
                
                // Step likes given by user
                stepLikes: {
                    select: {
                        id: true,
                        createdAt: true,
                        step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true, creator: { select: { id: true, name: true, email: true } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                
                // Wallet and transactions removed from schema; skip those fields
            },
        }).then(user => {
            if (!user) {
                console.error('User not found with ID:', userId);
                throw new Error('User not found');
            }

            // Normalize fields to expected names
            const created = (user as any).createdSteps || [];
            const joined = (user as any).joinedSteps || [];
            const won = [];
            const posts = (user as any).posts || [];
            const comments = (user as any).comments || [];
            const upvotes = (user as any).upvotes || [];
            const eventLikes = (user as any).stepLikes || [];

            const stats = {
                totalStepsHosted: created.length,
                totalStepsJoined: joined.length,
                totalEventsWon: won.length,
                totalPosts: posts.length,
                totalComments: comments.length,
                totalUpvotesGiven: upvotes.length,
                totalEventLikes: eventLikes.length,
                totalUpvotesReceived: posts.reduce((sum, post) => sum + ((post._count && post._count.userUpvotes) || 0), 0),
            };

            return { ...user, stats };
        }).catch(error => {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        });
    }

    async getUserById(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    walletAddress: true,

                    // Steps created by user (hosted steps)
                    createdSteps: {
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
                            _count: { select: { participants: true, posts: true, userLikes: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    },

                    // Steps joined by user
                    joinedSteps: {
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
                            creator: { select: { id: true, name: true, email: true, avatar: true } },
                            _count: { select: { participants: true, posts: true, userLikes: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    },

                    // Posts created by user
                    posts: {
                        select: {
                            id: true,
                            content: true,
                            image: true,
                            upvotes: true,
                            createdAt: true,
                            step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true } },
                            _count: {
                                select: {
                                    comments: true,
                                    userUpvotes: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 posts
                    },

                    // Comments created by user
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            post: {
                                select: {
                                    id: true,
                                    content: true,
                                    step: { select: { id: true, title: true, isActive: true } },
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            parent: {
                                select: {
                                    id: true,
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 comments
                    },

                    // Upvotes given by user
                    upvotes: {
                        select: {
                            id: true,
                            createdAt: true,
                            post: {
                                select: {
                                    id: true,
                                    content: true,
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                    step: { select: { id: true, title: true, isActive: true } },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 upvotes
                    },

                    // Step likes given by user
                    stepLikes: {
                        select: {
                            id: true,
                            createdAt: true,
                            step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true, creator: { select: { id: true, name: true, email: true } } } },
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Normalize fields to expected names
            const created = (user as any).createdSteps || [];
            const joined = (user as any).joinedSteps || [];
            const won = [];
            const posts = (user as any).posts || [];
            const comments = (user as any).comments || [];
            const upvotes = (user as any).upvotes || [];
            const eventLikes = (user as any).stepLikes || [];

            const stats = {
                totalEventsHosted: created.length,
                totalEventsJoined: joined.length,
                totalEventsWon: won.length,
                totalPosts: posts.length,
                totalComments: comments.length,
                totalUpvotesGiven: upvotes.length,
                totalEventLikes: eventLikes.length,
                totalUpvotesReceived: posts.reduce((sum, post) => sum + ((post._count && post._count.userUpvotes) || 0), 0),
            };

            return { ...user, stats };
        } catch (error) {
            if (error.message === 'User not found') {
                // Don't log "User not found" as an error since it's expected behavior
                throw new Error('User not found');
            }
            console.error('Error fetching user by ID:', error);
            throw new Error('Failed to fetch user');
        }
    }

    async getUserByUsername(username: string) {
        try {
            // Reconstruct email from username (username@gmail.com)
            const email = `${username}@gmail.com`;

            const user = await this.prisma.user.findUnique({
                where: {
                    email: email,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    walletAddress: true,

                    // Steps created by user (hosted steps)
                    createdSteps: {
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
                            _count: { select: { participants: true, posts: true, userLikes: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    },

                    // Steps joined by user
                    joinedSteps: {
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
                            creator: { select: { id: true, name: true, email: true, avatar: true } },
                            _count: { select: { participants: true, posts: true, userLikes: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    },

                    // Posts created by user
                    posts: {
                        select: {
                            id: true,
                            content: true,
                            image: true,
                            upvotes: true,
                            createdAt: true,
                            step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true } },
                            _count: {
                                select: {
                                    comments: true,
                                    userUpvotes: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 posts
                    },

                    // Comments created by user
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            post: {
                                select: {
                                    id: true,
                                    content: true,
                                    step: { select: { id: true, title: true, isActive: true } },
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            parent: {
                                select: {
                                    id: true,
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 comments
                    },

                    // Upvotes given by user
                    upvotes: {
                        select: {
                            id: true,
                            createdAt: true,
                            post: {
                                select: {
                                    id: true,
                                    content: true,
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                    step: { select: { id: true, title: true, isActive: true } },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 10, // Limit to recent 10 upvotes
                    },

                    // Step likes given by user
                    stepLikes: {
                        select: {
                            id: true,
                            createdAt: true,
                            step: { select: { id: true, title: true, thumbnail: true, verified: true, isActive: true, creator: { select: { id: true, name: true, email: true } } } },
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Normalize fields to expected names
            const created = (user as any).createdSteps || [];
            const joined = (user as any).joinedSteps || [];
            const won = [];
            const posts = (user as any).posts || [];
            const comments = (user as any).comments || [];
            const upvotes = (user as any).upvotes || [];
            const eventLikes = (user as any).stepLikes || [];

            const stats = {
                totalStepsHosted: created.length,
                totalStepsJoined: joined.length,
                totalStepsWon: won.length,
                totalPosts: posts.length,
                totalComments: comments.length,
                totalUpvotesGiven: upvotes.length,
                totalStepLikes: eventLikes.length,
                totalUpvotesReceived: posts.reduce((sum, post) => sum + ((post._count && post._count.userUpvotes) || 0), 0),
            };

            return { ...user, stats };
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw new Error('User not found');
        }
    }
}

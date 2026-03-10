import type { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

export type Post = PrismaPost;

export type User = Omit<PrismaUser, 'password'>;

export type UserWithPassword = PrismaUser;

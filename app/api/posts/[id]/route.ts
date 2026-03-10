import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: Request, context: RouteContext) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    try {
        const { id } = await context.params;
        
        const post = await prisma.post.findUnique({
            where: { id }
        });
        
        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, context: RouteContext) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    try {
        const { id } = await context.params;
        const { title, content, author, date, category, image } = await request.json();
        
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                author,
                date,
                category,
                image,
            }
        });
        
        return NextResponse.json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    try {
        const { id } = await context.params;
        
        await prisma.post.delete({
            where: { id }
        });
        
        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}

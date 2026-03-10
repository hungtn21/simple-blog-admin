import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostById } from "@/lib/postsData";

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
    
    const { id } = await context.params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
        return NextResponse.json(
            { success: false, error: 'Invalid post ID' },
            { status: 400 }
        );
    }
    
    const post = getPostById(postId);
    
    if (!post) {
        return NextResponse.json(
            { success: false, error: 'Post not found' },
            { status: 404 }
        );
    }
    
    return NextResponse.json({ success: true, data: post });
}

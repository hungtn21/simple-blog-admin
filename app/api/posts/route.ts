import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPosts, addPost } from "@/lib/postsData";

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    const posts = getPosts();
    return NextResponse.json({ success: true, data: posts });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    try {
        const { title, content, author, date, category, image } = await request.json();
        
        const newPost = addPost({
            title,
            content,
            author,
            date,
            category,
            image
        });
        
        return NextResponse.json({ success: true, data: newPost }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create post' },
            { status: 500 }
        );
    }
}

import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PostsList from "@/app/components/PostsList/PostsList";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "All Blog Posts",
        description: "Browse and manage all your blog posts. View, edit, and create new content for your blog.",
        openGraph: {
            title: "All Blog Posts | Simple Blog Admin",
            description: "Browse and manage all your blog posts",
            type: "website",
        },
    };
}

export default async function PostPage() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect('/login');
    }

    // Fetch posts on the server
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <PostsList posts={posts} />;
}

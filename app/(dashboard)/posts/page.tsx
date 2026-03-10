import Link from "next/link";
import Postcard from "@/app/components/Postcard/Postcard";
import { Plus } from 'lucide-react';
import { getPosts, Post } from "@/lib/postsData";
export default async function PostPage() {
    const posts: Post[] = await getPosts();
    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">All Blog Posts</h1>
                <Link 
                    href="/posts/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Create New Post
                </Link>
            </div>
            <div className="space-y-4">
                {posts.map(post => (
                    <Link 
                        key={post.id} 
                        href={`/posts/${post.id}`} 
                        className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <Postcard post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );  
}

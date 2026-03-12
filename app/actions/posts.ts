'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PostFormState = {
  success: boolean;
  message?: string;
  errors?: {
    title?: string[];
    content?: string[];
    author?: string[];
    category?: string[];
    image?: string[];
  };
};

export async function createPostAction(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      success: false,
      message: 'Unauthorized. Please log in to create a post.',
    };
  }

  // Extract form data
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const image = formData.get('image') as string;

  // Validate fields
  const errors: PostFormState['errors'] = {};
  
  if (!title || title.trim().length === 0) {
    errors.title = ['Title is required'];
  } else if (title.trim().length < 3) {
    errors.title = ['Title must be at least 3 characters'];
  }

  if (!content || content.trim().length === 0) {
    errors.content = ['Content is required'];
  } else if (content.trim().length < 10) {
    errors.content = ['Content must be at least 10 characters'];
  }

  if (!author || author.trim().length === 0) {
    errors.author = ['Author is required'];
  }

  if (!category || category.trim().length === 0) {
    errors.category = ['Category is required'];
  }

  if (!image || image.trim().length === 0) {
    errors.image = ['Image URL is required'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        date: new Date().toISOString().split('T')[0],
        category: category.trim(),
        image: image.trim(),
        published: true,
        authorId: null,
      },
    });

    // Revalidate the posts page to show the new post
    revalidatePath('/[locale]/(dashboard)/posts', 'page');
    
    return {
      success: true,
      message: 'Post created successfully',
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      message: 'Failed to create post. Please try again.',
    };
  }
}

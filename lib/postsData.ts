import fs from 'fs';
import path from 'path';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

export function getPosts(): Post[] {
  try {
    const fileContents = fs.readFileSync(postsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function savePosts(posts: Post[]): void {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving posts:', error);
    throw new Error('Failed to save posts');
  }
}

export function getPostById(id: number): Post | undefined {
  const posts = getPosts();
  return posts.find(post => post.id === id);
}

export function addPost(newPost: Omit<Post, 'id'>): Post {
  const posts = getPosts();
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
  
  const post: Post = {
    id: maxId + 1,
    ...newPost,
  };
  
  posts.push(post);
  savePosts(posts);
  
  return post;
}

export function updatePost(id: number, updatedData: Partial<Post>): Post | null {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  posts[index] = { ...posts[index], ...updatedData, id };
  savePosts(posts);
  
  return posts[index];
}

export function deletePost(id: number): boolean {
  const posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    return false;
  }
  
  savePosts(filteredPosts);
  return true;
}

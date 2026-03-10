/**
 * @jest-environment node
 */

import { GET, POST } from './route';
import { getServerSession } from 'next-auth';
import { getPosts, addPost } from '@/lib/postsData';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/postsData');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetPosts = getPosts as jest.MockedFunction<typeof getPosts>;
const mockAddPost = addPost as jest.MockedFunction<typeof addPost>;

describe('API Route: /api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        success: false,
        error: 'Unauthorized',
      });
    });

    it('returns posts with correct format when authenticated', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          author: 'Test Author',
          date: '2026-03-10',
          category: 'Test',
          image: 'https://picsum.photos/200',
        },
        {
          id: 2,
          title: 'Second Post',
          content: 'Second Content',
          author: 'Another Author',
          date: '2026-03-09',
          category: 'Tech',
          image: 'https://picsum.photos/201',
        },
      ];

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockGetPosts.mockReturnValue(mockPosts);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockPosts,
      });
      expect(mockGetPosts).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no posts exist', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockGetPosts.mockReturnValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: [],
      });
    });

    it('returns data with correct structure', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          author: 'Test Author',
          date: '2026-03-10',
          category: 'Test',
          image: 'https://picsum.photos/200',
        },
      ];

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockGetPosts.mockReturnValue(mockPosts);

      const response = await GET();
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      
      if (data.data.length > 0) {
        const post = data.data[0];
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('content');
        expect(post).toHaveProperty('author');
        expect(post).toHaveProperty('date');
        expect(post).toHaveProperty('category');
        expect(post).toHaveProperty('image');
      }
    });
  });

  describe('POST /api/posts', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      } as unknown as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        success: false,
        error: 'Unauthorized',
      });
    });

    it('creates a new post with correct data when authenticated', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };
      const newPostData = {
        title: 'New Post',
        content: 'New Content',
        author: 'New Author',
        date: '2026-03-10',
        category: 'New Category',
        image: 'https://picsum.photos/202',
      };
      const createdPost = { id: 3, ...newPostData };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockAddPost.mockReturnValue(createdPost);

      const mockRequest = {
        json: jest.fn().mockResolvedValue(newPostData),
      } as unknown as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        success: true,
        data: createdPost,
      });
      expect(mockAddPost).toHaveBeenCalledWith(newPostData);
    });

    it('returns 500 when post creation fails', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockAddPost.mockImplementation(() => {
        throw new Error('Database error');
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          title: 'Test',
          content: 'Test',
          author: 'Test',
          date: '2026-03-10',
          category: 'Test',
          image: 'https://picsum.photos/200',
        }),
      } as unknown as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Failed to create post',
      });
    });

    it('handles invalid JSON in request body', async () => {
      const mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2026-12-31',
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Failed to create post',
      });
    });
  });
});

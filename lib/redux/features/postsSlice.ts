import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '@/types/prisma';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error || 'Failed to fetch posts');
      }
      
      return data.data as Post[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error || 'Failed to fetch post');
      }
      
      return data.data as Post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: { 
    title: string; 
    content: string; 
    author: string; 
    category: string; 
    image: string; 
    date: string;
    published?: boolean;
    authorId?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          published: postData.published ?? true,
          authorId: postData.authorId ?? null,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error || 'Failed to create post');
      }
      
      return data.data as Post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, ...postData }: Partial<Post> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error || 'Failed to update post');
      }
      
      return data.data as Post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error || 'Failed to delete post');
      }
      
      return postId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete post');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updatePost.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.updateLoading = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;

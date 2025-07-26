import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityService } from '../../services/api/communityService';

// Async thunks
export const fetchCommunityPosts = createAsyncThunk(
  'community/fetchPosts',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await communityService.getPosts(page);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await communityService.createPost(postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await communityService.likePost(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await communityService.addComment(postId, comment);
      return { postId, comment: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  currentPage: 1,
  hasMorePosts: true,
  supportGroups: [
    {
      id: 'pcos',
      name: 'PCOS Support',
      description: 'Support for those with PCOS',
      memberCount: 1250,
      isJoined: false,
    },
    {
      id: 'endometriosis',
      name: 'Endometriosis Warriors',
      description: 'Support for endometriosis management',
      memberCount: 890,
      isJoined: false,
    },
    {
      id: 'irregular-cycles',
      name: 'Irregular Cycles',
      description: 'Support for irregular menstrual cycles',
      memberCount: 567,
      isJoined: false,
    },
    {
      id: 'general',
      name: 'General Support',
      description: 'General menstrual health discussion',
      memberCount: 2340,
      isJoined: true,
    },
  ],
  userInteractions: {
    likedPosts: [],
    commentedPosts: [],
    reportedPosts: [],
  },
  postingSettings: {
    anonymous: true,
    allowComments: true,
    shareWithGroups: ['general'],
  },
  isLoading: false,
  isPosting: false,
  error: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setAnonymousPosting: (state, action) => {
      state.postingSettings.anonymous = action.payload;
    },
    setAllowComments: (state, action) => {
      state.postingSettings.allowComments = action.payload;
    },
    updateShareWithGroups: (state, action) => {
      state.postingSettings.shareWithGroups = action.payload;
    },
    joinSupportGroup: (state, action) => {
      const groupId = action.payload;
      const group = state.supportGroups.find(g => g.id === groupId);
      if (group) {
        group.isJoined = true;
        group.memberCount += 1;
      }
    },
    leaveSupportGroup: (state, action) => {
      const groupId = action.payload;
      const group = state.supportGroups.find(g => g.id === groupId);
      if (group && group.isJoined) {
        group.isJoined = false;
        group.memberCount -= 1;
      }
    },
    reportPost: (state, action) => {
      const postId = action.payload;
      if (!state.userInteractions.reportedPosts.includes(postId)) {
        state.userInteractions.reportedPosts.push(postId);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMorePosts = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch community posts
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, hasMore, page } = action.payload;
        
        if (page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.currentPage = page;
        state.hasMorePosts = hasMore;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isPosting = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isPosting = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.payload;
      })
      // Like post
      .addCase(likePost.pending, (state) => {
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        
        if (post) {
          post.liked = liked;
          post.likeCount = likeCount;
        }
        
        if (liked && !state.userInteractions.likedPosts.includes(postId)) {
          state.userInteractions.likedPosts.push(postId);
        } else if (!liked) {
          state.userInteractions.likedPosts = state.userInteractions.likedPosts.filter(id => id !== postId);
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        
        if (post) {
          if (!post.comments) {
            post.comments = [];
          }
          post.comments.push(comment);
          post.commentCount = (post.commentCount || 0) + 1;
        }
        
        if (!state.userInteractions.commentedPosts.includes(postId)) {
          state.userInteractions.commentedPosts.push(postId);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setAnonymousPosting,
  setAllowComments,
  updateShareWithGroups,
  joinSupportGroup,
  leaveSupportGroup,
  reportPost,
  clearError,
  resetPosts,
} = communitySlice.actions;

export default communitySlice.reducer;
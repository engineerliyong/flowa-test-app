// src/services/api/communityService.js
import { apiClient } from './apiClient';

export const communityService = {
  // Posts
  async getPosts(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/community/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  async createPost(postData) {
    try {
      const response = await apiClient.post('/community/posts', {
        content: postData.content,
        tags: postData.tags,
        isAnonymous: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  async likePost(postId) {
    try {
      const response = await apiClient.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like post');
    }
  },

  async unlikePost(postId) {
    try {
      const response = await apiClient.delete(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike post');
    }
  },

  async reportPost(postId, reason) {
    try {
      const response = await apiClient.post(`/community/posts/${postId}/report`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to report post');
    }
  },

  async getPostComments(postId, page = 1) {
    try {
      const response = await apiClient.get(`/community/posts/${postId}/comments?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  async addComment(postId, content) {
    try {
      const response = await apiClient.post(`/community/posts/${postId}/comments`, {
        content
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  // Support Groups
  async getSupportGroups() {
    try {
      const response = await apiClient.get('/community/support-groups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch support groups');
    }
  },

  async getSupportGroup(groupId) {
    try {
      const response = await apiClient.get(`/community/support-groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch support group');
    }
  },

  async joinSupportGroup(groupId) {
    try {
      const response = await apiClient.post(`/community/support-groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join support group');
    }
  },

  async leaveSupportGroup(groupId) {
    try {
      const response = await apiClient.post(`/community/support-groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to leave support group');
    }
  },

  async getGroupPosts(groupId, page = 1) {
    try {
      const response = await apiClient.get(`/community/support-groups/${groupId}/posts?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group posts');
    }
  },

  async getGroupEvents(groupId) {
    try {
      const response = await apiClient.get(`/community/support-groups/${groupId}/events`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group events');
    }
  },

  async joinGroupEvent(eventId) {
    try {
      const response = await apiClient.post(`/community/events/${eventId}/join`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join event');
    }
  },

  // AI Listener
  async sendMessageToAI(message, conversationId = null) {
    try {
      const response = await apiClient.post('/ai/chat', {
        message,
        conversationId,
        context: 'community_support'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message to AI');
    }
  },

  async createAIConversation() {
    try {
      const response = await apiClient.post('/ai/conversations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create AI conversation');
    }
  },

  async getAIConversation(conversationId) {
    try {
      const response = await apiClient.get(`/ai/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch AI conversation');
    }
  },

  // Resources
  async getResources(category = null) {
    try {
      const url = category ? `/community/resources?category=${category}` : '/community/resources';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resources');
    }
  },

  async getResource(resourceId) {
    try {
      const response = await apiClient.get(`/community/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resource');
    }
  },

  // Search
  async searchPosts(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      const response = await apiClient.get(`/community/search/posts?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search posts');
    }
  },

  async getTrendingTags() {
    try {
      const response = await apiClient.get('/community/trending-tags');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trending tags');
    }
  }
};
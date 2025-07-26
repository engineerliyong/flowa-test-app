// src/components/community/CommunityFeed.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';

export const CommunityFeed = ({ posts = [] }) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now - postTime;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleReport = (postId) => {
    Alert.alert(
      "Report Post",
      "Why are you reporting this post?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Inappropriate Content", onPress: () => console.log('Reported:', postId) },
        { text: "Spam", onPress: () => console.log('Reported:', postId) },
        { text: "Harassment", onPress: () => console.log('Reported:', postId) },
      ]
    );
  };

  const renderPost = ({ item: post }) => (
    <View style={[globalStyles.card, styles.postCard]}>
      {/* Post Header */}
      <View style={[globalStyles.flexRow, globalStyles.spaceBetween, { marginBottom: 12 }]}>
        <View style={globalStyles.flexRow}>
          <View style={styles.anonymousAvatar}>
            <Ionicons name="person" size={16} color={colors.white} />
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={[globalStyles.bodySmall, { fontWeight: '600' }]}>
              Anonymous
            </Text>
            <Text style={[globalStyles.caption, { color: colors.textSecondary }]}>
              {formatTimeAgo(post.timestamp)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => handleReport(post.id)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={[globalStyles.body, { marginBottom: 12, lineHeight: 22 }]}>
        {post.content}
      </Text>

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={[globalStyles.flexRow, { marginBottom: 12, flexWrap: 'wrap' }]}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View style={[globalStyles.flexRow, globalStyles.spaceBetween, { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.lightGray }]}>
        <View style={globalStyles.flexRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(post.id)}
          >
            <Ionicons 
              name={likedPosts.has(post.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={likedPosts.has(post.id) ? colors.error : colors.gray} 
            />
            <Text style={[styles.actionText, { 
              color: likedPosts.has(post.id) ? colors.error : colors.gray 
            }]}>
              {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.gray} />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleSave(post.id)}>
          <Ionicons 
            name={savedPosts.has(post.id) ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={savedPosts.has(post.id) ? colors.primary : colors.gray} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={48} color={colors.gray} />
      <Text style={[globalStyles.h6, { marginTop: 16, marginBottom: 8 }]}>
        No posts yet
      </Text>
      <Text style={[globalStyles.body, { color: colors.textSecondary, textAlign: 'center' }]}>
        Be the first to share your thoughts with the community
      </Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={posts.length === 0 ? { flex: 1 } : {}}
    />
  );
};

const styles = {
  postCard: {
    marginBottom: 16,
  },
  anonymousAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.gray,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
};
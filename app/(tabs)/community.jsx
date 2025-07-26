import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';
import { CommunityFeed } from '../../src/components/community/CommunityFeed';
import { fetchCommunityPosts } from '../../src/store/slices/communitySlice';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('feed');
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const { posts, supportGroups, isLoading } = useSelector(state => state.community);
  
  useEffect(() => {
    dispatch(fetchCommunityPosts(1));
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchCommunityPosts(1)).finally(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  const TabButton = ({ id, title, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: isActive ? colors.primary : colors.white }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.tabButtonText,
        { color: isActive ? colors.white : colors.dark }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderFeedTab = () => (
    <View>
      {/* Create Post Button */}
      <TouchableOpacity
        style={[globalStyles.card, styles.createPostButton]}
        onPress={() => {
          // Navigate to create post modal or inline composer
          console.log('Create post');
        }}
      >
        <View style={[globalStyles.flexRow, globalStyles.centerVertical]}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
          <Text style={[globalStyles.body, { color: colors.textSecondary, flex: 1, marginLeft: 12 }]}>
            Share your thoughts anonymously...
          </Text>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {/* AI Listener Quick Access */}
      <TouchableOpacity
        style={[globalStyles.card, styles.aiListenerCard]}
        onPress={() => router.push('/(community)/ai-listener')}
      >
        <View style={[globalStyles.flexRow, globalStyles.centerVertical]}>
          <View style={styles.aiIcon}>
            <Ionicons name="mic" size={20} color={colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[globalStyles.h6, { color: colors.white }]}>
              Need someone to listen?
            </Text>
            <Text style={[globalStyles.bodySmall, { color: colors.white, opacity: 0.9 }]}>
              Our AI listener is here for you 24/7
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Community Feed */}
      <CommunityFeed posts={posts} />
    </View>
  );

  const renderGroupsTab = () => (
    <View>
      <Text style={[globalStyles.h5, { marginBottom: 16 }]}>Support Groups</Text>
      
      {supportGroups.map((group) => (
        <View key={group.id} style={[globalStyles.card, { marginBottom: 12 }]}>
          <View style={[globalStyles.flexRow, globalStyles.spaceBetween]}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.h6}>{group.name}</Text>
              <Text style={[globalStyles.bodySmall, { color: colors.textSecondary, marginVertical: 4 }]}>
                {group.description}
              </Text>
              <Text style={[globalStyles.caption, { color: colors.textSecondary }]}>
                {group.memberCount.toLocaleString()} members
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: group.isJoined ? colors.success : colors.primary }
              ]}
              onPress={() => {
                if (group.isJoined) {
                  // Leave group
                  console.log('Leave group:', group.id);
                } else {
                  // Join group
                  console.log('Join group:', group.id);
                }
              }}
            >
              <Text style={styles.groupButtonText}>
                {group.isJoined ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderResourcesTab = () => (
    <View>
      <Text style={[globalStyles.h5, { marginBottom: 16 }]}>Resources & Information</Text>
      
      {/* Educational Articles */}
      <View style={[globalStyles.card, { marginBottom: 12 }]}>
        <Text style={[globalStyles.h6, { marginBottom: 8 }]}>Educational Articles</Text>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Understanding Your Menstrual Cycle
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Managing Period Pain Naturally
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Hormones and Mood Changes
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Emergency Resources */}
      <View style={[globalStyles.card, { marginBottom: 12 }]}>
        <Text style={[globalStyles.h6, { marginBottom: 8 }]}>Emergency Resources</Text>
        
        <TouchableOpacity style={styles.emergencyItem}>
          <Ionicons name="call" size={20} color={colors.error} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={globalStyles.body}>Crisis Helpline</Text>
            <Text style={[globalStyles.bodySmall, { color: colors.textSecondary }]}>
              24/7 mental health support
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.emergencyItem}>
          <Ionicons name="medical" size={20} color={colors.error} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={globalStyles.body}>Find Healthcare Provider</Text>
            <Text style={[globalStyles.bodySmall, { color: colors.textSecondary }]}>
              Locate nearby gynecologists
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Self-Care Resources */}
      <View style={[globalStyles.card, { marginBottom: 12 }]}>
        <Text style={[globalStyles.h6, { marginBottom: 8 }]}>Self-Care & Wellness</Text>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="leaf" size={20} color={colors.success} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Meditation & Breathing Exercises
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="fitness" size={20} color={colors.success} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Period-Friendly Workouts
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resourceItem}>
          <Ionicons name="nutrition" size={20} color={colors.success} />
          <Text style={[globalStyles.body, { marginLeft: 12, flex: 1 }]}>
            Nutrition During Your Cycle
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          id="feed"
          title="Feed"
          isActive={activeTab === 'feed'}
          onPress={() => setActiveTab('feed')}
        />
        <TabButton
          id="groups"
          title="Groups"
          isActive={activeTab === 'groups'}
          onPress={() => setActiveTab('groups')}
        />
        <TabButton
          id="resources"
          title="Resources"
          isActive={activeTab === 'resources'}
          onPress={() => setActiveTab('resources')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'feed' && renderFeedTab()}
        {activeTab === 'groups' && renderGroupsTab()}
        {activeTab === 'resources' && renderResourcesTab()}
      </ScrollView>
    </View>
  );
}

const styles = {
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    padding: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createPostButton: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiListenerCard: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  groupButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
};
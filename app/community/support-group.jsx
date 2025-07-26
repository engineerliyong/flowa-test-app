// app/(community)/support-group.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';

export default function SupportGroupScreen() {
  const { groupId } = useLocalSearchParams();
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Mock data - in real app, fetch based on groupId
  const groupData = {
    id: groupId || 1,
    name: "PCOS Support",
    description: "A safe space for those managing PCOS symptoms and sharing experiences",
    memberCount: 1247,
    moderators: ['Dr. Sarah', 'Emma_PCOS'],
    rules: [
      "Be respectful and supportive of all members",
      "No medical advice - share experiences only",
      "Keep posts relevant to PCOS and related topics",
      "Respect privacy - no personal information sharing",
      "Report inappropriate content to moderators"
    ]
  };

  const groupPosts = [
    {
      id: 1,
      content: "Just got diagnosed with PCOS last week. Feeling overwhelmed but finding this community gives me hope. Thank you all for sharing your stories.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 15,
      comments: 8,
      tags: ['newbie', 'diagnosis', 'support']
    },
    {
      id: 2,
      content: "Has anyone tried the anti-inflammatory diet for PCOS? I'm on week 3 and starting to see some improvements in my energy levels.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 23,
      comments: 12,
      tags: ['diet', 'lifestyle', 'energy']
    },
    {
      id: 3,
      content: "Reminder that PCOS affects everyone differently. What works for one person might not work for another, and that's okay! Be patient with yourself. 💕",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 45,
      comments: 18,
      tags: ['reminder', 'selfcare', 'positivity']
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "PCOS Nutrition Workshop",
      date: "July 30, 2025",
      time: "7:00 PM",
      type: "Virtual"
    },
    {
      id: 2,
      title: "Monthly Support Circle",
      date: "August 5, 2025",
      time: "6:30 PM",
      type: "Virtual"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Understanding PCOS: A Comprehensive Guide",
      type: "Article",
      icon: "document-text"
    },
    {
      id: 2,
      title: "PCOS-Friendly Recipe Collection",
      type: "PDF",
      icon: "restaurant"
    },
    {
      id: 3,
      title: "Exercise Routines for PCOS",
      type: "Video",
      icon: "fitness"
    }
  ];

  const handleJoinLeave = () => {
    if (isJoined) {
      Alert.alert(
        "Leave Group",
        "Are you sure you want to leave this support group?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Leave", 
            style: "destructive",
            onPress: () => setIsJoined(false)
          }
        ]
      );
    } else {
      setIsJoined(true);
      Alert.alert("Welcome!", "You've successfully joined the support group.");
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

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

  const renderPost = ({ item: post }) => (
    <View style={[globalStyles.card, { marginBottom: 16 }]}>
      <View style={[globalStyles.flexRow, { marginBottom: 12 }]}>
        <View style={styles.anonymousAvatar}>
          <Ionicons name="person" size={16} color={colors.white} />
        </View>
        <View style={{ marginLeft: 8 }}>
          <Text style={[globalStyles.bodySmall, { fontWeight: '600' }]}>
            Group Member
          </Text>
          <Text style={[globalStyles.caption, { color: colors.textSecondary }]}>
            {formatTimeAgo(post.timestamp)}
          </Text>
        </View>
      </View>

      <Text style={[globalStyles.body, { marginBottom: 12, lineHeight: 22 }]}>
        {post.content}
      </Text>

      {post.tags && (
        <View style={[globalStyles.flexRow, { marginBottom: 12, flexWrap: 'wrap' }]}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={[globalStyles.flexRow, { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.lightGray }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color={colors.gray} />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.gray} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Group Info */}
        <View style={styles.groupInfo}>
          <Text style={globalStyles.h4}>{groupData.name}</Text>
          <Text style={[globalStyles.body, { color: colors.textSecondary, marginVertical: 8 }]}>
            {groupData.description}
          </Text>
          <Text style={globalStyles.caption}>
            {groupData.memberCount.toLocaleString()} members
          </Text>
          
          <TouchableOpacity
            style={[
              globalStyles.button,
              { 
                backgroundColor: isJoined ? colors.success : colors.primary,
                marginTop: 16 
              }
            ]}
            onPress={handleJoinLeave}
          >
            <Text style={globalStyles.buttonText}>
              {isJoined ? 'Joined ✓' : 'Join Group'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton
            id="posts"
            title="Posts"
            isActive={activeTab === 'posts'}
            onPress={() => setActiveTab('posts')}
          />
          <TabButton
            id="events"
            title="Events"
            isActive={activeTab === 'events'}
            onPress={() => setActiveTab('events')}
          />
          <TabButton
            id="resources"
            title="Resources"
            isActive={activeTab === 'resources'}
            onPress={() => setActiveTab('resources')}
          />
          <TabButton
            id="about"
            title="About"
            isActive={activeTab === 'about'}
            onPress={() => setActiveTab('about')}
          />
        </View>

        {/* Tab Content */}
        <View style={{ padding: 20 }}>
          {activeTab === 'posts' && (
            <View>
              {!isJoined && (
                <View style={styles.joinPrompt}>
                  <Ionicons name="lock-closed" size={24} color={colors.gray} />
                  <Text style={[globalStyles.body, { textAlign: 'center', marginTop: 8 }]}>
                    Join this group to see posts and participate in discussions
                  </Text>
                </View>
              )}
              
              {isJoined && (
                <FlatList
                  data={groupPosts}
                  renderItem={renderPost}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}

          {activeTab === 'events' && (
            <View>
              <Text style={[globalStyles.h6, { marginBottom: 16 }]}>
                Upcoming Events
              </Text>
              
              {upcomingEvents.map((event) => (
                <View key={event.id} style={[globalStyles.card, { marginBottom: 12 }]}>
                  <View style={[globalStyles.flexRow, globalStyles.spaceBetween]}>
                    <View style={{ flex: 1 }}>
                      <Text style={globalStyles.h6}>{event.title}</Text>
                      <Text style={[globalStyles.body, { color: colors.textSecondary, marginVertical: 4 }]}>
                        {event.date} at {event.time}
                      </Text>
                      <View style={styles.eventBadge}>
                        <Text style={styles.eventBadgeText}>{event.type}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.joinEventButton}>
                      <Text style={styles.joinEventText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'resources' && (
            <View>
              <Text style={[globalStyles.h6, { marginBottom: 16 }]}>
                Group Resources
              </Text>
              
              {resources.map((resource) => (
                <TouchableOpacity key={resource.id} style={styles.resourceItem}>
                  <Ionicons name={resource.icon} size={24} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={globalStyles.body}>{resource.title}</Text>
                    <Text style={[globalStyles.caption, { color: colors.textSecondary }]}>
                      {resource.type}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'about' && (
            <View>
              {/* Moderators */}
              <Text style={[globalStyles.h6, { marginBottom: 12 }]}>
                Moderators
              </Text>
              <View style={[globalStyles.card, { marginBottom: 20 }]}>
                {groupData.moderators.map((mod, index) => (
                  <View key={index} style={styles.moderatorItem}>
                    <View style={styles.moderatorAvatar}>
                      <Ionicons name="shield-checkmark" size={16} color={colors.white} />
                    </View>
                    <Text style={[globalStyles.body, { marginLeft: 12 }]}>{mod}</Text>
                  </View>
                ))}
              </View>

              {/* Rules */}
              <Text style={[globalStyles.h6, { marginBottom: 12 }]}>
                Group Rules
              </Text>
              <View style={globalStyles.card}>
                {groupData.rules.map((rule, index) => (
                  <Text key={index} style={styles.ruleText}>
                    {index + 1}. {rule}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  groupInfo: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinPrompt: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.background,
    borderRadius: 12,
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
  eventBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  eventBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  joinEventButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinEventText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moderatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moderatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
};
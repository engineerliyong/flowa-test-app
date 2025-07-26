import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';
import { logoutUser } from '../../src/store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, gamification } = useSelector(state => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logoutUser())
        }
      ]
    );
  };

  const ProfileSection = ({ title, children }) => (
    <View style={[globalStyles.card, { marginBottom: 16 }]}>
      <Text style={[globalStyles.h5, { marginBottom: 12 }]}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
    >
      <View style={styles.profileItemIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={globalStyles.body}>{title}</Text>
        {subtitle && (
          <Text style={[globalStyles.bodySmall, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={16} color={colors.gray} />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, label, value, color = colors.primary }) => (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={globalStyles.container}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* Profile Header */}
      <View style={[globalStyles.card, { marginBottom: 16 }]}>
        <View style={[globalStyles.flexRow, globalStyles.centerVertical]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={globalStyles.h4}>{profile.name || 'User'}</Text>
            <Text style={[globalStyles.bodySmall, { color: colors.textSecondary }]}>
              Level {gamification.level} • {gamification.totalPoints} points
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => console.log('Edit profile')}
          >
            <Ionicons name="pencil" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[globalStyles.flexRow, { marginBottom: 16 }]}>
        <StatCard
          icon="flash"
          label="Current Streak"
          value={`${gamification.currentStreak}`}
          color={colors.warning}
        />
        <StatCard
          icon="trophy"
          label="Achievements"
          value={`${gamification.achievements.length}`}
          color={colors.success}
        />
        <StatCard
          icon="calendar"
          label="Cycle Length"
          value={`${profile.cycleLength}d`}
          color={colors.primary}
        />
      </View>

      {/* Points & Achievements */}
      <ProfileSection title="Points & Achievements">
        <ProfileItem
          icon="star"
          title="Flow Points"
          subtitle={`${gamification.totalPoints} total points earned`}
          onPress={() => router.push('/(profile)/points')}
        />
        <ProfileItem
          icon="trophy"
          title="Achievements"
          subtitle={`${gamification.achievements.length} badges earned`}
          onPress={() => console.log('View achievements')}
        />
        <ProfileItem
          icon="flame"
          title="Streak History"
          subtitle={`Longest streak: ${gamification.longestStreak} days`}
          onPress={() => console.log('View streak history')}
        />
      </ProfileSection>

      {/* Health Settings */}
      <ProfileSection title="Health & Cycle">
        <ProfileItem
          icon="body"
          title="Cycle Settings"
          subtitle={`${profile.cycleLength} day cycle, ${profile.periodLength} day period`}
          onPress={() => console.log('Edit cycle settings')}
        />
        <ProfileItem
          icon="calendar"
          title="Period History"
          subtitle="View your menstrual history"
          onPress={() => router.push('/(tracking)/cycle-calendar')}
        />
        <ProfileItem
          icon="medical"
          title="Health Data Export"
          subtitle="Export your tracking data"
          onPress={() => console.log('Export data')}
        />
      </ProfileSection>

      {/* App Settings */}
      <ProfileSection title="App Settings">
        <ProfileItem
          icon="notifications"
          title="Notifications"
          subtitle={`${Object.values(profile.notifications).filter(Boolean).length} active`}
          onPress={() => router.push('/(profile)/settings')}
        />
        <ProfileItem
          icon="color-palette"
          title="Theme & Appearance"
          subtitle={`${profile.preferences.theme} mode`}
          onPress={() => console.log('Theme settings')}
        />
        <ProfileItem
          icon="language"
          title="Language"
          subtitle={profile.preferences.language.toUpperCase()}
          onPress={() => console.log('Language settings')}
        />
        <ProfileItem
          icon="shield-checkmark"
          title="Privacy & Security"
          subtitle="Manage your privacy settings"
          onPress={() => console.log('Privacy settings')}
        />
      </ProfileSection>

      {/* Support */}
      <ProfileSection title="Support & About">
        <ProfileItem
          icon="help-circle"
          title="Help Center"
          subtitle="Get help and support"
          onPress={() => console.log('Help center')}
        />
        <ProfileItem
          icon="chatbubble"
          title="Contact Support"
          subtitle="Send us feedback"
          onPress={() => console.log('Contact support')}
        />
        <ProfileItem
          icon="document-text"
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={() => console.log('Privacy policy')}
        />
        <ProfileItem
          icon="information-circle"
          title="About FLOWA"
          subtitle="Version 1.0.0"
          onPress={() => console.log('About app')}
        />
      </ProfileSection>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  profileItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
};
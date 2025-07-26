import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const AchievementBadge = ({ 
  achievement,
  size = 'medium',
  showAnimation = false,
  onPress,
  style,
}) => {
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [opacityAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (showAnimation) {
      // Pulse animation for new achievements
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [showAnimation]);

  const defaultAchievements = {
    firstLogin: {
      id: 'first_login',
      title: 'Welcome Aboard!',
      description: 'Started your Flowa journey',
      icon: 'rocket',
      color: colors.primary,
      rarity: 'common',
      points: 10,
    },
    weekStreak: {
      id: 'week_streak',
      title: '7-Day Warrior',
      description: 'Logged symptoms for 7 days straight',
      icon: 'flame',
      color: colors.orange,
      rarity: 'uncommon',
      points: 50,
    },
    monthTracker: {
      id: 'month_tracker',
      title: 'Monthly Maven',
      description: 'Tracked a complete cycle',
      icon: 'calendar',
      color: colors.success,
      rarity: 'rare',
      points: 100,
    },
    selfCareChamp: {
      id: 'self_care_champ',
      title: 'Self-Care Champion',
      description: 'Completed 10 self-care activities',
      icon: 'heart',
      color: colors.pink,
      rarity: 'uncommon',
      points: 75,
    },
    insightSeeker: {
      id: 'insight_seeker',
      title: 'Insight Seeker',
      description: 'Viewed your cycle insights 5 times',
      icon: 'analytics',
      color: colors.purple,
      rarity: 'common',
      points: 25,
    },
    consistentLogger: {
      id: 'consistent_logger',
      title: 'Consistency Queen',
      description: 'Logged symptoms for 30 days straight',
      icon: 'trophy',
      color: colors.gold,
      rarity: 'epic',
      points: 200,
    },
  };

  const getAchievementData = () => {
    if (achievement && typeof achievement === 'object') {
      return achievement;
    }
    
    if (typeof achievement === 'string' && defaultAchievements[achievement]) {
      return defaultAchievements[achievement];
    }
    
    // Default achievement
    return defaultAchievements.firstLogin;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: { width: 60, height: 60, padding: 8 },
        icon: 20,
        title: 10,
        description: 8,
      },
      medium: {
        container: { width: 80, height: 80, padding: 12 },
        icon: 24,
        title: 12,
        description: 10,
      },
      large: {
        container: { width: 100, height: 100, padding: 16 },
        icon: 32,
        title: 14,
        description: 12,
      },
    };
    
    return sizes[size] || sizes.medium;
  };

  const getRarityBorder = (rarity) => {
    const rarityStyles = {
      common: { borderColor: colors.gray, borderWidth: 2 },
      uncommon: { borderColor: colors.green, borderWidth: 2 },
      rare: { borderColor: colors.blue, borderWidth: 3 },
      epic: { borderColor: colors.purple, borderWidth: 3 },
      legendary: { borderColor: colors.gold, borderWidth: 4 },
    };
    
    return rarityStyles[rarity] || rarityStyles.common;
  };

  const achievementData = getAchievementData();
  const sizeStyles = getSizeStyles();
  const rarityBorder = getRarityBorder(achievementData.rarity);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          alignItems: 'center',
          margin: 8,
        },
        style
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            backgroundColor: achievementData.color || colors.primary,
            borderRadius: sizeStyles.container.width / 2,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          },
          sizeStyles.container,
          rarityBorder,
          {
            transform: [{ scale: scaleAnimation }],
            opacity: opacityAnimation,
          }
        ]}
      >
        <Ionicons 
          name={achievementData.icon} 
          size={sizeStyles.icon} 
          color={colors.white} 
        />
        
        {achievementData.points && (
          <Text style={{
            fontSize: sizeStyles.title - 2,
            fontWeight: 'bold',
            color: colors.white,
            marginTop: 2,
          }}>
            +{achievementData.points}
          </Text>
        )}
      </Animated.View>
      
      {size !== 'small' && (
        <View style={{ alignItems: 'center', marginTop: 4, maxWidth: 100 }}>
          <Text style={[
            globalStyles.caption,
            {
              fontSize: sizeStyles.title,
              fontWeight: '600',
              textAlign: 'center',
              color: colors.text,
            }
          ]}>
            {achievementData.title}
          </Text>
          
          {size === 'large' && (
            <Text style={[
              globalStyles.caption,
              {
                fontSize: sizeStyles.description,
                textAlign: 'center',
                color: colors.textSecondary,
                marginTop: 2,
              }
            ]}>
              {achievementData.description}
            </Text>
          )}
        </View>
      )}
      
      {achievementData.rarity && achievementData.rarity !== 'common' && (
        <View style={{
          backgroundColor: getRarityBorder(achievementData.rarity).borderColor,
          borderRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 2,
          marginTop: 4,
        }}>
          <Text style={{
            fontSize: 8,
            fontWeight: '600',
            color: colors.white,
            textTransform: 'uppercase',
          }}>
            {achievementData.rarity}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
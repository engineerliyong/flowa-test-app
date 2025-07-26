import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const StreakCounter = ({ 
  currentStreak = 0,
  longestStreak = 0,
  showAnimation = false,
  onPress,
  style,
}) => {
  const [flameAnimation] = useState(new Animated.Value(1));
  const [displayStreak, setDisplayStreak] = useState(currentStreak);

  useEffect(() => {
    if (showAnimation && currentStreak > 0) {
      // Flame flicker animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnimation, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnimation, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [showAnimation, currentStreak]);

  useEffect(() => {
    // Animate streak number changes
    if (currentStreak !== displayStreak) {
      const duration = 1000;
      const startValue = displayStreak;
      const endValue = currentStreak;
      const steps = Math.abs(endValue - startValue);
      
      if (steps <= 10) {
        // For small changes, animate step by step
        let currentStep = 0;
        const increment = endValue > startValue ? 1 : -1;
        
        const timer = setInterval(() => {
          currentStep++;
          const newValue = startValue + (increment * currentStep);
          setDisplayStreak(newValue);
          
          if (currentStep >= steps) {
            clearInterval(timer);
            setDisplayStreak(endValue);
          }
        }, duration / steps);
        
        return () => clearInterval(timer);
      } else {
        // For large changes, just update
        setDisplayStreak(endValue);
      }
    }
  }, [currentStreak]);

  const getStreakColor = (streak) => {
    if (streak === 0) return colors.gray;
    if (streak < 3) return colors.orange;
    if (streak < 7) return colors.red;
    if (streak < 14) return colors.purple;
    if (streak < 30) return colors.blue;
    return colors.gold; // 30+ days
  };

  const getStreakTitle = (streak) => {
    if (streak === 0) return 'Start Your Streak!';
    if (streak === 1) return 'First Step!';
    if (streak < 3) return 'Getting Started';
    if (streak < 7) return 'Building Momentum';
    if (streak < 14) return 'On Fire!';
    if (streak < 30) return 'Streak Master';
    return 'Unstoppable!';
  };

  const getStreakIcon = (streak) => {
    if (streak === 0) return 'flame-outline';
    if (streak < 7) return 'flame';
    if (streak < 30) return 'bonfire';
    return 'nuclear'; // For very long streaks
  };

  const getMotivationalMessage = (streak) => {
    if (streak === 0) return 'Log today to start your streak';
    if (streak === 1) return 'Great start! Keep it going';
    if (streak < 7) return `${7 - streak} days to weekly streak`;
    if (streak < 30) return `${30 - streak} days to monthly streak`;
    return 'You\'re absolutely crushing it!';
  };

  const streakColor = getStreakColor(displayStreak);
  const streakTitle = getStreakTitle(displayStreak);
  const streakIcon = getStreakIcon(displayStreak);
  const motivationalMessage = getMotivationalMessage(displayStreak);

  return (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          backgroundColor: colors.white,
          borderLeftWidth: 4,
          borderLeftColor: streakColor,
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Animated.View style={{
              backgroundColor: streakColor,
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              transform: [{ scale: flameAnimation }],
            }}>
              <Ionicons name={streakIcon} size={14} color={colors.white} />
            </Animated.View>
            
            <Text style={[
              globalStyles.caption,
              { 
                color: colors.textSecondary,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }
            ]}>
              Daily Streak
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[
              globalStyles.h4,
              { 
                color: streakColor,
                fontWeight: 'bold',
                marginRight: 4
              }
            ]}>
              {displayStreak}
            </Text>
            
            <Text style={[
              globalStyles.bodySmall,
              { color: colors.textSecondary }
            ]}>
              {displayStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
          
          <Text style={[
            globalStyles.caption,
            { color: colors.textSecondary, marginTop: 2 }
          ]}>
            {streakTitle}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={colors.textSecondary} 
        />
      </View>
      
      {/* Motivational Message */}
      <View style={{
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
      }}>
        <Text style={[
          globalStyles.caption,
          { 
            color: colors.textSecondary,
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]}>
          {motivationalMessage}
        </Text>
      </View>
      
      {/* Best Streak */}
      {longestStreak > 0 && longestStreak !== currentStreak && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
        }}>
          <Text style={[
            globalStyles.caption,
            { color: colors.textSecondary }
          ]}>
            Personal Best
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="trophy" size={12} color={colors.gold} style={{ marginRight: 4 }} />
            <Text style={[
              globalStyles.caption,
              { 
                color: colors.gold,
                fontWeight: '600'
              }
            ]}>
              {longestStreak} days
            </Text>
          </View>
        </View>
      )}
      
      {/* Progress indicators for milestones */}
      {displayStreak > 0 && displayStreak < 30 && (
        <View style={{
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          {/* 7-day milestone */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: displayStreak >= 7 ? colors.success : colors.lightGray,
              marginBottom: 2,
            }} />
            <Text style={[
              globalStyles.caption,
              { 
                color: displayStreak >= 7 ? colors.success : colors.textSecondary,
                fontSize: 10
              }
            ]}>
              7d
            </Text>
          </View>
          
          {/* 14-day milestone */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: displayStreak >= 14 ? colors.blue : colors.lightGray,
              marginBottom: 2,
            }} />
            <Text style={[
              globalStyles.caption,
              { 
                color: displayStreak >= 14 ? colors.blue : colors.textSecondary,
                fontSize: 10
              }
            ]}>
              14d
            </Text>
          </View>
          
          {/* 30-day milestone */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: displayStreak >= 30 ? colors.gold : colors.lightGray,
              marginBottom: 2,
            }} />
            <Text style={[
              globalStyles.caption,
              { 
                color: displayStreak >= 30 ? colors.gold : colors.textSecondary,
                fontSize: 10
              }
            ]}>
              30d
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
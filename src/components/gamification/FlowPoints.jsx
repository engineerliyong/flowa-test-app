import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const FlowPoints = ({ 
  points = 0,
  todayPoints = 0,
  showAnimation = false,
  onPress,
  style,
}) => {
  const [pointsAnimation] = useState(new Animated.Value(0));
  const [displayPoints, setDisplayPoints] = useState(points);

  useEffect(() => {
    if (showAnimation && todayPoints > 0) {
      // Animate point increase
      Animated.timing(pointsAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [showAnimation, todayPoints]);

  useEffect(() => {
    // Animate number changes
    const startValue = displayPoints;
    const endValue = points;
    
    if (startValue !== endValue) {
      const animationDuration = 1000;
      const steps = 30;
      const stepValue = (endValue - startValue) / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.round(startValue + (stepValue * currentStep));
        setDisplayPoints(newValue);
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayPoints(endValue);
        }
      }, animationDuration / steps);
      
      return () => clearInterval(timer);
    }
  }, [points]);

  const getPointsLevel = (totalPoints) => {
    if (totalPoints < 100) return { level: 1, progress: totalPoints / 100 };
    if (totalPoints < 300) return { level: 2, progress: (totalPoints - 100) / 200 };
    if (totalPoints < 600) return { level: 3, progress: (totalPoints - 300) / 300 };
    if (totalPoints < 1000) return { level: 4, progress: (totalPoints - 600) / 400 };
    
    // Level 5+
    const basePoints = 1000;
    const pointsAboveBase = totalPoints - basePoints;
    const level = 5 + Math.floor(pointsAboveBase / 500);
    const progress = (pointsAboveBase % 500) / 500;
    
    return { level, progress };
  };

  const getLevelColor = (level) => {
    const levelColors = {
      1: colors.gray,
      2: colors.green,
      3: colors.blue,
      4: colors.purple,
      5: colors.orange,
    };
    
    if (level >= 6) return colors.gold;
    return levelColors[level] || colors.primary;
  };

  const getLevelTitle = (level) => {
    const levelTitles = {
      1: 'Flow Beginner',
      2: 'Flow Explorer',
      3: 'Flow Enthusiast',
      4: 'Flow Expert',
      5: 'Flow Master',
    };
    
    if (level >= 6) return `Flow Legend ${level - 5}`;
    return levelTitles[level] || 'Flow Tracker';
  };

  const { level, progress } = getPointsLevel(displayPoints);
  const levelColor = getLevelColor(level);
  const levelTitle = getLevelTitle(level);

  return (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          backgroundColor: colors.white,
          borderLeftWidth: 4,
          borderLeftColor: levelColor,
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
            <View style={{
              backgroundColor: levelColor,
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}>
              <Ionicons name="star" size={14} color={colors.white} />
            </View>
            
            <Text style={[
              globalStyles.caption,
              { 
                color: colors.textSecondary,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }
            ]}>
              Flow Points
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[
              globalStyles.h4,
              { 
                color: levelColor,
                fontWeight: 'bold',
                marginRight: 4
              }
            ]}>
              {displayPoints.toLocaleString()}
            </Text>
            
            {todayPoints > 0 && (
              <Animated.View style={{
                opacity: pointsAnimation,
                transform: [{
                  translateY: pointsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  })
                }]
              }}>
                <Text style={[
                  globalStyles.caption,
                  { 
                    color: colors.success,
                    fontWeight: '600'
                  }
                ]}>
                  +{todayPoints}
                </Text>
              </Animated.View>
            )}
          </View>
          
          <Text style={[
            globalStyles.caption,
            { color: colors.textSecondary, marginTop: 2 }
          ]}>
            Level {level} • {levelTitle}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={colors.textSecondary} 
        />
      </View>
      
      {/* Progress Bar */}
      <View style={{
        marginTop: 12,
        height: 6,
        backgroundColor: colors.lightGray,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: '100%',
          backgroundColor: levelColor,
          borderRadius: 3,
          width: `${progress * 100}%`,
        }} />
      </View>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
      }}>
        <Text style={[
          globalStyles.caption,
          { color: colors.textSecondary }
        ]}>
          Level {level}
        </Text>
        <Text style={[
          globalStyles.caption,
          { color: colors.textSecondary }
        ]}>
          Level {level + 1}
        </Text>
      </View>
      
      {/* Quick Actions */}
      <View style={{
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between',
      }}>
        <Text style={[
          globalStyles.caption,
          { color: colors.textSecondary }
        ]}>
          Daily check-in: +10 pts
        </Text>
        <Text style={[
          globalStyles.caption,
          { color: colors.textSecondary }
        ]}>
          Streak bonus: +5 pts
        </Text>
      </View>
    </TouchableOpacity>
  );
};
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';
import { DailyFlow } from '../../src/components/daily/DailyFlow';
import { FlowPoints } from '../../src/components/gamification/FlowPoints';
import { StreakCounter } from '../../src/components/gamification/StreakCounter';
import { SelfCareTip } from '../../src/components/daily/SelfCareTip';
import { WorkTip } from '../../src/components/daily/WorkTip';
import { MotivationCard } from '../../src/components/daily/MotivationCard';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, gamification } = useSelector(state => state.user);
  const { currentCycle, todaySymptoms } = useSelector(state => state.symptoms);
  const { dailyTips } = useSelector(state => state.ai);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCycleDay = () => {
    if (!currentCycle.startDate) return null;
    const today = new Date();
    const startDate = new Date(currentCycle.startDate);
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const hasLoggedToday = () => {
    if (!todaySymptoms.loggedAt) return false;
    const today = new Date().toDateString();
    const loggedDate = new Date(todaySymptoms.loggedAt).toDateString();
    return today === loggedDate;
  };

  const cycleDay = getCycleDay();

  return (
    <ScrollView 
      style={globalStyles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Greeting */}
      <View style={[globalStyles.card, { marginTop: 10 }]}>
        <Text style={globalStyles.h3}>
          {getGreeting()}, {profile.name || 'Beautiful'}! 💕
        </Text>
        {cycleDay && (
          <Text style={[globalStyles.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
            Day {cycleDay} of your cycle • {currentCycle.phase} phase
          </Text>
        )}
      </View>

      {/* Gamification Row */}
      <View style={[globalStyles.flexRow, { marginVertical: 8 }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <FlowPoints />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <StreakCounter />
        </View>
      </View>

      {/* Daily Check-in Card */}
      <TouchableOpacity
        style={[
          globalStyles.card,
          { 
            backgroundColor: hasLoggedToday() ? colors.success : colors.primary,
            marginVertical: 8
          }
        ]}
        onPress={() => router.push('/daily-checkin')}
      >
        <View style={[globalStyles.flexRow, globalStyles.centerVertical]}>
          <Ionicons 
            name={hasLoggedToday() ? "checkmark-circle" : "add-circle"} 
            size={24} 
            color={colors.white} 
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[globalStyles.h5, { color: colors.white }]}>
              {hasLoggedToday() ? "Today's Check-in Complete!" : "Daily Check-in"}
            </Text>
            <Text style={[globalStyles.bodySmall, { color: colors.white, opacity: 0.9 }]}>
              {hasLoggedToday() 
                ? "Great job tracking your symptoms today!" 
                : "Track your symptoms and mood"
              }
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Daily Flow Package */}
      <DailyFlow />

      {/* AI-Generated Tips */}
      <View style={{ marginVertical: 8 }}>
        <Text style={[globalStyles.h4, { marginBottom: 12 }]}>
          Your Daily Flow Tips
        </Text>
        
        <SelfCareTip tip={dailyTips.selfCare} />
        <WorkTip tip={dailyTips.work} />
        <MotivationCard tip={dailyTips.motivation} />
      </View>

      {/* Quick Actions */}
      <View style={[globalStyles.card, { marginVertical: 8 }]}>
        <Text style={[globalStyles.h5, { marginBottom: 12 }]}>
          Quick Actions
        </Text>
        
        <View style={globalStyles.flexRow}>
          <TouchableOpacity 
            style={[styles.quickAction, { marginRight: 8 }]}
            onPress={() => router.push('/(tracking)/symptom-tracking')}
          >
            <Ionicons name="analytics" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Track Symptoms</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { marginHorizontal: 8 }]}
            onPress={() => router.push('/(community)/ai-listener')}
          >
            <Ionicons name="mic" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>AI Listener</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { marginLeft: 8 }]}
            onPress={() => router.push('/(tracking)/cycle-calendar')}
          >
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cycle Overview */}
      {currentCycle.startDate && (
        <View style={[globalStyles.card, { marginVertical: 8 }]}>
          <Text style={[globalStyles.h5, { marginBottom: 12 }]}>
            Cycle Overview
          </Text>
          
          <View style={globalStyles.flexRow}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.caption}>Current Phase</Text>
              <Text style={[globalStyles.body, { textTransform: 'capitalize' }]}>
                {currentCycle.phase}
              </Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.caption}>Cycle Day</Text>
              <Text style={globalStyles.body}>
                {cycleDay || 0}
              </Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.caption}>Next Period</Text>
              <Text style={globalStyles.bodySmall}>
                {currentCycle.expectedEndDate 
                  ? new Date(currentCycle.expectedEndDate).toLocaleDateString()
                  : 'Not set'
                }
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  quickAction: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
    marginTop: 8,
    textAlign: 'center',
  },
};
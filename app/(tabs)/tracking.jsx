import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';
import { SymptomLogger } from '../../src/components/symptom/SymptomLogger';

export default function TrackingScreen() {
  const [activeTab, setActiveTab] = useState('today');
  const { currentCycle, todaySymptoms, symptomHistory } = useSelector(state => state.symptoms);
  
  const getCycleDay = () => {
    if (!currentCycle.startDate) return null;
    const today = new Date();
    const startDate = new Date(currentCycle.startDate);
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'menstrual':
        return colors.flow.heavy;
      case 'follicular':
        return colors.primary;
      case 'ovulation':
        return colors.warning;
      case 'luteal':
        return colors.accent;
      default:
        return colors.gray;
    }
  };

  const getFlowIcon = (flow) => {
    switch (flow) {
      case 'light':
        return 'water-outline';
      case 'medium':
        return 'water';
      case 'heavy':
        return 'water-sharp';
      default:
        return 'help-outline';
    }
  };

  const getMoodIcon = (mood) => {
    if (mood >= 5) return 'happy-outline';
    if (mood >= 4) return 'happy-outline';
    if (mood >= 3) return 'remove-outline';
    if (mood >= 2) return 'sad-outline';
    return 'sad-outline';
  };

  const cycleDay = getCycleDay();

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

  const renderTodayTab = () => (
    <View>
      {/* Cycle Status Card */}
      <View style={[globalStyles.card, { marginBottom: 16 }]}>
        <View style={[globalStyles.flexRow, globalStyles.spaceBetween]}>
          <View>
            <Text style={globalStyles.h4}>Cycle Day {cycleDay || 0}</Text>
            <Text style={[
              globalStyles.body,
              { 
                color: getPhaseColor(currentCycle.phase),
                textTransform: 'capitalize',
                fontWeight: '600'
              }
            ]}>
              {currentCycle.phase} Phase
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cycleButton}
            onPress={() => router.push('/(tracking)/cycle-calendar')}
          >
            <Ionicons name="calendar" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Summary */}
      <View style={[globalStyles.card, { marginBottom: 16 }]}>
        <Text style={[globalStyles.h5, { marginBottom: 12 }]}>Today's Summary</Text>
        
        <View style={globalStyles.flexRow}>
          <View style={styles.summaryItem}>
            <Ionicons 
              name={getFlowIcon(todaySymptoms.flow)} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.summaryLabel}>Flow</Text>
            <Text style={styles.summaryValue}>
              {todaySymptoms.flow || 'Not logged'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons 
              name={getMoodIcon(todaySymptoms.mood)} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.summaryLabel}>Mood</Text>
            <Text style={styles.summaryValue}>
              {todaySymptoms.mood ? `${todaySymptoms.mood}/5` : 'Not logged'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="flash" size={20} color={colors.primary} />
            <Text style={styles.summaryLabel}>Energy</Text>
            <Text style={styles.summaryValue}>
              {todaySymptoms.energy ? `${todaySymptoms.energy}/5` : 'Not logged'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="medical" size={20} color={colors.primary} />
            <Text style={styles.summaryLabel}>Symptoms</Text>
            <Text style={styles.summaryValue}>
              {todaySymptoms.symptoms.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={globalStyles.flexRow}>
        <TouchableOpacity
          style={[styles.actionButton, { marginRight: 8 }]}
          onPress={() => router.push('/(tracking)/symptom-tracking')}
        >
          <Ionicons name="add-circle" size={24} color={colors.white} />
          <Text style={styles.actionButtonText}>Log Symptoms</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { marginLeft: 8 }]}
          onPress={() => router.push('/(tracking)/insights')}
        >
          <Ionicons name="analytics" size={24} color={colors.white} />
          <Text style={styles.actionButtonText}>View Insights</Text>
        </TouchableOpacity>
      </View>

      {/* Symptom Logger Component */}
      <SymptomLogger />
    </View>
  );

  const renderHistoryTab = () => (
    <View>
      <Text style={[globalStyles.h5, { marginBottom: 16 }]}>Symptom History</Text>
      
      {symptomHistory.length === 0 ? (
        <View style={[globalStyles.card, globalStyles.center]}>
          <Ionicons name="document-text-outline" size={48} color={colors.gray} />
          <Text style={[globalStyles.body, { color: colors.gray, marginTop: 12 }]}>
            No symptom data yet
          </Text>
          <Text style={[globalStyles.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            Start logging your daily symptoms to see your history here
          </Text>
        </View>
      ) : (
        symptomHistory.slice(0, 10).map((entry, index) => (
          <View key={index} style={[globalStyles.card, { marginBottom: 8 }]}>
            <View style={[globalStyles.flexRow, globalStyles.spaceBetween]}>
              <View>
                <Text style={globalStyles.body}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text style={[globalStyles.bodySmall, { color: colors.textSecondary }]}>
                  {entry.symptoms.length} symptoms logged
                </Text>
              </View>
              
              <View style={globalStyles.flexRow}>
                {entry.flow && (
                  <View style={styles.historyBadge}>
                    <Ionicons 
                      name={getFlowIcon(entry.flow)} 
                      size={16} 
                      color={colors.primary} 
                    />
                    <Text style={styles.historyBadgeText}>{entry.flow}</Text>
                  </View>
                )}
                {entry.mood && (
                  <View style={styles.historyBadge}>
                    <Ionicons 
                      name={getMoodIcon(entry.mood)} 
                      size={16} 
                      color={colors.primary} 
                    />
                    <Text style={styles.historyBadgeText}>{entry.mood}/5</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          id="today"
          title="Today"
          isActive={activeTab === 'today'}
          onPress={() => setActiveTab('today')}
        />
        <TabButton
          id="history"
          title="History"
          isActive={activeTab === 'history'}
          onPress={() => setActiveTab('history')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {activeTab === 'today' ? renderTodayTab() : renderHistoryTab()}
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
    fontSize: 16,
    fontWeight: '600',
  },
  cycleButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 2,
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  historyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  historyBadgeText: {
    fontSize: 12,
    color: colors.dark,
    marginLeft: 4,
  },
};
// src/components/daily/DailyFlow.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';
import { useAI } from '../../hooks/useAI';

export const DailyFlow = ({ cycleData, onUpdate }) => {
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  
  const { getDailyInsight, getSelfCareTip, getWorkTip } = useAI();

  const flowLevels = [
    { id: 'none', label: 'No Flow', color: colors.gray, icon: 'ellipse-outline' },
    { id: 'light', label: 'Light', color: colors.info, icon: 'water-outline' },
    { id: 'medium', label: 'Medium', color: colors.primary, icon: 'water' },
    { id: 'heavy', label: 'Heavy', color: colors.error, icon: 'water' }
  ];

  const moods = [
    { id: 'happy', label: 'Happy', color: colors.happy, icon: 'happy-outline' },
    { id: 'neutral', label: 'Okay', color: colors.neutral, icon: 'remove-outline' },
    { id: 'sad', label: 'Sad', color: colors.sad, icon: 'sad-outline' },
    { id: 'anxious', label: 'Anxious', color: colors.anxious, icon: 'alert-circle-outline' },
    { id: 'energetic', label: 'Energetic', color: colors.energetic, icon: 'flash-outline' },
    { id: 'tired', label: 'Tired', color: colors.tired, icon: 'bed-outline' }
  ];

  const commonSymptoms = [
    { id: 'cramps', label: 'Cramps', icon: 'medical-outline' },
    { id: 'bloating', label: 'Bloating', icon: 'expand-outline' },
    { id: 'headache', label: 'Headache', icon: 'skull-outline' },
    { id: 'backache', label: 'Back Pain', icon: 'body-outline' },
    { id: 'nausea', label: 'Nausea', icon: 'nutrition-outline' },
    { id: 'fatigue', label: 'Fatigue', icon: 'battery-dead-outline' },
    { id: 'acne', label: 'Acne', icon: 'radio-button-on-outline' },
    { id: 'insomnia', label: 'Sleep Issues', icon: 'moon-outline' }
  ];

  useEffect(() => {
    loadDailyTip();
  }, [selectedMood, cycleData]);

  const loadDailyTip = async () => {
    try {
      if (selectedMood && cycleData?.currentPhase) {
        const tip = await getSelfCareTip(selectedMood, cycleData.currentPhase);
        setDailyTip(tip);
      }
    } catch (error) {
      console.log('Error loading daily tip:', error);
    }
  };

  const handleFlowSelect = (flowId) => {
    setSelectedFlow(flowId);
    onUpdate({
      type: 'flow',
      value: flowId,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    onUpdate({
      type: 'mood',
      value: moodId,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSymptomToggle = (symptomId) => {
    let newSymptoms;
    if (selectedSymptoms.includes(symptomId)) {
      newSymptoms = selectedSymptoms.filter(s => s !== symptomId);
    } else {
      newSymptoms = [...selectedSymptoms, symptomId];
    }
    
    setSelectedSymptoms(newSymptoms);
    onUpdate({
      type: 'symptoms',
      value: newSymptoms,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const FlowButton = ({ flow, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        { 
          backgroundColor: isSelected ? flow.color : colors.white,
          borderColor: flow.color,
          borderWidth: 1
        }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={flow.icon} 
        size={20} 
        color={isSelected ? colors.white : flow.color} 
      />
      <Text style={[
        styles.optionText,
        { color: isSelected ? colors.white : flow.color }
      ]}>
        {flow.label}
      </Text>
    </TouchableOpacity>
  );

  const MoodButton = ({ mood, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.moodButton,
        { 
          backgroundColor: isSelected ? mood.color : colors.white,
          borderColor: mood.color,
          borderWidth: 1
        }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={mood.icon} 
        size={24} 
        color={isSelected ? colors.white : mood.color} 
      />
      <Text style={[
        styles.moodText,
        { color: isSelected ? colors.white : mood.color }
      ]}>
        {mood.label}
      </Text>
    </TouchableOpacity>
  );

  const SymptomChip = ({ symptom, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.symptomChip,
        { 
          backgroundColor: isSelected ? colors.primary : colors.background,
          borderColor: isSelected ? colors.primary : colors.lightGray,
          borderWidth: 1
        }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={symptom.icon} 
        size={16} 
        color={isSelected ? colors.white : colors.gray} 
      />
      <Text style={[
        styles.symptomText,
        { color: isSelected ? colors.white : colors.gray }
      ]}>
        {symptom.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={globalStyles.h5}>How are you feeling today?</Text>
        <Text style={[globalStyles.caption, { color: colors.textSecondary }]}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Flow Tracking */}
      <View style={[globalStyles.card, styles.section]}>
        <Text style={[globalStyles.h6, { marginBottom: 16 }]}>Flow Level</Text>
        <View style={styles.flowContainer}>
          {flowLevels.map((flow) => (
            <FlowButton
              key={flow.id}
              flow={flow}
              isSelected={selectedFlow === flow.id}
              onPress={() => handleFlowSelect(flow.id)}
            />
          ))}
        </View>
      </View>

      {/* Mood Tracking */}
      <View style={[globalStyles.card, styles.section]}>
        <Text style={[globalStyles.h6, { marginBottom: 16 }]}>Mood</Text>
        <View style={styles.moodContainer}>
          {moods.map((mood) => (
            <MoodButton
              key={mood.id}
              mood={mood}
              isSelected={selectedMood === mood.id}
              onPress={() => handleMoodSelect(mood.id)}
            />
          ))}
        </View>
      </View>

      {/* Symptoms */}
      <View style={[globalStyles.card, styles.section]}>
        <Text style={[globalStyles.h6, { marginBottom: 16 }]}>Symptoms</Text>
        <View style={styles.symptomContainer}>
          {commonSymptoms.map((symptom) => (
            <SymptomChip
              key={symptom.id}
              symptom={symptom}
              isSelected={selectedSymptoms.includes(symptom.id)}
              onPress={() => handleSymptomToggle(symptom.id)}
            />
          ))}
        </View>
      </View>

      {/* Daily Tip */}
      {dailyTip && (
        <View style={[globalStyles.card, styles.tipSection]}>
          <View style={[globalStyles.flexRow, { alignItems: 'center', marginBottom: 12 }]}>
            <Ionicons name="bulb-outline" size={20} color={colors.warning} />
            <Text style={[globalStyles.h6, { marginLeft: 8 }]}>Daily Tip</Text>
          </View>
          <Text style={[globalStyles.body, { lineHeight: 22 }]}>
            {dailyTip.tip || dailyTip.content}
          </Text>
          {dailyTip.isLocal && (
            <Text style={[globalStyles.caption, { color: colors.textSecondary, marginTop: 8 }]}>
              💡 Offline tip
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  flowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  symptomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tipSection: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
};
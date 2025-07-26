// src/components/common/FlowCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';

export const FlowCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor, 
  backgroundColor, 
  onPress,
  trend = null,
  isLoading = false 
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend > 0) return 'trending-up';
    if (trend < 0) return 'trending-down';
    return 'remove';
  };

  const getTrendColor = () => {
    if (!trend) return colors.gray;
    
    if (trend > 0) return colors.success;
    if (trend < 0) return colors.error;
    return colors.gray;
  };

  const CardContent = () => (
    <View style={[
      globalStyles.card,
      styles.container,
      backgroundColor && { backgroundColor }
    ]}>
      {/* Header */}
      <View style={[globalStyles.flexRow, globalStyles.spaceBetween]}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={iconColor || colors.primary} 
          />
        </View>
        
        {trend !== null && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={getTrendIcon()} 
              size={16} 
              color={getTrendColor()} 
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar} />
            <View style={[styles.loadingBar, { width: '60%', marginTop: 4 }]} />
          </View>
        ) : (
          <>
            <Text style={styles.value}>{value}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </>
        )}
      </View>

      {/* Action indicator */}
      {onPress && (
        <View style={styles.actionIndicator}>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={colors.gray} 
          />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// Specialized FlowCard variants
export const CyclePhaseCard = ({ currentPhase, daysLeft, onPress }) => {
  const getPhaseInfo = (phase) => {
    switch (phase) {
      case 'menstrual':
        return {
          icon: 'water',
          color: colors.menstrual,
          label: 'Menstrual Phase',
          description: 'Time for rest and reflection'
        };
      case 'follicular':
        return {
          icon: 'leaf',
          color: colors.follicular,
          label: 'Follicular Phase',
          description: 'Energy is building up'
        };
      case 'ovulation':
        return {
          icon: 'sunny',
          color: colors.ovulation,
          label: 'Ovulation',
          description: 'Peak energy and fertility'
        };
      case 'luteal':
        return {
          icon: 'moon',
          color: colors.luteal,
          label: 'Luteal Phase',
          description: 'Prepare for next cycle'
        };
      default:
        return {
          icon: 'help-circle',
          color: colors.gray,
          label: 'Unknown Phase',
          description: 'Track your cycle to see insights'
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentPhase);

  return (
    <FlowCard
      title="Current Phase"
      value={phaseInfo.label}
      subtitle={daysLeft ? `${daysLeft} days left` : phaseInfo.description}
      icon={phaseInfo.icon}
      iconColor={phaseInfo.color}
      onPress={onPress}
    />
  );
};

export const NextPeriodCard = ({ daysUntil, confidence, onPress }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return colors.success;
    if (confidence >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <FlowCard
      title="Next Period"
      value={daysUntil ? `${daysUntil} days` : 'Calculating...'}
      subtitle={confidence ? `${confidence}% confidence` : 'Track more to improve accuracy'}
      icon="calendar"
      iconColor={colors.primary}
      onPress={onPress}
    />
  );
};

export const MoodTrendCard = ({ averageMood, trend, onPress }) => {
  const getMoodInfo = (mood) => {
    const moodMap = {
      happy: { label: 'Happy', color: colors.happy, icon: 'happy' },
      neutral: { label: 'Neutral', color: colors.neutral, icon: 'remove' },
      sad: { label: 'Low', color: colors.sad, icon: 'sad' },
      anxious: { label: 'Anxious', color: colors.anxious, icon: 'alert-circle' },
      energetic: { label: 'Energetic', color: colors.energetic, icon: 'flash' },
      tired: { label: 'Tired', color: colors.tired, icon: 'bed' }
    };
    
    return moodMap[mood] || { label: 'Unknown', color: colors.gray, icon: 'help-circle' };
  };

  const moodInfo = getMoodInfo(averageMood);

  return (
    <FlowCard
      title="Mood Trend"
      value={moodInfo.label}
      subtitle="Last 7 days average"
      icon={moodInfo.icon}
      iconColor={moodInfo.color}
      trend={trend}
      onPress={onPress}
    />
  );
};

export const SymptomCard = ({ topSymptom, count, onPress }) => {
  const getSymptomIcon = (symptom) => {
    const iconMap = {
      cramps: 'medical',
      bloating: 'expand',
      headache: 'skull',
      backache: 'body',
      nausea: 'nutrition',
      fatigue: 'battery-dead',
      acne: 'radio-button-on',
      insomnia: 'moon'
    };
    
    return iconMap[symptom] || 'medical';
  };

  return (
    <FlowCard
      title="Top Symptom"
      value={topSymptom ? topSymptom.charAt(0).toUpperCase() + topSymptom.slice(1) : 'None'}
      subtitle={count ? `${count} times this month` : 'No symptoms tracked'}
      icon={getSymptomIcon(topSymptom)}
      iconColor={colors.error}
      onPress={onPress}
    />
  );
};

const styles = {
  container: {
    position: 'relative',
    minHeight: 120,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 16,
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  actionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  loadingContainer: {
    marginTop: 8,
  },
  loadingBar: {
    height: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    width: '80%',
  },
};
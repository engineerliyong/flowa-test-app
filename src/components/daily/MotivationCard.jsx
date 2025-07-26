import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const MotivationCard = ({ 
  tip,
  style,
  onPress,
  showShareButton = true,
  showIcon = true,
}) => {
  const motivationQuotes = [
    "You are stronger than you think and more capable than you imagine. 💪",
    "Every cycle is a reminder of your body's incredible wisdom. Trust the process. 🌙",
    "Your worth isn't measured by your productivity during any phase of your cycle. 💕",
    "You're doing better than you think, even on the hardest days. ✨",
    "Your body is working perfectly, exactly as it should. Honor its rhythm. 🌸",
    "Rest is not a reward for work completed, it's a requirement for work to continue. 🛌",
    "You don't have to be perfect to be worthy of love and care. 💝",
    "Your sensitivity is a superpower, not a weakness. Embrace it. 🦋",
    "Progress isn't always linear. Some days maintaining is enough. 📈",
    "You are enough, exactly as you are, in whatever phase you're in. 🌺"
  ];

  const getMotivationContent = () => {
    if (tip && tip.content) {
      return tip.content;
    }
    
    // Return a random motivation quote as fallback
    const randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    return motivationQuotes[randomIndex];
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: getMotivationContent(),
        title: 'Daily Motivation from Flowa'
      });
    } catch (error) {
      console.error('Error sharing motivation:', error);
    }
  };

  const content = getMotivationContent();

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.motivation || colors.secondary,
          borderRadius: 12,
          padding: 16,
          marginVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {showIcon && (
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
          }}>
            <Ionicons 
              name="heart" 
              size={20} 
              color={colors.white} 
            />
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[
              globalStyles.caption,
              { 
                color: colors.white,
                opacity: 0.9,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }
            ]}>
              Daily Motivation
            </Text>
            
            {showShareButton && (
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  padding: 4,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Ionicons name="share" size={16} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[
            globalStyles.body,
            { 
              color: colors.white,
              marginTop: 8,
              lineHeight: 22,
              fontStyle: 'italic'
            }
          ]}>
            {content}
          </Text>
          
          {tip && tip.category && (
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignSelf: 'flex-start',
              marginTop: 8,
            }}>
              <Text style={[
                globalStyles.caption,
                { 
                  color: colors.white,
                  fontWeight: '500'
                }
              ]}>
                {tip.category}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {tip && tip.actionable && (
        <View style={{
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
        }}>
          <Text style={[
            globalStyles.bodySmall,
            { 
              color: colors.white,
              opacity: 0.9
            }
          ]}>
            💡 Try this: {tip.actionable}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
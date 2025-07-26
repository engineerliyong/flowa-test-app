import React from 'react';
import { View, Text, PanGestureHandler, State } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors } from '../styles/colors';

// Fallback simple slider for environments without gesture handler
const SimpleSlider = ({ 
  value, 
  onValueChange, 
  minimumValue = 0, 
  maximumValue = 100, 
  step = 1,
  label,
  showValue = true,
  trackStyle,
  thumbStyle,
  containerStyle,
}) => {
  const [sliderValue, setSliderValue] = React.useState(value || minimumValue);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));
    setSliderValue(clampedValue);
    onValueChange?.(clampedValue);
  };

  return (
    <View style={[{ marginVertical: 8 }, containerStyle]}>
      {label && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
            {label}
          </Text>
          {showValue && (
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>
              {sliderValue}
            </Text>
          )}
        </View>
      )}
      
      <View style={{
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 16,
      }}>
        <View style={[{
          height: 4,
          backgroundColor: colors.lightGray,
          borderRadius: 2,
        }, trackStyle]} />
        
        <View style={{
          position: 'absolute',
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {Array.from({ length: Math.floor((maximumValue - minimumValue) / step) + 1 }).map((_, index) => {
            const stepValue = minimumValue + (index * step);
            const isActive = stepValue <= sliderValue;
            
            return (
              <View
                key={index}
                style={[{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: isActive ? colors.primary : colors.lightGray,
                  borderWidth: 2,
                  borderColor: colors.white,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 3,
                }, thumbStyle]}
                onTouchEnd={() => handleValueChange(stepValue)}
              />
            );
          })}
        </View>
      </View>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
      }}>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {minimumValue}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {maximumValue}
        </Text>
      </View>
    </View>
  );
};

export const Slider = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
  trackColor = colors.lightGray,
  minimumTrackTintColor = colors.primary,
  maximumTrackTintColor = colors.lightGray,
  thumbTintColor = colors.primary,
  trackStyle,
  thumbStyle,
  containerStyle,
  ...props
}) => {
  // For now, we'll use the simple slider implementation
  // This can be enhanced with react-native-reanimated when available
  
  return (
    <SimpleSlider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      label={label}
      showValue={showValue}
      trackStyle={trackStyle}
      thumbStyle={thumbStyle}
      containerStyle={containerStyle}
      {...props}
    />
  );
};
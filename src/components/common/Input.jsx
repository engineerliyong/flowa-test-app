import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  editable = true,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = () => {
    return [
      {
        marginVertical: 8,
      },
      containerStyle,
    ];
  };

  const getInputContainerStyle = () => {
    return [
      {
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: multiline ? 12 : 14,
        backgroundColor: editable ? colors.white : colors.lightGray,
        borderColor: error 
          ? colors.error 
          : isFocused 
            ? colors.primary 
            : colors.border,
      },
      style,
    ];
  };

  const getInputStyle = () => {
    return [
      {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        paddingLeft: leftIcon ? 8 : 0,
        paddingRight: rightIcon || secureTextEntry ? 8 : 0,
        textAlignVertical: multiline ? 'top' : 'center',
        minHeight: multiline ? 100 : undefined,
      },
      inputStyle,
    ];
  };

  const getLabelStyle = () => {
    return {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    };
  };

  const getErrorStyle = () => {
    return {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    };
  };

  const getHelperStyle = () => {
    return {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? colors.primary : colors.textSecondary} 
          />
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4 }}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <Ionicons 
            name={rightIcon} 
            size={20} 
            color={isFocused ? colors.primary : colors.textSecondary} 
          />
        )}
      </View>
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
      {helperText && !error && <Text style={getHelperStyle()}>{helperText}</Text>}
    </View>
  );
};
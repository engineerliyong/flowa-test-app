import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { layout } from './layout';

export const globalStyles = StyleSheet.create({
  // Base styles
  ...layout,
  
  // Typography styles
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  h4: typography.h4,
  h5: typography.h5,
  h6: typography.h6,
  body: typography.body,
  bodySmall: typography.bodySmall,
  caption: typography.caption,
  
  // Common component styles
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  
  buttonTextSecondary: {
    ...typography.button,
    color: colors.primary,
  },
  
  buttonDisabled: {
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonTextDisabled: {
    ...typography.button,
    color: colors.gray,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
    minHeight: 48,
  },
  
  inputFocused: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.dark,
    minHeight: 48,
  },
  
  inputError: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
    minHeight: 48,
  },
  
  inputLabel: {
    ...typography.inputLabel,
    marginBottom: 8,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 16,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Error styles
  errorContainer: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  
  errorText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  
  // Success styles
  successContainer: {
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  
  successText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  
  // Badge styles
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  
  // Avatar styles
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Shadow styles
  shadow: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  shadowLarge: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
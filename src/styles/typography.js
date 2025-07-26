import { colors } from './colors';

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.dark,
    lineHeight: 40,
  },
  
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark,
    lineHeight: 36,
  },
  
  h3: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 32,
  },
  
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 28,
  },
  
  h5: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 24,
  },
  
  h6: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 22,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.dark,
    lineHeight: 24,
  },
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.dark,
    lineHeight: 20,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Special text styles
  link: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  error: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.error,
    lineHeight: 18,
  },
  
  success: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.success,
    lineHeight: 18,
  },
  
  // Tab bar text
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Input text
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.dark,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 5,
  },
  
  // Card text
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 24,
  },
  
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },
};
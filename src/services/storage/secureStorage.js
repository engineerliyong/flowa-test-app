// src/services/storage/secureStorage.js
import * as SecureStore from 'expo-secure-store';

/**
 * Secure storage service using Expo SecureStore
 * Used for storing sensitive data like tokens, user credentials, etc.
 */

export const setSecureItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error storing secure item:', error);
    return false;
  }
};

export const getSecureItem = async (key) => {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Error retrieving secure item:', error);
    return null;
  }
};

export const removeSecureItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error('Error removing secure item:', error);
    return false;
  }
};

export const clearAllSecureItems = async () => {
  try {
    // Get all keys that might be stored
    const keys = [
      'auth_token',
      'refresh_token',
      'user_data',
      'biometric_enabled',
      'app_settings'
    ];

    await Promise.all(keys.map(key => removeSecureItem(key)));
    return true;
  } catch (error) {
    console.error('Error clearing all secure items:', error);
    return false;
  }
};

// Convenience methods for common stored items
export const authStorage = {
  async setTokens(authToken, refreshToken) {
    const results = await Promise.all([
      setSecureItem('auth_token', authToken),
      setSecureItem('refresh_token', refreshToken)
    ]);
    return results.every(result => result);
  },

  async getTokens() {
    const [authToken, refreshToken] = await Promise.all([
      getSecureItem('auth_token'),
      getSecureItem('refresh_token')
    ]);
    return { authToken, refreshToken };
  },

  async clearTokens() {
    const results = await Promise.all([
      removeSecureItem('auth_token'),
      removeSecureItem('refresh_token')
    ]);
    return results.every(result => result);
  },

  async setUserData(userData) {
    return await setSecureItem('user_data', userData);
  },

  async getUserData() {
    return await getSecureItem('user_data');
  },

  async clearUserData() {
    return await removeSecureItem('user_data');
  }
};

export const settingsStorage = {
  async setBiometricEnabled(enabled) {
    return await setSecureItem('biometric_enabled', enabled);
  },

  async isBiometricEnabled() {
    const result = await getSecureItem('biometric_enabled');
    return result === true;
  },

  async setAppSettings(settings) {
    return await setSecureItem('app_settings', settings);
  },

  async getAppSettings() {
    return await getSecureItem('app_settings');
  }
};
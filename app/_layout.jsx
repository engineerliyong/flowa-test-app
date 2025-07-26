import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from '../src/store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="daily-checkin" 
          options={{ 
            presentation: 'modal',
            title: 'Daily Check-in',
            headerStyle: { backgroundColor: '#FFE4F1' }
          }} 
        />
        <Stack.Screen 
          name="flow-package" 
          options={{ 
            presentation: 'modal',
            title: 'Flow Package',
            headerStyle: { backgroundColor: '#FFE4F1' }
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
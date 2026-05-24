import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="(seeker)" />
            <Stack.Screen name="(employer)" />
            <Stack.Screen
              name="job-detail"
              options={{ headerShown: true, title: 'Job Details', headerBackTitle: 'Back' }}
            />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

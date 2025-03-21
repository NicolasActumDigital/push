import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "@/lib/i18n";
import { useLanguageStore } from "@/store/languageStore";
import { useNotificationStore } from "@/store/notificationStore";

const queryClient = new QueryClient();

export default function AppLayout() {
  const { initializeLanguage } = useLanguageStore();
  const { initializeFirebase } = useNotificationStore();

  useEffect(() => {  
    // Initialize app
    initializeLanguage();
    
    // Firebase setup
    const setupFirebase = async () => {
      const cleanup = await initializeFirebase();
      return cleanup;
    };
    
    const cleanupPromise = setupFirebase();
    
    // Clean up on component unmount
    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) cleanup();
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="start"
            options={{
              headerTitle: 'Push App',
              headerShown: true,
              headerBackTitle: 'Back',
              headerStyle: { backgroundColor: '#1F1F1F' },
              headerTintColor: '#F08A77',
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
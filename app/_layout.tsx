import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "@/lib/i18n";
import { useLanguageStore } from "@/store/languageStore";
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';

const queryClient = new QueryClient();

export default function AppLayout() {
  const { initializeLanguage } = useLanguageStore();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Request notification permissions
  const requestUserPermission = async () => {
    console.log("Requesting notification permission...");
    
    try {
      // iOS requires explicit permission request
      if (Platform.OS === 'ios') {
        // Register for remote messages first - this fixes the iOS error
        await messaging().registerDeviceForRemoteMessages();
        
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
        console.log("Authorization status on iOS:", authStatus);
        return enabled;
      }
      
      // Android automatically grants permission in most cases
      return true;
    } catch (error: unknown) {
      console.error("Error requesting permission:", error);
      return false;
    }
  };

  // Get and save FCM token
  const getFirebaseToken = async () => {
    try {
      console.log("Getting FCM token...");
      const permissionGranted = await requestUserPermission();
      
      if (!permissionGranted) {
        console.log("Notification permission not granted");
        return null;
      }
      
      // Check if token exists
      let token = await messaging().getToken();
      
      if (token) {
        console.log("FCM Token:", token);
        setFcmToken(token);
        return token;
      } else {
        console.log("Failed to get token");
        return null;
      }
    } catch (error: unknown) {
      console.error("Failed to get FCM token:", error);
      
      // Type check before accessing properties
      if (error && typeof error === 'object') {
        if ('code' in error) {
          console.error("Error code:", (error as { code: unknown }).code);
        }
        if ('message' in error) {
          console.error("Error message:", (error as { message: unknown }).message);
        }
      }
      return null;
    }
  };

  useEffect(() => {  
    // Initialize app
    initializeLanguage();
    
    // Firebase setup
    const setupFirebase = async () => {
      // Get initial token
      const token = await getFirebaseToken();
      
      // Listen for token refreshes
      const unsubscribe = messaging().onTokenRefresh(newToken => {
        console.log('FCM token refreshed:', newToken);
        setFcmToken(newToken);
        // Here you would typically send this token to your backend
      });
      
      // Set up foreground message handler
      const foregroundSubscription = messaging().onMessage(async remoteMessage => {
        console.log('Foreground Message received:', remoteMessage);
        // Handle foreground messages here
        Alert.alert(
          remoteMessage.notification?.title || 'New Message',
          remoteMessage.notification?.body || 'You received a new notification'
        );
      });
      
      // Clean up on component unmount
      return () => {
        unsubscribe();
        foregroundSubscription();
      };
    };
    
    setupFirebase();
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
import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "@/lib/i18n";
import { useLanguageStore } from "@/store/languageStore";
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform, Alert } from 'react-native';

const queryClient = new QueryClient();

export default function AppLayout() {
  const { initializeLanguage } = useLanguageStore();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Check Firebase initialization status
  const checkFirebaseSetup = () => {
    // Check if Firebase is initialized
    const apps = firebase.apps;
    console.log(`Firebase apps initialized: ${apps.length}`);
    
    if (apps.length > 0) {
      // Get the default app
      const app = firebase.app();
      console.log(`Firebase app name: ${app.name}`);
      
      // Check its options
      console.log(`Firebase options:`, JSON.stringify({
        appId: app.options.appId,
        projectId: app.options.projectId,
        messagingSenderId: app.options.messagingSenderId,
        bundleId: app.options.bundleId
      }));
    } else {
      console.error("No Firebase apps initialized! Check your configuration.");
    }
  };

  // Request notification permissions
  const requestUserPermission = async () => {
    console.log("Requesting notification permission...");
    
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        console.log("Authorization status on iOS:", authStatus);
        return enabled;
      }
      
      return true;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  };

  // Get and save FCM token
  const getFirebaseToken = async () => {
    try {
      console.log("Getting FCM token...");
      
      // Check Firebase setup first
      checkFirebaseSetup();
      
      const permissionGranted = await requestUserPermission();
      
      if (!permissionGranted) {
        console.log("Notification permission not granted");
        return null;
      }
      
      // Enable auto-init for messaging
      await messaging().setAutoInitEnabled(true);
      
      // Try to get token with retry logic
      let retries = 2;
      let token = null;
      
      while (retries >= 0 && !token) {
        try {
          console.log(`Attempting to get FCM token (${retries} retries left)...`);
          token = await messaging().getToken();
          
          if (token) {
            console.log("FCM Token:", token);
            setFcmToken(token);
            return token;
          } else {
            console.log("No token received in this attempt");
            
            if (retries > 0) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (tokenError) {
          console.error("Token retrieval error:", tokenError);
          
          if (retries > 0) {
            console.log(`Will retry in 1 second...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        retries--;
      }
      
      console.log("Failed to get token after all attempts");
      return null;
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
import { create } from 'zustand';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform, Alert } from 'react-native';

interface NotificationState {
  fcmToken: string | null;
  isPermissionGranted: boolean;
  isInitialized: boolean;
  setFcmToken: (token: string) => void;
  initializeFirebase: () => Promise<(() => void) | undefined>;
  getFirebaseToken: () => Promise<string | null>;
  checkFirebaseSetup: () => boolean;
  requestUserPermission: () => Promise<boolean>;
  sendTokenToBackend: (token: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  fcmToken: null,
  isPermissionGranted: false,
  isInitialized: false,
  
  setFcmToken: (token) => set({ fcmToken: token }),
  
  checkFirebaseSetup: () => {
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
      
      return true;
    } else {
      console.error("No Firebase apps initialized! Check your configuration.");
      return false;
    }
  },
  
  requestUserPermission: async () => {
    console.log("Requesting notification permission...");
    
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        console.log("Authorization status on iOS:", authStatus);
        set({ isPermissionGranted: enabled });
        return enabled;
      }
      
      set({ isPermissionGranted: true });
      return true;
    } catch (error) {
      console.error("Error requesting permission:", error);
      set({ isPermissionGranted: false });
      return false;
    }
  },
  
  getFirebaseToken: async () => {
    try {
      console.log("Getting FCM token...");
      
      // Check Firebase setup first
      const isSetupCorrect = get().checkFirebaseSetup();
      
      if (!isSetupCorrect) {
        return null;
      }
      
      const permissionGranted = await get().requestUserPermission();
      
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
            set({ fcmToken: token });
            
            // Send token to backend
            await get().sendTokenToBackend(token);
            
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
  },
  
  sendTokenToBackend: async (token: string) => {
    // Implementation would depend on your backend API
    console.log("Would send token to backend:", token);
    // Example implementation:
    // try {
    //   const response = await fetch('https://your-api.com/register-device', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token })
    //   });
    //   const data = await response.json();
    //   console.log('Token registered with backend:', data);
    // } catch (error) {
    //   console.error('Failed to register token with backend:', error);
    // }
  },
  
  initializeFirebase: async () => {
    try {
      // Get initial token
      const token = await get().getFirebaseToken();
      
      if (token) {
        // Listen for token refreshes
        const unsubscribe = messaging().onTokenRefresh(async newToken => {
          console.log('FCM token refreshed:', newToken);
          set({ fcmToken: newToken });
          
          // Send new token to backend
          await get().sendTokenToBackend(newToken);
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
        
        // Listen for background/quit state messages
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Background Message handled:', remoteMessage);
          // Handle background messages here if needed
          return Promise.resolve();
        });
        
        set({ isInitialized: true });
        
        // Return cleanup function
        return () => {
          unsubscribe();
          foregroundSubscription();
        };
      }
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }
}));
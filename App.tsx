import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import StartScreen from '@/screens/Start';
// import HomeScreen from '@/screens/Home';
// import ItineraryScreen from '@/screens/Itinerary';
// import BookingScreen from '@/screens/Booking';
// import SettingsScreen from '@/screens/Settings';
// import QuestionnaireScreen from '@/screens/Questionnaire';

// Import components
import NavigationHeader from '@/components/common/NavigationHeader';

// Import types
import { RootStackParamList } from '@/types/navigation';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Start"
              screenOptions={{
                cardStyle: { backgroundColor: 'white' }
              }}
            >
              <Stack.Screen 
                name="Start" 
                component={StartScreen} 
                options={{
                  headerShown: true,
                  header: () => (
                    <NavigationHeader
                      className="bg-midnight"
                      navigationConfig={{
                        next: {
                          languageSelect: true,
                        },
                      }}
                    />
                  ),
                }}
              />
              
              {/* <Stack.Screen 
                name="Questionnaire" 
                component={QuestionnaireScreen} 
                options={{
                  headerShown: true,
                  header: () => (
                    <NavigationHeader
                      navigationConfig={{
                        previous: {
                          icon: true,
                          label: "Back",
                        },
                        next: {
                          icon: false,
                          label: "Skip",
                          link: "/Home",
                        },
                      }}
                    />
                  ),
                }}
              /> */}
              
              {/* <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ 
                  title: 'FastBookingNative',
                  headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  headerTintColor: '#fff',
                }}
              /> */}
              
              {/* <Stack.Screen 
                name="Itinerary" 
                component={ItineraryScreen} 
                options={{
                  headerShown: true,
                  header: () => (
                    <NavigationHeader
                      navigationConfig={{
                        previous: {
                          icon: true,
                          label: "Back to Questions",
                          link: "/Questionnaire",
                        },
                      }}
                    />
                  ),
                }}
              /> */}
              
              {/* <Stack.Screen 
                name="Booking" 
                component={BookingScreen}
                options={{
                  headerShown: true,
                  header: () => (
                    <NavigationHeader
                      navigationConfig={{
                        previous: {
                          icon: true,
                          label: "Back",
                        },
                      }}
                    />
                  ),
                }}
              /> */}
              
              {/* <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  header: () => (
                    <NavigationHeader
                      navigationConfig={{
                        previous: {
                          icon: true,
                          label: "Back",
                        },
                      }}
                    />
                  ),
                }}
              /> */}
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
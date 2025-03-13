import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import NavigationHeader from '@/components/common/NavigationHeader';

export default function StartScreen() {
  return (
    <>
      <Stack.Screen 
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Your start screen content */}
      </View>
    </>
  );
}
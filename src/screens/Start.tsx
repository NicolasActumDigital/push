import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation'; // Updated to use @ alias

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

type Props = {
  navigation: StartScreenNavigationProp;
};

const StartScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-midnight">
      <View className="flex-1 justify-center items-center p-6">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-white mb-3">FastBookingNative</Text>
          <Text className="text-xl text-gray-300 text-center">
            Discover your perfect travel itinerary based on your preferences
          </Text>
        </View>

        <TouchableOpacity
          className="bg-orange-500 px-8 py-4 rounded-full w-64 items-center"
          onPress={() => navigation.navigate('Questionnaire')}
        >
          <Text className="text-white text-lg font-semibold">Start Answering Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-6"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-gray-300 text-base">Skip to Main Screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;
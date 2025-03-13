import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface NavigationConfigPrevious {
  icon?: boolean;
  label?: string;
  link?: string;
  onTrigger?: () => void;
  infoIcon?: boolean;
  iconSize?: number;
}

interface NavigationConfigNext {
  icon?: boolean;
  label?: string;
  link?: string;
  closeIcon?: boolean;
  onTrigger?: () => void;
  languageSelect?: boolean;
}

interface NavigationConfig {
  previous?: NavigationConfigPrevious;
  next?: NavigationConfigNext;
}

interface NavigationHeaderProps {
  className?: string;
  navigationConfig?: NavigationConfig;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  className = "bg-white",
  navigationConfig = {},
}) => {
  const navigation = useNavigation();
  
  const handlePreviousPress = () => {
    if (navigationConfig.previous?.onTrigger) {
      navigationConfig.previous.onTrigger();
    } else if (navigationConfig.previous?.link) {
      // @ts-ignore - Adding dynamic navigation
      navigation.navigate(navigationConfig.previous.link.replace('/', ''));
    } else {
      navigation.goBack();
    }
  };

  const handleNextPress = () => {
    if (navigationConfig.next?.onTrigger) {
      navigationConfig.next.onTrigger();
    } else if (navigationConfig.next?.link) {
      // @ts-ignore - Adding dynamic navigation
      navigation.navigate(navigationConfig.next.link.replace('/', ''));
    }
  };

  const isDarkBackground = className.includes('midnight');

  return (
    <View className={`flex-row justify-between items-center px-4 py-3 ${className}`}>
      {/* Left/Previous Section */}
      {navigationConfig.previous && (
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={handlePreviousPress}
        >
          {navigationConfig.previous.icon && (
            <Ionicons 
              name="chevron-back" 
              size={navigationConfig.previous.iconSize || 24} 
              color={isDarkBackground ? "white" : "black"} 
            />
          )}
          {navigationConfig.previous.infoIcon && (
            <Ionicons 
              name="information-circle-outline" 
              size={navigationConfig.previous.iconSize || 24} 
              color={isDarkBackground ? "white" : "black"} 
            />
          )}
          {navigationConfig.previous.label && (
            <Text 
              className={`text-base ${isDarkBackground ? "text-white" : "text-black"}`}
            >
              {navigationConfig.previous.label}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Empty middle section for spacing */}
      <View />

      {/* Right/Next Section */}
      {navigationConfig.next && (
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={handleNextPress}
        >
          {navigationConfig.next.label && (
            <Text 
              className={`text-base ${isDarkBackground ? "text-white" : "text-black"}`}
            >
              {navigationConfig.next.label}
            </Text>
          )}
          {navigationConfig.next.closeIcon && (
            <Ionicons 
              name="close" 
              size={24} 
              color={isDarkBackground ? "white" : "black"} 
            />
          )}
          {navigationConfig.next.languageSelect && (
            <Ionicons 
              name="language" 
              size={24} 
              color={isDarkBackground ? "white" : "black"} 
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NavigationHeader;
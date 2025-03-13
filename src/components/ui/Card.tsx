import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  onPress,
  footer,
  className = "",
  contentClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  footerClassName = "",
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      onPress={onPress}
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 ${className}`}
    >
      {(title || subtitle) && (
        <View className="px-4 pt-4 pb-2">
          {title && (
            <Text className={`text-lg font-semibold text-charcoal ${titleClassName}`}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className={`text-sm text-gray-500 mt-1 ${subtitleClassName}`}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      
      <View className={`px-4 py-3 ${contentClassName}`}>
        {children}
      </View>
      
      {footer && (
        <View className={`px-4 py-3 border-t border-gray-100 ${footerClassName}`}>
          {footer}
        </View>
      )}
    </CardContainer>
  );
};

export default Card;
import React from 'react';
import { View, Image, Text } from 'react-native';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: AvatarSize;
  className?: string;
  textClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  className = "",
  textClassName = "",
}) => {
  // Size mappings
  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses: Record<AvatarSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // Generate initials from name
  const getInitials = (): string => {
    if (!name) return '';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View
      className={`rounded-full overflow-hidden bg-terracotta items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {source ? (
        <Image source={source} className="w-full h-full" />
      ) : (
        <Text className={`text-white font-medium ${textSizeClasses[size]} ${textClassName}`}>
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
import React from 'react';
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      disabled={disabled}
      className={`flex-row items-center ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <View
        className={`w-12 h-6 rounded-full ${
          value ? 'bg-terracotta' : 'bg-gray-300'
        } justify-center px-0.5`}
      >
        <Animated.View
          className="w-5 h-5 bg-white rounded-full shadow-sm"
          style={{
            transform: [{ translateX }],
          }}
        />
      </View>
      
      {label && (
        <Text className={`ml-2 text-charcoal ${labelClassName}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Toggle;
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      onPress={() => !disabled && onChange(!checked)}
      className={`flex-row items-center ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <View
        className={`w-5 h-5 items-center justify-center rounded border ${
          checked 
            ? 'bg-terracotta border-terracotta' 
            : 'border-gray-300 bg-white'
        }`}
      >
        {checked && (
          <Ionicons name="checkmark" size={14} color="white" />
        )}
      </View>
      
      {label && (
        <Text className={`ml-2 text-charcoal ${labelClassName}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
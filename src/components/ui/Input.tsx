import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className={`text-base text-gray-700 mb-1 ${labelClassName}`}>{label}</Text>
      )}
      
      <View 
        className={`flex-row items-center border rounded-lg px-3 py-2 ${
          isFocused 
            ? 'border-terracotta' 
            : error 
              ? 'border-red-500' 
              : 'border-gray-300'
        } bg-white`}
      >
        {leftIcon && (
          <View className="mr-2">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          className={`flex-1 text-base text-charcoal h-10 ${inputClassName}`}
          placeholderTextColor="#A0AEC0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry ? (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={24} 
              color="#718096"
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View>
            {rightIcon}
          </View>
        ) : null}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
      
      {helperText && !error && (
        <Text className="text-gray-500 text-sm mt-1">{helperText}</Text>
      )}
    </View>
  );
};

export default Input;
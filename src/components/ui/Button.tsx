import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "items-center justify-center rounded-lg",
  {
    variants: {
      variant: {
        primary: "bg-terracotta",
        secondary: "bg-transparent border border-terracotta",
        outline: "bg-transparent border border-gray-300",
        ghost: "bg-transparent",
        link: "bg-transparent underline-offset-4 p-0 h-auto",
      },
      size: {
        sm: "py-2 px-3 text-sm",
        md: "py-3 px-4",
        lg: "py-4 px-6 text-lg",
        icon: "p-2",
        full: "py-3 w-full"
      },
      disabled: {
        true: "opacity-50",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const textVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-terracotta",
      outline: "text-charcoal",
      ghost: "text-terracotta",
      link: "text-terracotta underline",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      icon: "text-base",
      full: "text-base"
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  onPress,
  className = "",
  textClassName = "",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${buttonVariants({ variant, size, disabled: disabled || isLoading })} ${className}`}
    >
      <View className="flex-row items-center justify-center">
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? 'white' : '#E2725B'} 
            className="mr-2" 
          />
        ) : leftIcon ? (
          <View className="mr-2">{leftIcon}</View>
        ) : null}
        
        {typeof children === 'string' ? (
          <Text className={`${textVariants({ variant, size })} ${textClassName}`}>
            {children}
          </Text>
        ) : (
          children
        )}
        
        {rightIcon && !isLoading && (
          <View className="ml-2">{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
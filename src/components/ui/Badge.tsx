import React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "rounded-full px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-terracotta",
        secondary: "bg-gray-200",
        outline: "bg-transparent border border-terracotta",
        success: "bg-green-100",
        warning: "bg-yellow-100",
        error: "bg-red-100",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const textVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-gray-700",
      outline: "text-terracotta",
      success: "text-green-800",
      warning: "text-yellow-800",
      error: "text-red-800",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  size,
  className = "",
  textClassName = "",
}) => {
  return (
    <View className={`${badgeVariants({ variant, size })} ${className}`}>
      <Text className={`${textVariants({ variant, size })} ${textClassName}`}>
        {children}
      </Text>
    </View>
  );
};

export default Badge;
/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  
  interface TextProps {
    className?: string;
  }
  
  interface ImageProps {
    className?: string;
  }
  
  interface TouchableOpacityProps {
    className?: string;
  }
  
  interface TouchableHighlightProps {
    className?: string;
  }
  
  interface SafeAreaViewProps {
    className?: string;
  }
  
  interface ScrollViewProps {
    className?: string;
  }
  
  interface FlatListProps<ItemT> {
    className?: string;
    contentContainerClassName?: string;
  }
}
import React, { memo, useMemo } from 'react';
import { View, Linking } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTranslation } from 'react-i18next';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

interface LegalInfoDisplayProps {
  className?: string;
}

const LegalInfoDisplay: React.FC<LegalInfoDisplayProps> = memo(({ className = '' }) => {
  const { t, i18n } = useTranslation();
  
  // Get app version dynamically
  const appVersion = useMemo(() => {
    const version = Application.nativeApplicationVersion || '1.0.0';
    const buildNumber = Application.nativeBuildVersion || '1';
    
    if (__DEV__) {
      return buildNumber;
    }
    return `${version} (${buildNumber})`;
  }, []);

  // Get current language
  const currentLanguage = i18n.language || 'en';
  
  return (
    <View className={`items-center ${className} pb-3`}>
      {/* Version info */}
      <View className="items-center justify-center mt-1">
        <Text className="text-gray-300 text-xs text-center">
          {t('screens.start.version', 'Version')} {appVersion}
        </Text>
      </View>
      
      {/* Device info - optional */}
      {__DEV__ && (
        <Text className="text-gray-400 text-xs mt-1">
          {Device.modelName} ({Device.osName} {Device.osVersion})
        </Text>
      )}

      {/* Copyright */}
      <Text className="text-gray-300 text-xs mt-2">
        © {new Date().getFullYear()} FastBooking
      </Text>
    </View>
  );
});

export default LegalInfoDisplay;
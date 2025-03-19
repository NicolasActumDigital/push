import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";
import { View, Dimensions, Platform, StatusBar } 
from "react-native";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";
import Button  from "@components/ui/Button";
import LegalInfo from "@/components/layout/LegalInfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logo } from "@/assets/svgs/logo"

export default function StartUI() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  
  return (
    <View className="flex-1 bg-charcoal">
      <StatusBar barStyle="light-content" />
      <View 
        className="flex-1 px-6" 
        style={{ 
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: insets.bottom + 12
        }}
      >
        <View className="items-center">
          <Text className="text-white text-5xl">{t("screens.start.title")}</Text>
        </View>
        
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center mb-20">
          <SvgXml xml={logo} width={200} height={200} />
          </View>
          <View className="items-center justify-center mb-10">
            <Text 
              className="text-white text-center font-normal text-lg leading-relaxed"
              style={{ maxWidth: 320 }}
            >
              {t("screens.start.description")}
            </Text>
          </View>
        </View>
        <LegalInfo />
      </View>
    </View>
  );
}
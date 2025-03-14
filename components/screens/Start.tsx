import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";
import { View, Image, Dimensions, Platform, StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import Button  from "@components/ui/Button";
import LegalInfo from "@/components/layout/LegalInfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StartUI() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  // Calculate dynamic image height based on screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const imageHeight = Platform.OS === "ios" ? screenHeight * 0.4 : screenHeight * 0.35;
  
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
          <Text>{t("screens.start.title")}</Text>
        </View>
        
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center mb-8">
            <Image
              style={{ 
                height: imageHeight, 
                width: screenWidth * 0.85,
                maxWidth: 500
              }}
              source={require("@/assets/images/fastbooking.png")}
              resizeMode="contain"
            />
          </View>
          <View className="items-center justify-center mb-10">
            <Text 
              className="text-white text-center font-normal text-lg leading-relaxed"
              style={{ maxWidth: 320 }}
            >
              {t("screens.start.description") || "Travel made simple, booking made fast. Your journey starts here."}
            </Text>
          </View>
          <Link asChild href="/onboarding">
            <Button className="bg-terracotta px-10 py-4 rounded-xl">
              <Text className="text-white text-lg font-bold">
                {t("screens.start.getStarted") || "Get Started"}
              </Text>
            </Button>
          </Link>
        </View>
        <LegalInfo />
      </View>
    </View>
  );
}
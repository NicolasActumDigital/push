// _layout.tsx
import "../global.css";
import { Stack } from "expo-router";
import { memo, useCallback, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/languageStore";

const queryClient = new QueryClient();

export default function AppLayout() {
  const { t } = useTranslation();
  const { initializeLanguage } = useLanguageStore();
  useEffect(() => {
    initializeLanguage();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="start"
            options={{
              headerTitle: 'Get Started',
              headerShown: true,
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
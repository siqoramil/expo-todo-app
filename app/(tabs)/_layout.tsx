import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const iconSize = isSmall ? 22 : 24;
  const tabHeight = Platform.select({ ios: undefined, default: isSmall ? 56 : 62 });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[effectiveTheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute' as const,
          },
          default: {
            elevation: 8,
            borderTopWidth: 0,
            height: tabHeight,
          },
        }),
        tabBarLabelStyle: { fontSize: isSmall ? 10 : 11, fontWeight: '600' as const },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('myTasks'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'clipboard' : 'clipboard-outline'}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('statistics'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

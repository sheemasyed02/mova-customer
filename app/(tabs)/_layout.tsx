import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/CustomTabBar';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ScrollProvider } from '@/contexts/ScrollContext';

// Tab Bar Icon component using Ionicons
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ScrollProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: useClientOnlyValue(false, true),
        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "home" : "home-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "search" : "search-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "car" : "car-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: 'My Bookings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "list" : "list-outline"} 
              color={color} 
            />
          ),
        }}
      />
      </Tabs>
    </ScrollProvider>
  );
}
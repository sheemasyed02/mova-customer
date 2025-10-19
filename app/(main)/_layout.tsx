import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/src/shared/components/navigation/custom-tab-bar';
import { Colors } from '@/src/shared/constants/Colors';
import { ScrollProvider } from '@/src/shared/contexts/ScrollContext';
import { useClientOnlyValue } from '@/src/shared/hooks/use-client-only-value';
import { useColorScheme } from '@/src/shared/hooks/use-color-scheme';

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
          tabBarActiveTintColor: Colors.primary.teal,
          tabBarInactiveTintColor: Colors.text.secondary,
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
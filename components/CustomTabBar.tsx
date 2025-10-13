import { Colors } from '@/constants/Colors';
import { useScrollContext } from '@/contexts/ScrollContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AnimatedTabBar } from './AnimatedTabBar';

interface TabItem {
  key: string;
  name: string;
  focused: boolean;
  color: string;
  icon: string;
  focusedIcon: string;
}

export const CustomTabBar: React.FC<BottomTabBarProps> = React.memo(({
  state,
  descriptors,
  navigation,
}) => {
  const { scrollDirection } = useScrollContext();

  const getTabIcon = (routeName: string, focused: boolean): string => {
    const iconMap: Record<string, { focused: string; unfocused: string }> = {
      index: { focused: 'home', unfocused: 'home-outline' },
      explore: { focused: 'search', unfocused: 'search-outline' },
      trips: { focused: 'car-sport', unfocused: 'car-sport-outline' },
      inbox: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' },
      bookings: { focused: 'calendar', unfocused: 'calendar-outline' },
    };

    return focused 
      ? iconMap[routeName]?.focused || 'ellipse'
      : iconMap[routeName]?.unfocused || 'ellipse-outline';
  };

  const getTabLabel = (routeName: string): string => {
    const labelMap: Record<string, string> = {
      index: 'Home',
      explore: 'Explore',
      trips: 'My Trips',
      inbox: 'Inbox',
      bookings: 'Bookings',
    };

    return labelMap[routeName] || routeName;
  };

  return (
    <AnimatedTabBar scrollDirection={scrollDirection}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconName = getTabIcon(route.name, isFocused);
          const label = getTabLabel(route.name);
          const color = isFocused ? Colors.primary.teal : Colors.text.secondary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerActive]}>
                <Ionicons 
                  name={iconName as any} 
                  size={26} 
                  color={color} 
                />
              </View>
              <Text style={[styles.tabLabel, { color }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </AnimatedTabBar>
  );
});

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    minHeight: 56,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabIconContainerActive: {
    backgroundColor: `${Colors.primary.teal}15`,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 13,
  },
});
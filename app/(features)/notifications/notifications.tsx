import React, { useState } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/shared/constants/Colors';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'offer' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color: string;
}

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filter tabs
  const filterTabs: FilterTab[] = [
    { id: 'all', label: 'All', count: 12 },
    { id: 'booking', label: 'Bookings', count: 5 },
    { id: 'payment', label: 'Payments', count: 3 },
    { id: 'offer', label: 'Offers', count: 4 },
  ];

  // Sample notifications
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking #MOV-12345 is confirmed!',
      time: '2 hours ago',
      isRead: false,
      icon: 'checkmark-circle',
      color: Colors.functional.success,
    },
    {
      id: '2',
      type: 'booking',
      title: 'Pickup Reminder',
      message: 'Pickup in 2 hours - Hyundai Creta',
      time: '2 hours ago',
      isRead: false,
      icon: 'time',
      color: Colors.primary.teal,
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Successful',
      message: '₹6,844 paid for booking #MOV-12345',
      time: '1 day ago',
      isRead: true,
      icon: 'card',
      color: Colors.functional.success,
    },
    {
      id: '4',
      type: 'offer',
      title: 'Special Offer',
      message: '20% off on SUVs this weekend!',
      time: '1 day ago',
      isRead: false,
      icon: 'gift',
      color: Colors.functional.warning,
    },
    {
      id: '5',
      type: 'system',
      title: 'App Updated',
      message: 'New features and improvements available',
      time: '2 days ago',
      isRead: true,
      icon: 'download',
      color: Colors.accent.blue,
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderFilterTab = (tab: FilterTab) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.filterTab,
        activeFilter === tab.id && styles.filterTabActive
      ]}
      onPress={() => setActiveFilter(tab.id)}
    >
      <Text style={[
        styles.filterTabText,
        activeFilter === tab.id && styles.filterTabTextActive
      ]}>
        {tab.label}
      </Text>
      {tab.count > 0 && (
        <View style={[
          styles.filterBadge,
          activeFilter === tab.id && styles.filterBadgeActive
        ]}>
          <Text style={[
            styles.filterBadgeText,
            activeFilter === tab.id && styles.filterBadgeTextActive
          ]}>
            {tab.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationCard}>
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        
        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notifications</Text>
        
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterTabs}
          renderItem={({ item }) => renderFilterTab(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filterContent}
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={Colors.text.light} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyMessage}>You're all caught up!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter Styles
  filterContainer: {
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: Colors.primary.teal,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTabTextActive: {
    color: Colors.text.white,
    fontWeight: '600',
  },
  filterBadge: {
    marginLeft: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: Colors.primary.teal,
    minWidth: 16,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: Colors.background.white,
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.text.white,
  },
  filterBadgeTextActive: {
    color: Colors.primary.teal,
  },

  // Notification Styles
  listContent: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.teal,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: Colors.text.light,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
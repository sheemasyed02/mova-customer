import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  type: 'owner' | 'support' | 'notification';
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
  bookingId?: string;
  vehicleThumbnail?: string;
  ticketId?: string;
  priority?: 'low' | 'medium' | 'high';
  hasImage?: boolean;
  isArchived: boolean;
  isSystemMessage: boolean;
}

interface TabItem {
  id: string;
  title: string;
  count: number;
}

export default function InboxScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filterOptions = ['All', 'Owners', 'Support', 'Notifications'];
  
  const tabs: TabItem[] = [
    { id: 'all', title: 'All Messages', count: 12 },
    { id: 'booking', title: 'Booking Related', count: 5 },
    { id: 'promotions', title: 'Promotions', count: 3 },
    { id: 'archived', title: 'Archived', count: 8 },
  ];

  // Sample data - replace with API data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'owner',
      name: 'Amit Motors',
      avatar: '👨‍💼',
      lastMessage: 'Vehicle is ready for pickup. Please arrive by 10 AM.',
      timestamp: '2 min ago',
      unreadCount: 2,
      isPinned: true,
      bookingId: 'BK001234',
      vehicleThumbnail: '🚗',
      isArchived: false,
      isSystemMessage: false,
    },
    {
      id: '2',
      type: 'support',
      name: 'MOVA Support',
      avatar: '🛠️',
      lastMessage: 'We have received your complaint and will resolve it within 24 hours.',
      timestamp: '1 hour ago',
      unreadCount: 0,
      isPinned: false,
      ticketId: 'TK005678',
      priority: 'high',
      isArchived: false,
      isSystemMessage: false,
    },
    {
      id: '3',
      type: 'notification',
      name: 'MOVA Booking',
      avatar: '📱',
      lastMessage: 'Your booking has been confirmed. Booking ID: BK001235',
      timestamp: '3 hours ago',
      unreadCount: 1,
      isPinned: false,
      bookingId: 'BK001235',
      isArchived: false,
      isSystemMessage: true,
    },
    {
      id: '4',
      type: 'owner',
      name: 'Royal Car Rentals',
      avatar: '👑',
      lastMessage: 'Thank you for choosing us! Please rate your experience.',
      timestamp: '5 hours ago',
      unreadCount: 0,
      isPinned: false,
      bookingId: 'BK001233',
      vehicleThumbnail: '🚙',
      hasImage: true,
      isArchived: false,
      isSystemMessage: false,
    },
    {
      id: '5',
      type: 'notification',
      name: 'MOVA Offers',
      avatar: '🎁',
      lastMessage: 'Get 20% off on your next booking! Use code SAVE20',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isSystemMessage: true,
    },
    {
      id: '6',
      type: 'support',
      name: 'MOVA Support',
      avatar: '🛠️',
      lastMessage: 'Your refund has been processed successfully.',
      timestamp: '2 days ago',
      unreadCount: 0,
      isPinned: false,
      ticketId: 'TK005677',
      priority: 'medium',
      isArchived: false,
      isSystemMessage: false,
    },
  ]);

  const getUnreadCount = () => {
    return messages.reduce((total, message) => total + message.unreadCount, 0);
  };

  const getFilteredMessages = () => {
    let filtered = messages;

    // Filter by current tab
    if (selectedTab === 'booking') {
      filtered = filtered.filter(m => m.bookingId);
    } else if (selectedTab === 'promotions') {
      filtered = filtered.filter(m => m.type === 'notification' && m.name.includes('Offers'));
    } else if (selectedTab === 'archived') {
      filtered = filtered.filter(m => m.isArchived);
    } else {
      filtered = filtered.filter(m => !m.isArchived);
    }

    // Filter by type
    if (selectedFilter === 'Owners') {
      filtered = filtered.filter(m => m.type === 'owner');
    } else if (selectedFilter === 'Support') {
      filtered = filtered.filter(m => m.type === 'support');
    } else if (selectedFilter === 'Notifications') {
      filtered = filtered.filter(m => m.type === 'notification');
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchText.toLowerCase()) ||
        m.lastMessage.toLowerCase().includes(searchText.toLowerCase()) ||
        (m.bookingId && m.bookingId.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleMessagePress = (message: Message) => {
    // Mark as read
    setMessages(prev => prev.map(m => 
      m.id === message.id ? { ...m, unreadCount: 0 } : m
    ));

    // Navigate to conversation
    router.push({
      pathname: '/conversation' as any,
      params: {
        messageId: message.id,
        messageType: message.type,
        messageName: message.name,
        bookingId: message.bookingId || '',
        ticketId: message.ticketId || '',
      }
    });
  };

  const handleLongPress = (message: Message) => {
    const options = [
      message.isPinned ? 'Unpin' : 'Pin',
      message.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread',
      'Archive',
      'Delete',
      'Cancel'
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 3,
          cancelButtonIndex: 4,
        },
        (buttonIndex) => {
          handleMessageAction(message, buttonIndex);
        }
      );
    } else {
      Alert.alert(
        'Message Options',
        'Choose an action',
        [
          {
            text: options[0],
            onPress: () => handleMessageAction(message, 0),
          },
          {
            text: options[1],
            onPress: () => handleMessageAction(message, 1),
          },
          {
            text: options[2],
            onPress: () => handleMessageAction(message, 2),
          },
          {
            text: options[3],
            onPress: () => handleMessageAction(message, 3),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleMessageAction = (message: Message, actionIndex: number) => {
    switch (actionIndex) {
      case 0: // Pin/Unpin
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isPinned: !m.isPinned } : m
        ));
        break;
      case 1: // Mark read/unread
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, unreadCount: m.unreadCount > 0 ? 0 : 1 } : m
        ));
        break;
      case 2: // Archive
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isArchived: !m.isArchived } : m
        ));
        break;
      case 3: // Delete
        Alert.alert(
          'Delete Message',
          'Are you sure you want to delete this conversation?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => setMessages(prev => prev.filter(m => m.id !== message.id))
            }
          ]
        );
        break;
    }
  };

  const renderSwipeActions = (message: Message, direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Archive action
      return (
        <View style={styles.swipeAction}>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: Colors.accent.blue }]}
            onPress={() => handleMessageAction(message, 2)}
          >
            <Ionicons name="archive" size={20} color="#ffffff" />
            <Text style={styles.swipeButtonText}>Archive</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // Delete action
      return (
        <View style={styles.swipeAction}>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: Colors.functional.error }]}
            onPress={() => handleMessageAction(message, 3)}
          >
            <Ionicons name="trash" size={20} color="#ffffff" />
            <Text style={styles.swipeButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Inbox</Text>
          {getUnreadCount() > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{getUnreadCount()}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options" size={20} color={Colors.primary.teal} />
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter && styles.filterChipTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={Colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchText('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            selectedTab === tab.id && styles.tabActive
          ]}
          onPress={() => setSelectedTab(tab.id)}
        >
          <Text style={[
            styles.tabText,
            selectedTab === tab.id && styles.tabTextActive
          ]}>
            {tab.title}
          </Text>
          {tab.count > 0 && (
            <View style={[
              styles.tabBadge,
              selectedTab === tab.id && styles.tabBadgeActive
            ]}>
              <Text style={[
                styles.tabBadgeText,
                selectedTab === tab.id && styles.tabBadgeTextActive
              ]}>
                {tab.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageItem,
        item.unreadCount > 0 && styles.messageItemUnread
      ]}
      onPress={() => handleMessagePress(item)}
      onLongPress={() => handleLongPress(item)}
    >
        <View style={styles.messageLeft}>
          <View style={styles.avatarContainer}>
            <View style={[
              styles.avatar,
              item.type === 'owner' && styles.avatarOwner,
              item.type === 'support' && styles.avatarSupport,
              item.type === 'notification' && styles.avatarNotification,
            ]}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
            
            {item.unreadCount > 0 && (
              <View style={styles.unreadIndicator} />
            )}
          </View>
        </View>

        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <View style={styles.messageNameRow}>
              <Text style={styles.messageName}>{item.name}</Text>
              {item.isPinned && (
                <Ionicons name="pin" size={14} color={Colors.primary.teal} style={styles.pinIcon} />
              )}
              {item.priority && (
                <View style={[
                  styles.priorityIndicator,
                  item.priority === 'high' && styles.priorityHigh,
                  item.priority === 'medium' && styles.priorityMedium,
                ]} />
              )}
            </View>
            <Text style={styles.messageTime}>{item.timestamp}</Text>
          </View>

          {item.bookingId && (
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingId}>#{item.bookingId}</Text>
              {item.vehicleThumbnail && (
                <Text style={styles.vehicleThumbnail}>{item.vehicleThumbnail}</Text>
              )}
            </View>
          )}

          {item.ticketId && (
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketId}>Ticket: {item.ticketId}</Text>
            </View>
          )}

          <View style={styles.messagePreview}>
            <Text 
              style={[
                styles.messageText,
                item.unreadCount > 0 && styles.messageTextUnread
              ]}
              numberOfLines={2}
            >
              {item.lastMessage}
            </Text>
            
            {item.hasImage && (
              <View style={styles.imageIndicator}>
                <Ionicons name="image" size={14} color={Colors.text.secondary} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.messageRight}>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
          
          <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
        </View>
      </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubbles-outline" size={80} color={Colors.text.secondary} />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Messages from owners and support will appear here
      </Text>
    </View>
  );

  const filteredMessages = getFilteredMessages();

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      {renderTabs()}
      
      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  header: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerBadge: {
    backgroundColor: Colors.functional.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 20,
  },
  tabActive: {
    borderBottomColor: Colors.primary.teal,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: Colors.primary.teal,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 100,
  },
  messageItem: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageItemUnread: {
    backgroundColor: '#F8FFFE',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.teal,
  },
  messageLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  avatarOwner: {
    backgroundColor: '#FEF3C7',
  },
  avatarSupport: {
    backgroundColor: '#DBEAFE',
  },
  avatarNotification: {
    backgroundColor: '#F3E8FF',
  },
  avatarText: {
    fontSize: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.functional.error,
    borderWidth: 2,
    borderColor: Colors.background.white,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  messageNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  pinIcon: {
    marginLeft: 6,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  priorityHigh: {
    backgroundColor: Colors.functional.error,
  },
  priorityMedium: {
    backgroundColor: Colors.functional.warning,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vehicleThumbnail: {
    fontSize: 14,
    marginLeft: 8,
  },
  ticketInfo: {
    marginBottom: 4,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.accent.blue,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  messageTextUnread: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  imageIndicator: {
    marginLeft: 8,
  },
  messageRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  unreadBadge: {
    backgroundColor: Colors.primary.teal,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
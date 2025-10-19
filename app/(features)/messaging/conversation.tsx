import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  messageType: 'text' | 'image' | 'system';
  imageUrl?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface BookingDetails {
  bookingId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
}

export default function ConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  
  const messageId = Array.isArray(params.messageId) ? params.messageId[0] : params.messageId;
  const messageType = Array.isArray(params.messageType) ? params.messageType[0] : params.messageType;
  const messageName = Array.isArray(params.messageName) ? params.messageName[0] : params.messageName;
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId;
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;

  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sample conversation data
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      senderId: 'owner1',
      senderName: 'Amit Motors',
      message: 'Hello! Thank you for booking with us.',
      timestamp: '10:30 AM',
      isOwn: false,
      messageType: 'text',
      status: 'read',
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      message: 'Hi! When can I pick up the vehicle?',
      timestamp: '10:32 AM',
      isOwn: true,
      messageType: 'text',
      status: 'read',
    },
    {
      id: '3',
      senderId: 'owner1',
      senderName: 'Amit Motors',
      message: 'Vehicle is ready for pickup. Please arrive by 10 AM tomorrow.',
      timestamp: '10:35 AM',
      isOwn: false,
      messageType: 'text',
      status: 'read',
    },
    {
      id: '4',
      senderId: 'system',
      senderName: 'System',
      message: 'Booking confirmed. Your vehicle is ready for pickup.',
      timestamp: '10:36 AM',
      isOwn: false,
      messageType: 'system',
      status: 'delivered',
    },
  ]);

  // Sample booking details
  const bookingDetails: BookingDetails | null = bookingId ? {
    bookingId: bookingId,
    vehicleName: 'Maruti Swift Dzire 2023',
    vehicleImage: '🚗',
    startDate: 'Oct 16, 2025',
    endDate: 'Oct 18, 2025',
    totalAmount: 3600,
    status: 'Confirmed',
  } : null;

  const isSystemMessage = messageType === 'notification';
  const isOwnerConversation = messageType === 'owner';
  const isSupportConversation = messageType === 'support';

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (messageText.trim() === '' || isSystemMessage) return;

    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      message: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      messageType: 'text',
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'sent' } : m
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'delivered' } : m
      ));
    }, 2000);
  };

  const handleCall = () => {
    if (isOwnerConversation) {
      const phoneNumber = '+91-9876543210'; // Sample number
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsApp = () => {
    if (isOwnerConversation) {
      const phoneNumber = '919876543210'; // Sample number
      const message = `Hi, I'm contacting about booking ${bookingId}`;
      Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{messageName || 'Conversation'}</Text>
        {ticketId && (
          <Text style={styles.headerSubtitle}>Ticket: {ticketId}</Text>
        )}
        {bookingId && (
          <Text style={styles.headerSubtitle}>Booking: #{bookingId}</Text>
        )}
      </View>
      
      {isOwnerConversation && (
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color={Colors.primary.teal} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderBookingCard = () => {
    if (!bookingDetails) return null;

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingTitle}>Booking Details</Text>
          <View style={[
            styles.statusBadge,
            bookingDetails.status === 'Confirmed' && styles.statusConfirmed,
          ]}>
            <Text style={styles.statusText}>{bookingDetails.status}</Text>
          </View>
        </View>
        
        <View style={styles.bookingContent}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleEmoji}>{bookingDetails.vehicleImage}</Text>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>{bookingDetails.vehicleName}</Text>
              <Text style={styles.bookingDates}>
                {bookingDetails.startDate} - {bookingDetails.endDate}
              </Text>
            </View>
          </View>
          
          <View style={styles.bookingAmount}>
            <Text style={styles.amountText}>₹{bookingDetails.totalAmount}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item, index }: { item: ConversationMessage; index: number }) => {
    const isSystem = item.messageType === 'system';
    const showTimestamp = index === 0 || 
      messages[index - 1].timestamp !== item.timestamp;

    if (isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessage}>
            <Ionicons name="information-circle" size={16} color={Colors.primary.teal} />
            <Text style={styles.systemMessageText}>{item.message}</Text>
          </View>
          <Text style={styles.systemMessageTime}>{item.timestamp}</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageContainer}>
        {showTimestamp && (
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        )}
        
        <View style={[
          styles.messageBubble,
          item.isOwn ? styles.ownMessage : styles.otherMessage
        ]}>
          {!item.isOwn && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          
          <Text style={[
            styles.messageText,
            item.isOwn ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.message}
          </Text>
          
          {item.isOwn && (
            <View style={styles.messageStatus}>
              {item.status === 'sending' && (
                <Ionicons name="time" size={12} color={Colors.text.secondary} />
              )}
              {item.status === 'sent' && (
                <Ionicons name="checkmark" size={12} color={Colors.text.secondary} />
              )}
              {item.status === 'delivered' && (
                <Ionicons name="checkmark-done" size={12} color={Colors.text.secondary} />
              )}
              {item.status === 'read' && (
                <Ionicons name="checkmark-done" size={12} color={Colors.primary.teal} />
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderInput = () => {
    if (isSystemMessage) {
      return (
        <View style={styles.readOnlyContainer}>
          <Text style={styles.readOnlyText}>
            This is a system notification. You cannot reply to this message.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.text.secondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim().length > 0 && styles.sendButtonActive
            ]}
            onPress={sendMessage}
            disabled={messageText.trim().length === 0}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={messageText.trim().length > 0 ? '#ffffff' : Colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderBookingCard}
        />
        
        {renderInput()}
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: Colors.background.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bookingDates: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  bookingAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 0,
  },
  messageContainer: {
    marginBottom: 16,
  },
  timestamp: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary.teal,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.teal,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: Colors.text.primary,
  },
  messageStatus: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: width * 0.8,
  },
  systemMessageText: {
    fontSize: 12,
    color: Colors.primary.teal,
    marginLeft: 6,
    textAlign: 'center',
  },
  systemMessageTime: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary.teal,
  },
  readOnlyContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F59E0B',
  },
  readOnlyText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
});
/**
 * Chat/Conversation Screen
 * 
 * Navigation Usage:
 * 
 * // Navigate to chat from inbox or anywhere:
 * router.push({
 *   pathname: '/chat/[id]',
 *   params: {
 *     id: messageId,
 *     contactName: 'Amit Motors',
 *     contactType: 'owner', // 'owner' | 'support'
 *     bookingId: 'MOV-12345'
 *   }
 * });
 * 
 * Features:
 * - Real-time messaging with owner/support
 * - Booking context card (collapsible)
 * - Multiple message types (text, image, voice, location, system)
 * - Message status indicators (sent, delivered, read)
 * - Quick reply suggestions
 * - Voice message recording
 * - File attachments (camera, gallery, documents, location)
 * - Typing indicators
 * - Contact info actions (profile, booking details, report, block)
 * - Audio/video calling
 * - Safety features and warnings
 */

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice' | 'location' | 'system';
  imageUri?: string;
  voiceDuration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface QuickReply {
  id: string;
  text: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id, contactName, contactType, bookingId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [message, setMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingCard, setShowBookingCard] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Dynamic contact data based on params
  const contact: Contact = {
    id: id as string,
    name: contactName as string || 'Customer Support',
    avatar: contactType === 'owner' ? '👨‍💼' : contactType === 'support' ? '🎧' : '📞',
    status: contactType === 'support' ? 'Online' : 'Last seen 5 min ago',
    isOnline: contactType === 'support' ? true : Math.random() > 0.5,
  };

  // Dynamic booking data based on params
  const bookingData = {
    id: bookingId as string || 'MOV-12345',
    status: 'Confirmed',
    dates: '15-17 Jan',
    vehicle: {
      name: contactType === 'owner' ? (contactName as string)?.replace(' Motors', '') || 'Vehicle' : 'Vehicle',
      image: '🚗',
      thumbnail: 'https://example.com/vehicle.jpg'
    }
  };

  // Dynamic messages based on contact type
  const getInitialMessages = (): Message[] => {
    if (contactType === 'support') {
      return [
        {
          id: '1',
          text: 'Hello! How can I help you today?',
          isOwn: false,
          timestamp: '5 min ago',
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          text: 'Hi, I need help with my booking',
          isOwn: true,
          timestamp: '4 min ago',
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          text: 'I\'d be happy to help! What\'s your booking ID?',
          isOwn: false,
          timestamp: '3 min ago',
          status: 'read',
          type: 'text'
        }
      ];
    } else {
      return [
        {
          id: '1',
          text: `✅ Booking confirmed for ${bookingData.id}`,
          isOwn: false,
          timestamp: '2 hours ago',
          status: 'read',
          type: 'system'
        },
        {
          id: '2',
          text: 'Thank you! What time should I come for pickup?',
          isOwn: true,
          timestamp: '1 hour ago',
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          text: 'You can pick up the vehicle at 10 AM tomorrow. Please bring your driving license and Aadhaar card.',
          isOwn: false,
          timestamp: '45 min ago',
          status: 'read',
          type: 'text'
        },
        {
          id: '4',
          text: '⚠️ Pickup reminder: 2 hours remaining',
          isOwn: false,
          timestamp: '30 min ago',
          status: 'read',
          type: 'system'
        },
        {
          id: '5',
          text: 'Perfect! I\'ll be there on time. Can you share the exact pickup location?',
          isOwn: true,
          timestamp: '25 min ago',
          status: 'delivered',
          type: 'text'
        }
      ];
    }
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());

  // Dynamic quick reply suggestions based on contact type
  const getQuickReplies = (): QuickReply[] => {
    if (contactType === 'support') {
      return [
        { id: '1', text: '📞 Call me back' },
        { id: '2', text: '🆔 Check my booking' },
        { id: '3', text: '💳 Payment issue' },
        { id: '4', text: '📍 Change location' },
        { id: '5', text: '🙏 Thank you!' }
      ];
    } else {
      return [
        { id: '1', text: '⏰ What time pickup?' },
        { id: '2', text: '🚗 Vehicle available?' },
        { id: '3', text: '📸 Send photos?' },
        { id: '4', text: '🕐 Running 15 min late' },
        { id: '5', text: '🙏 Thank you!' }
      ];
    }
  };

  const quickReplies: QuickReply[] = getQuickReplies();

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        isOwn: true,
        timestamp: 'Just now',
        status: 'sent',
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setShowQuickReplies(false);
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 1000);

      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={10} color="#fff" />;
      case 'delivered':
        return (
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="checkmark" size={10} color="#fff" />
            <Ionicons name="checkmark" size={10} color="#fff" style={{ marginLeft: -3 }} />
          </View>
        );
      case 'read':
        return (
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="checkmark" size={10} color="#0891b2" />
            <Ionicons name="checkmark" size={10} color="#0891b2" style={{ marginLeft: -3 }} />
          </View>
        );
      default:
        return null;
    }
  };

  const showContactInfo = () => {
    Alert.alert(
      'Contact Info',
      '',
      [
        { text: 'View Profile', onPress: () => {} },
        { text: 'View Booking Details', onPress: () => {} },
        { text: 'Report Conversation', onPress: () => {}, style: 'destructive' },
        { text: 'Block User', onPress: () => {}, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const showAttachmentOptions = () => {
    Alert.alert(
      'Send Attachment',
      '',
      [
        { text: 'Camera', onPress: () => {} },
        { text: 'Gallery', onPress: () => {} },
        { text: 'Document', onPress: () => {} },
        { text: 'Location', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={[
            styles.systemMessage,
            item.text.includes('⚠️') && styles.warningMessage,
            item.text.includes('✓') && styles.successMessage
          ]}>
            <Text style={styles.systemMessageText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.isOwn && styles.ownMessageContainer]}>
        {!item.isOwn && (
          <Text style={styles.contactAvatar}>{contact.avatar}</Text>
        )}
        <View style={[styles.messageBubble, item.isOwn ? styles.ownMessage : styles.otherMessage]}>
          <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.timestamp, item.isOwn && styles.ownTimestamp]}>
              {item.timestamp}
            </Text>
            {item.isOwn && getMessageStatusIcon(item.status || 'sent')}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary.teal, Colors.primary.darkTeal]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.contactInfo}>
            <Text style={styles.contactAvatar}>{contact.avatar}</Text>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactStatus}>{contact.status}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={showContactInfo} style={styles.headerButton}>
              <Ionicons name="information-circle-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Booking Context Card */}
        {showBookingCard && (
          <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingTitle}>Booking Details</Text>
              <TouchableOpacity onPress={() => setShowBookingCard(false)}>
                <Ionicons name="chevron-up" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.bookingContent}>
              <Text style={styles.vehicleThumbnail}>{bookingData.vehicle.image}</Text>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingId}>#{bookingData.id}</Text>
                <Text style={styles.bookingStatus}>{bookingData.status}</Text>
                <Text style={styles.bookingDates}>{bookingData.dates}</Text>
              </View>
              <TouchableOpacity style={styles.viewBookingButton}>
                <Text style={styles.viewBookingText}>View Full Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.contactAvatar}>{contact.avatar}</Text>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>
                {contactType === 'support' ? 'Support' : contact.name} is typing
              </Text>
              <Animated.View style={[styles.typingDots, { opacity: typingAnimation }]}>
                <Text style={styles.typingDotsText}>●●●</Text>
              </Animated.View>
            </View>
          </View>
        )}

        {/* Quick Replies */}
        {showQuickReplies && (
          <View style={styles.quickRepliesWrapper}>
            <Text style={styles.quickRepliesTitle}>Quick Replies</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickRepliesContainer}
              contentContainerStyle={styles.quickRepliesContent}
            >
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={reply.id}
                  style={[styles.quickReply, { opacity: 0.9 + (index * 0.02) }]}
                  onPress={() => handleQuickReply(reply.text)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReplyText}>{reply.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity onPress={showAttachmentOptions} style={styles.attachButton}>
              <Ionicons name="attach" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            {message.trim() ? (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={() => sendMessage(message)}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.voiceButton}
                onPressIn={() => setIsRecording(true)}
                onPressOut={() => setIsRecording(false)}
              >
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={16} 
                  color={isRecording ? "#ef4444" : "#6b7280"} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Safety Warning */}
        <View style={styles.safetyWarning}>
          <Ionicons name="shield-checkmark" size={12} color={Colors.functional.warning} />
          <Text style={styles.safetyText}>Never share personal financial info</Text>
        </View>
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  contactAvatar: {
    fontSize: 24,
    marginRight: 8,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
  contactStatus: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 7,
    marginLeft: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: Colors.background.white,
    margin: 12,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.primary.lightTeal + '15',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleThumbnail: {
    fontSize: 32,
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingId: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bookingStatus: {
    fontSize: 12,
    color: Colors.functional.success,
    marginTop: 2,
    fontWeight: '500',
  },
  bookingDates: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 1,
  },
  viewBookingButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.primary.teal,
    borderRadius: 10,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  viewBookingText: {
    color: Colors.text.white,
    fontSize: 11,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  ownMessage: {
    backgroundColor: Colors.primary.teal,
    borderBottomRightRadius: 4,
    marginLeft: '22%',
  },
  otherMessage: {
    backgroundColor: Colors.background.white,
    borderBottomLeftRadius: 4,
    marginRight: '22%',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    fontWeight: '400',
  },
  ownMessageText: {
    color: Colors.text.white,
    fontWeight: '400',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginRight: 3,
  },
  ownTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  systemMessage: {
    backgroundColor: Colors.accent.cyan,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  warningMessage: {
    backgroundColor: Colors.functional.warning,
  },
  successMessage: {
    backgroundColor: Colors.functional.success,
  },
  systemMessageText: {
    fontSize: 12,
    color: Colors.text.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  typingBubble: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  typingText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  typingDots: {
    marginLeft: 4,
  },
  typingDotsText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: 'bold',
  },
  quickRepliesWrapper: {
    backgroundColor: Colors.background.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
  },
  quickRepliesTitle: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: 6,
    marginHorizontal: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  quickRepliesContainer: {
    paddingHorizontal: 12,
  },
  quickRepliesContent: {
    paddingRight: 12,
  },
  quickReply: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.primary.lightTeal,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  quickReplyText: {
    fontSize: 11,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  attachButton: {
    padding: 4,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    maxHeight: 80,
    paddingVertical: 4,
    fontWeight: '400',
  },
  emojiButton: {
    padding: 4,
    marginLeft: 6,
  },
  sendButton: {
    backgroundColor: Colors.primary.teal,
    borderRadius: 18,
    padding: 8,
    marginLeft: 6,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceButton: {
    padding: 8,
    marginLeft: 6,
    borderRadius: 18,
    backgroundColor: Colors.background.lightGrey,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  safetyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.functional.warning + '10',
  },
  safetyText: {
    fontSize: 9,
    color: Colors.functional.warning,
    marginLeft: 4,
    fontWeight: '500',
  },
});
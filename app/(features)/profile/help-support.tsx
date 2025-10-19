import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: 'call' | 'whatsapp' | 'email' | 'chat';
  value: string;
  color: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  description: string;
  createdAt: string;
  responseTime: string;
  bookingId?: string;
}

interface PopularTopic {
  id: string;
  title: string;
  icon: string;
  route?: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: 'Booking issue',
    bookingId: '',
    description: '',
    email: '',
    phone: '',
  });

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Call Us',
      subtitle: '1800-123-4567',
      icon: 'call',
      action: 'call',
      value: '18001234567',
      color: Colors.functional.success,
    },
    {
      id: '2',
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      icon: 'logo-whatsapp',
      action: 'whatsapp',
      value: '919876543210',
      color: '#25D366',
    },
    {
      id: '3',
      title: 'Email Us',
      subtitle: 'support@mova.com',
      icon: 'mail',
      action: 'email',
      value: 'support@mova.com',
      color: Colors.primary.teal,
    },
    {
      id: '4',
      title: 'Live Chat',
      subtitle: 'Chat with agent',
      icon: 'chatbubbles',
      action: 'chat',
      value: '',
      color: Colors.accent.blue,
    },
  ];

  const popularTopics: PopularTopic[] = [
    { id: '1', title: 'How to book a vehicle', icon: 'car', route: '/(main)' },
    { id: '2', title: 'Cancellation & Refunds', icon: 'return-up-back' },
    { id: '3', title: 'Payment issues', icon: 'card' },
    { id: '4', title: 'Documents required', icon: 'document-text', route: '/documents-page' },
    { id: '5', title: 'Modify my booking', icon: 'create' },
    { id: '6', title: 'Report a problem', icon: 'warning' },
    { id: '7', title: 'Insurance coverage', icon: 'shield-checkmark' },
    { id: '8', title: 'Breakdown assistance', icon: 'construct' },
  ];

  const faqCategories = [
    'All', 'Booking', 'Payment', 'Documents', 'During Trip', 'After Trip', 'Safety', 'Account'
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Booking',
      question: 'How do I book a vehicle?',
      answer: 'To book a vehicle:\n1. Select your pickup location and dates\n2. Browse available vehicles\n3. Choose your preferred car\n4. Upload required documents\n5. Make payment\n6. Receive booking confirmation',
    },
    {
      id: '2',
      category: 'Booking',
      question: 'Can I modify my booking?',
      answer: 'Yes, you can modify your booking up to 24 hours before pickup time. Go to "My Bookings" and select "Modify Booking". Changes may incur additional charges.',
    },
    {
      id: '3',
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept:\n• Credit/Debit Cards (Visa, MasterCard, RuPay)\n• Net Banking\n• UPI (GPay, PhonePe, Paytm)\n• Digital Wallets\n• EMI options available',
    },
    {
      id: '4',
      category: 'Payment',
      question: 'When will I be charged?',
      answer: 'Payment is processed immediately after booking confirmation. Security deposit is blocked on your card and released after trip completion (3-7 business days).',
    },
    {
      id: '5',
      category: 'Documents',
      question: 'What documents do I need?',
      answer: 'Required documents:\n• Valid Driving License\n• Aadhaar Card/Passport\n• Documents must be original and valid\n• International license for foreign nationals',
    },
    {
      id: '6',
      category: 'During Trip',
      question: 'What if the car breaks down?',
      answer: 'In case of breakdown:\n1. Call our emergency number: 1800-123-4567\n2. Share your location\n3. We will arrange immediate assistance\n4. Alternative vehicle provided if needed',
    },
    {
      id: '7',
      category: 'Safety',
      question: 'Is the vehicle insured?',
      answer: 'Yes, all vehicles are comprehensively insured. Insurance covers:\n• Accidents\n• Theft\n• Third-party liability\n• Natural calamities\nDriver coverage available separately.',
    },
    {
      id: '8',
      category: 'Account',
      question: 'How to change my phone number?',
      answer: 'To update phone number:\n1. Go to Profile Settings\n2. Select "Edit Profile"\n3. Update phone number\n4. Verify with OTP\n5. Save changes',
    },
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'TKT001',
      subject: 'Payment failed but amount deducted',
      status: 'In Progress',
      description: 'Payment was deducted from my card but booking failed',
      createdAt: '15 Jan 2025',
      responseTime: '2-4 hours',
      bookingId: 'BK12345',
    },
    {
      id: 'TKT002',
      subject: 'Document verification pending',
      status: 'Resolved',
      description: 'My driving license verification is still pending',
      createdAt: '12 Jan 2025',
      responseTime: 'Resolved',
    },
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'How to Book a Vehicle',
      duration: '2:30',
      thumbnail: '',
      videoUrl: 'https://example.com/video1',
    },
    {
      id: '2',
      title: 'Upload Documents Guide',
      duration: '1:45',
      thumbnail: '',
      videoUrl: 'https://example.com/video2',
    },
    {
      id: '3',
      title: 'Vehicle Inspection Process',
      duration: '3:15',
      thumbnail: '',
      videoUrl: 'https://example.com/video3',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchText === '' || 
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleQuickAction = (action: QuickAction) => {
    switch (action.action) {
      case 'call':
        Linking.openURL(`tel:${action.value}`);
        break;
      case 'whatsapp':
        Linking.openURL(`whatsapp://send?phone=${action.value}&text=Hi, I need help with my MOVA booking`);
        break;
      case 'email':
        Linking.openURL(`mailto:${action.value}?subject=Support Request`);
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature will be available soon!');
        break;
    }
  };

  const handlePopularTopic = (topic: PopularTopic) => {
    if (topic.route) {
      router.push(topic.route as any);
    } else {
      // Filter FAQs by topic
      const relatedFAQ = faqs.find(faq => 
        faq.question.toLowerCase().includes(topic.title.toLowerCase().split(' ')[0])
      );
      if (relatedFAQ) {
        setExpandedFAQ(relatedFAQ.id);
      }
    }
  };

  const handleFAQFeedback = (faqId: string, helpful: boolean) => {
    Alert.alert(
      'Thank you!',
      helpful ? 'Glad this was helpful!' : 'We\'ll improve this answer. Contact support for more help.'
    );
  };

  const submitContactForm = () => {
    if (!contactForm.description.trim()) {
      Alert.alert('Error', 'Please provide a description of your issue.');
      return;
    }

    Alert.alert(
      'Ticket Submitted',
      'Your support ticket has been submitted. We\'ll respond within 24 hours.',
      [{ text: 'OK', onPress: () => setShowContactForm(false) }]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Help & Support</Text>
      <View style={styles.headerPlaceholder} />
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="How can we help you?"
          placeholderTextColor={Colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionCard}
            onPress={() => handleQuickAction(action)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
            <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPopularTopics = () => (
    <View style={styles.popularTopicsSection}>
      <Text style={styles.sectionTitle}>Popular Topics</Text>
      <View style={styles.topicsGrid}>
        {popularTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => handlePopularTopic(topic)}
          >
            <Ionicons name={topic.icon as any} size={20} color={Colors.primary.teal} />
            <Text style={styles.topicText}>{topic.title}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFAQCategories = () => (
    <View style={styles.categoriesSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {faqCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipSelected
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextSelected
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFAQ = ({ item }: { item: FAQ }) => (
    <View style={styles.faqCard}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
      >
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons 
          name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.text.secondary} 
        />
      </TouchableOpacity>
      
      {expandedFAQ === item.id && (
        <View style={styles.faqContent}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
          
          <View style={styles.faqFooter}>
            <Text style={styles.helpfulText}>Was this helpful?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => handleFAQFeedback(item.id, true)}
              >
                <Ionicons name="thumbs-up" size={18} color={Colors.functional.success} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => handleFAQFeedback(item.id, false)}
              >
                <Ionicons name="thumbs-down" size={18} color={Colors.functional.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.contactSupportButton}
            onPress={() => setShowContactForm(true)}
          >
            <Text style={styles.contactSupportText}>Still need help? Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFAQs = () => (
    <View style={styles.faqsSection}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <FlatList
        data={filteredFAQs}
        renderItem={renderFAQ}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.faqSeparator} />}
      />
    </View>
  );

  const renderSupportTickets = () => (
    <View style={styles.ticketsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Support Tickets</Text>
        <TouchableOpacity onPress={() => setShowContactForm(true)}>
          <Text style={styles.newTicketText}>New Ticket</Text>
        </TouchableOpacity>
      </View>
      
      {supportTickets.map((ticket) => (
        <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketId}>#{ticket.id}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: 
                ticket.status === 'Open' ? Colors.functional.warning + '20' :
                ticket.status === 'In Progress' ? Colors.accent.blue + '20' :
                Colors.functional.success + '20'
              }
            ]}>
              <Text style={[
                styles.statusText,
                { color: 
                  ticket.status === 'Open' ? Colors.functional.warning :
                  ticket.status === 'In Progress' ? Colors.accent.blue :
                  Colors.functional.success
                }
              ]}>
                {ticket.status}
              </Text>
            </View>
          </View>
          
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
          <Text style={styles.ticketDescription} numberOfLines={2}>
            {ticket.description}
          </Text>
          
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketDate}>{ticket.createdAt}</Text>
            <Text style={styles.responseTime}>Response: {ticket.responseTime}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderVideoTutorials = () => (
    <View style={styles.videosSection}>
      <Text style={styles.sectionTitle}>Video Tutorials</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.videosContainer}
      >
        {videoTutorials.map((video) => (
          <TouchableOpacity key={video.id} style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
              <View style={styles.videoDuration}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>{video.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContactForm = () => {
    if (!showContactForm) return null;

    return (
      <View style={styles.contactFormSection}>
        <View style={styles.formHeader}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity onPress={() => setShowContactForm(false)}>
            <Ionicons name="close" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Subject</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{contactForm.subject}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Booking ID (if applicable)</Text>
          <TextInput
            style={styles.formInput}
            value={contactForm.bookingId}
            onChangeText={(text) => setContactForm(prev => ({ ...prev, bookingId: text }))}
            placeholder="Enter booking ID"
            placeholderTextColor={Colors.text.secondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.formTextArea}
            value={contactForm.description}
            onChangeText={(text) => setContactForm(prev => ({ ...prev, description: text }))}
            placeholder="Describe your issue in detail"
            placeholderTextColor={Colors.text.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => Alert.alert('Feature', 'Attachment feature coming soon!')}
          >
            <Ionicons name="attach" size={20} color={Colors.primary.teal} />
            <Text style={styles.attachText}>Attach Screenshot</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={submitContactForm}
          >
            <Text style={styles.submitButtonText}>Submit Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSearchBar()}
        {renderQuickActions()}
        {renderPopularTopics()}
        {renderFAQCategories()}
        {renderFAQs()}
        {renderVideoTutorials()}
        {renderSupportTickets()}
        {renderContactForm()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  popularTopicsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  topicsGrid: {
    gap: 8,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  topicText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  faqsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginRight: 12,
  },
  faqContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  faqFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  helpfulText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
  },
  contactSupportButton: {
    alignSelf: 'flex-start',
  },
  contactSupportText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  faqSeparator: {
    height: 12,
  },
  ticketsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newTicketText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  responseTime: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  videosSection: {
    marginBottom: 24,
  },
  videosContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  videoCard: {
    width: 200,
  },
  videoThumbnail: {
    width: 200,
    height: 120,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  contactFormSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginHorizontal: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: Colors.functional.error,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: '#ffffff',
  },
  formTextArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: '#ffffff',
    height: 100,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    borderRadius: 8,
    gap: 8,
  },
  attachText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});
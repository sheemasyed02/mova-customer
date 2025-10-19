import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Clipboard,
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ReferralHistory {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  date: string;
  earned: number;
  canRemind: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  isCurrentUser?: boolean;
}

export default function ReferralScreen() {
  const router = useRouter();
  
  // Sample data
  const [referralCode] = useState('RAJ123');
  const [referralStats] = useState({
    friendsReferred: 8,
    successfulBookings: 5,
    totalEarned: 2500,
    pending: 1500,
    successRate: 62,
  });

  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([
    {
      id: '1',
      name: 'Suresh K.',
      status: 'completed',
      date: '10 Jan 2025',
      earned: 500,
      canRemind: false,
    },
    {
      id: '2',
      name: 'Priya M.',
      status: 'pending',
      date: '15 Jan 2025',
      earned: 0,
      canRemind: true,
    },
    {
      id: '3',
      name: 'Amit S.',
      status: 'completed',
      date: '08 Jan 2025',
      earned: 500,
      canRemind: false,
    },
    {
      id: '4',
      name: 'Neha R.',
      status: 'pending',
      date: '18 Jan 2025',
      earned: 0,
      canRemind: true,
    },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Rajesh K.', referrals: 15 },
    { rank: 2, name: 'Priya S.', referrals: 12 },
    { rank: 3, name: 'You', referrals: 8, isCurrentUser: true },
    { rank: 4, name: 'Amit P.', referrals: 7 },
    { rank: 5, name: 'Neha M.', referrals: 6 },
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [showTerms, setShowTerms] = useState(false);

  const copyCode = async () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const shareCode = () => {
    const shareOptions = [
      'WhatsApp',
      'SMS', 
      'Email',
      'Instagram',
      'Facebook',
      'Twitter',
      'Copy Link',
      'Cancel'
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: shareOptions,
          cancelButtonIndex: 7,
        },
        async (buttonIndex) => {
          if (buttonIndex < 7) {
            await handleShare(shareOptions[buttonIndex].toLowerCase());
          }
        }
      );
    } else {
      Alert.alert(
        'Share Your Code',
        'Choose how to share',
        [
          ...shareOptions.slice(0, -1).map((option) => ({
            text: option,
            onPress: () => handleShare(option.toLowerCase()),
          })),
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleShare = async (platform: string) => {
    const message = `Hey! I've been using MOVA for car rentals. Use my code ${referralCode} and get ₹200 off your first booking! Download: https://mova.app/download`;
    
    try {
      const result = await Share.share({
        message,
        title: 'Join MOVA and Save!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const remindFriend = (friendName: string) => {
    Alert.alert(
      'Remind Friend',
      `Send a reminder to ${friendName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Reminder', 
          onPress: () => {
            Alert.alert('Reminder Sent!', `Reminder sent to ${friendName}`);
          }
        }
      ]
    );
  };

  const getFilteredHistory = () => {
    if (selectedFilter === 'all') return referralHistory;
    return referralHistory.filter(item => item.status === selectedFilter);
  };

  const renderHowItWorksStep = (step: number, icon: string, title: string, description: string) => (
    <View key={step} style={styles.stepContainer}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step}</Text>
      </View>
      <View style={styles.stepIconContainer}>
        <Ionicons name={icon as any} size={24} color={Colors.primary.teal} />
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );

  const renderReferralHistoryItem = ({ item }: { item: ReferralHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyInfo}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyName}>{item.name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'completed' ? Colors.functional.success + '20' : Colors.functional.warning + '20' }
          ]}>
            <Ionicons 
              name={item.status === 'completed' ? 'checkmark-circle' : 'time'} 
              size={12} 
              color={item.status === 'completed' ? Colors.functional.success : Colors.functional.warning} 
            />
            <Text style={[
              styles.statusText,
              { color: item.status === 'completed' ? Colors.functional.success : Colors.functional.warning }
            ]}>
              {item.status === 'completed' ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyEarned}>
          {item.status === 'completed' ? `Earned: ₹${item.earned}` : 'Waiting for first booking'}
        </Text>
      </View>
      {item.canRemind && (
        <TouchableOpacity
          style={styles.remindButton}
          onPress={() => remindFriend(item.name)}
        >
          <Ionicons name="send" size={16} color={Colors.primary.teal} />
          <Text style={styles.remindButtonText}>Remind</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={[styles.leaderboardItem, item.isCurrentUser && styles.currentUserItem]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, item.isCurrentUser && styles.currentUserText]}>#{item.rank}</Text>
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={[styles.leaderboardName, item.isCurrentUser && styles.currentUserText]}>
          {item.name}
        </Text>
        <Text style={styles.leaderboardReferrals}>{item.referrals} referrals</Text>
      </View>
      {item.rank === 1 && (
        <View style={styles.crownContainer}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.primary.teal, Colors.primary.darkTeal]}
          style={styles.heroSection}
        >
          <View style={styles.heroIllustration}>
            <Ionicons name="people" size={48} color="#ffffff" />
            <Ionicons name="car" size={32} color="#ffffff" style={styles.carIcon} />
          </View>
          <Text style={styles.heroTitle}>Refer & Earn</Text>
          <Text style={styles.heroSubtitle}>Give ₹200, Get ₹500</Text>
        </LinearGradient>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {renderHowItWorksStep(1, 'share', 'Share your code', 'Share your unique code with friends')}
          {renderHowItWorksStep(2, 'person-add', 'They sign up', 'They register using your code')}
          {renderHowItWorksStep(3, 'gift', 'Both earn', 'They get ₹200 off, you get ₹500')}
        </View>

        {/* Referral Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={48} color={Colors.primary.teal} />
                <Text style={styles.qrText}>QR Code</Text>
              </View>
            </View>
            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.copyButton} onPress={copyCode}>
                <Ionicons name="copy" size={16} color={Colors.primary.teal} />
                <Text style={styles.copyButtonText}>Copy Code</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareCode}>
                <Ionicons name="share" size={16} color="#ffffff" />
                <Text style={styles.shareButtonText}>Share Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{referralStats.friendsReferred}</Text>
              <Text style={styles.statLabel}>Friends Referred</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{referralStats.successfulBookings}</Text>
              <Text style={styles.statLabel}>Successful Bookings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{referralStats.totalEarned.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{referralStats.pending.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={[styles.statCard, styles.statCardWide]}>
              <Text style={styles.statValue}>{referralStats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Referral History</Text>
            <View style={styles.filterTabs}>
              {(['all', 'completed', 'pending'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterTab, selectedFilter === filter && styles.activeFilterTab]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
                    styles.filterTabText,
                    selectedFilter === filter && styles.activeFilterTabText
                  ]}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <FlatList
            data={getFilteredHistory()}
            renderItem={renderReferralHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={Colors.text.secondary} />
                <Text style={styles.emptyStateText}>No referrals yet</Text>
                <Text style={styles.emptyStateSubtext}>Start sharing your code to earn rewards!</Text>
              </View>
            )}
          />
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Referrers This Month</Text>
            <View style={styles.prizeInfo}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.prizeText}>Prize: Free booking up to ₹5,000</Text>
            </View>
          </View>
          
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.rank.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.termsHeader}
            onPress={() => setShowTerms(!showTerms)}
          >
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Ionicons 
              name={showTerms ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.text.secondary} 
            />
          </TouchableOpacity>
          
          {showTerms && (
            <View style={styles.termsContent}>
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Referral validity:</Text>
                <Text style={styles.termText}>90 days</Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Maximum referrals:</Text>
                <Text style={styles.termText}>Unlimited</Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Payout conditions:</Text>
                <Text style={styles.termText}>• Friend must complete first booking</Text>
                <Text style={styles.termText}>• Minimum booking value: ₹1,000</Text>
                <Text style={styles.termText}>• Payment within 30 days of completed booking</Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Restrictions:</Text>
                <Text style={styles.termText}>• Cannot refer yourself</Text>
                <Text style={styles.termText}>• Cannot use multiple accounts</Text>
              </View>
            </View>
          )}
        </View>

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
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  carIcon: {
    marginLeft: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.teal + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  codeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    letterSpacing: 2,
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal + '30',
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.primary.teal + '20',
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    color: Colors.primary.teal,
    fontSize: 16,
    fontWeight: '500',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.primary.teal,
    borderRadius: 8,
    gap: 6,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: (width - 64) / 2,
    alignItems: 'center',
  },
  statCardWide: {
    width: width - 64,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeFilterTab: {
    backgroundColor: '#ffffff',
  },
  filterTabText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeFilterTabText: {
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  historyEarned: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary.teal + '20',
    borderRadius: 8,
    gap: 4,
  },
  remindButtonText: {
    color: Colors.primary.teal,
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  prizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prizeText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentUserItem: {
    backgroundColor: Colors.primary.teal + '10',
    borderColor: Colors.primary.teal + '30',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.secondary,
  },
  currentUserText: {
    color: Colors.primary.teal,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  leaderboardReferrals: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  crownContainer: {
    marginLeft: 8,
  },
  termsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termsContent: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  termItem: {
    marginBottom: 12,
  },
  termTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  termText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
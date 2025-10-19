import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface EarningOpportunity {
  id: string;
  title: string;
  points: number;
  icon: string;
  completed: boolean;
  category: 'profile' | 'booking' | 'social' | 'milestone';
}

interface RedemptionOption {
  id: string;
  type: 'discount' | 'giftcard' | 'perk';
  title: string;
  description: string;
  points: number;
  value?: string;
  icon: string;
  available: boolean;
}

interface PointsTransaction {
  id: string;
  date: string;
  activity: string;
  points: number;
  balanceAfter: number;
  expiryDate?: string;
  type: 'earned' | 'redeemed';
}

interface TierInfo {
  name: string;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  benefits: string[];
  color: string;
  icon: string;
}

export default function RewardsScreen() {
  const router = useRouter();
  
  // User's current state
  const [currentPoints] = useState(450);
  const [pointsExpiring] = useState(50);
  const [currentTier] = useState('Bronze');
  
  const tiers: TierInfo[] = [
    {
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 499,
      multiplier: 1.0,
      benefits: ['Standard benefits', '1 point per ₹100 spent'],
      color: '#CD7F32',
      icon: 'medal',
    },
    {
      name: 'Silver',
      minPoints: 500,
      maxPoints: 1999,
      multiplier: 1.5,
      benefits: ['1.5 points per ₹100 spent', 'Priority customer support', 'Early access to offers', 'Silver badge on profile'],
      color: '#C0C0C0',
      icon: 'medal',
    },
    {
      name: 'Gold',
      minPoints: 2000,
      maxPoints: 4999,
      multiplier: 2.0,
      benefits: ['2 points per ₹100 spent', 'Free cancellation on one booking/month', 'Dedicated support line', 'Gold badge on profile', 'Birthday bonus: 500 points'],
      color: '#FFD700',
      icon: 'medal',
    },
    {
      name: 'Platinum',
      minPoints: 5000,
      maxPoints: 999999,
      multiplier: 3.0,
      benefits: ['3 points per ₹100 spent', 'Exclusive vehicle access', 'Free upgrades', 'VIP support (24/7)', 'Platinum badge', 'Annual gift: Free weekend booking'],
      color: '#E5E4E2',
      icon: 'diamond',
    },
  ];

  const earningOpportunities: EarningOpportunity[] = [
    { id: '1', title: 'Complete booking', points: 50, icon: 'car', completed: false, category: 'booking' },
    { id: '2', title: 'Write review', points: 25, icon: 'star', completed: true, category: 'social' },
    { id: '3', title: 'Upload profile photo', points: 10, icon: 'camera', completed: true, category: 'profile' },
    { id: '4', title: 'Verify email', points: 10, icon: 'mail', completed: true, category: 'profile' },
    { id: '5', title: 'Refer a friend', points: 100, icon: 'people', completed: false, category: 'social' },
    { id: '6', title: 'Complete profile', points: 20, icon: 'person', completed: false, category: 'profile' },
    { id: '7', title: 'Book on weekday', points: 10, icon: 'calendar', completed: false, category: 'booking' },
    { id: '8', title: '10th booking milestone', points: 500, icon: 'trophy', completed: false, category: 'milestone' },
  ];

  const redemptionOptions: RedemptionOption[] = [
    {
      id: '1',
      type: 'discount',
      title: 'Booking Discount',
      description: '100 points = ₹100 discount',
      points: 100,
      icon: 'pricetag',
      available: true,
    },
    {
      id: '2',
      type: 'giftcard',
      title: 'Amazon Gift Card',
      description: '₹500 gift card',
      points: 500,
      icon: 'gift',
      available: false,
    },
    {
      id: '3',
      type: 'giftcard',
      title: 'Flipkart Gift Card',
      description: '₹500 gift card',
      points: 500,
      icon: 'gift',
      available: false,
    },
    {
      id: '4',
      type: 'giftcard',
      title: 'Swiggy Gift Card',
      description: '₹300 gift card',
      points: 300,
      icon: 'restaurant',
      available: true,
    },
    {
      id: '5',
      type: 'giftcard',
      title: 'Zomato Gift Card',
      description: '₹300 gift card',
      points: 300,
      icon: 'restaurant',
      available: true,
    },
    {
      id: '6',
      type: 'perk',
      title: 'Free vehicle upgrade',
      description: 'Next booking upgrade',
      points: 200,
      icon: 'arrow-up-circle',
      available: true,
    },
    {
      id: '7',
      type: 'perk',
      title: 'Skip the line',
      description: 'Priority support',
      points: 100,
      icon: 'flash',
      available: true,
    },
    {
      id: '8',
      type: 'perk',
      title: 'Early access to sales',
      description: '24h before public',
      points: 150,
      icon: 'time',
      available: true,
    },
  ];

  const pointsHistory: PointsTransaction[] = [
    {
      id: '1',
      date: '15 Jan 2025',
      activity: 'Booking completed',
      points: 50,
      balanceAfter: 450,
      expiryDate: '15 Jan 2026',
      type: 'earned',
    },
    {
      id: '2',
      date: '12 Jan 2025',
      activity: 'Amazon gift card redeemed',
      points: -500,
      balanceAfter: 400,
      type: 'redeemed',
    },
    {
      id: '3',
      date: '10 Jan 2025',
      activity: 'Review posted',
      points: 25,
      balanceAfter: 900,
      expiryDate: '10 Jan 2026',
      type: 'earned',
    },
    {
      id: '4',
      date: '08 Jan 2025',
      activity: 'Friend referral',
      points: 100,
      balanceAfter: 875,
      expiryDate: '08 Jan 2026',
      type: 'earned',
    },
  ];

  const [selectedTab, setSelectedTab] = useState<'earn' | 'redeem' | 'history'>('earn');
  const [showTierDetails, setShowTierDetails] = useState(false);

  const getCurrentTierInfo = () => {
    return tiers.find(tier => 
      currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints
    ) || tiers[0];
  };

  const getNextTierInfo = () => {
    const currentTierInfo = getCurrentTierInfo();
    const currentIndex = tiers.findIndex(tier => tier.name === currentTierInfo.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTierInfo();
    if (!nextTier) return 100;
    
    const currentTierInfo = getCurrentTierInfo();
    const progressInTier = currentPoints - currentTierInfo.minPoints;
    const tierRange = nextTier.minPoints - currentTierInfo.minPoints;
    
    return (progressInTier / tierRange) * 100;
  };

  const handleRedeem = (option: RedemptionOption) => {
    if (!option.available) {
      Alert.alert('Insufficient Points', `You need ${option.points} points for this reward. You currently have ${currentPoints} points.`);
      return;
    }

    Alert.alert(
      'Redeem Points',
      `Redeem ${option.points} points for ${option.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            Alert.alert('Success!', `${option.title} has been redeemed successfully!`);
          }
        }
      ]
    );
  };

  const handleEarnMore = (opportunity: EarningOpportunity) => {
    if (opportunity.completed) {
      Alert.alert('Already Completed', 'You have already earned points for this activity.');
      return;
    }

    switch (opportunity.category) {
      case 'booking':
        router.push('/(main)' as any);
        break;
      case 'social':
        if (opportunity.title.includes('Refer')) {
          router.push('/referral-page' as any);
        }
        break;
      case 'profile':
        router.push('/edit-profile-page' as any);
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon!');
    }
  };

  const renderBalanceCard = () => (
    <LinearGradient
      colors={[Colors.primary.teal, Colors.primary.darkTeal]}
      style={styles.balanceCard}
    >
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceTitle}>Your Points</Text>
        <TouchableOpacity onPress={() => setShowTierDetails(true)}>
          <View style={styles.tierBadge}>
            <Ionicons name={getCurrentTierInfo().icon as any} size={16} color="#ffffff" />
            <Text style={styles.tierText}>{currentTier}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceMain}>
        <Text style={styles.pointsValue}>{currentPoints.toLocaleString()}</Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>
      
      <Text style={styles.pointsEquivalent}>Equivalent to ₹{currentPoints}</Text>
      
      {pointsExpiring > 0 && (
        <View style={styles.expiringAlert}>
          <Ionicons name="warning" size={16} color="#FFF3CD" />
          <Text style={styles.expiringText}>
            {pointsExpiring} points expiring in 30 days
          </Text>
        </View>
      )}
    </LinearGradient>
  );

  const renderTierProgress = () => {
    const nextTier = getNextTierInfo();
    if (!nextTier) return null;

    const pointsNeeded = nextTier.minPoints - currentPoints;
    const progress = getProgressToNextTier();

    return (
      <View style={styles.tierProgressCard}>
        <View style={styles.tierProgressHeader}>
          <Text style={styles.tierProgressTitle}>Tier Progress</Text>
          <Text style={styles.tierProgressSubtitle}>
            {pointsNeeded} more points to reach {nextTier.name}
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity 
        style={[styles.quickAction, selectedTab === 'redeem' && styles.quickActionActive]}
        onPress={() => setSelectedTab('redeem')}
      >
        <Ionicons name="gift" size={24} color={selectedTab === 'redeem' ? '#ffffff' : Colors.primary.teal} />
        <Text style={[styles.quickActionText, selectedTab === 'redeem' && styles.quickActionTextActive]}>
          Redeem Points
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.quickAction, selectedTab === 'earn' && styles.quickActionActive]}
        onPress={() => setSelectedTab('earn')}
      >
        <Ionicons name="add-circle" size={24} color={selectedTab === 'earn' ? '#ffffff' : Colors.primary.teal} />
        <Text style={[styles.quickActionText, selectedTab === 'earn' && styles.quickActionTextActive]}>
          Earn More
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.quickAction, selectedTab === 'history' && styles.quickActionActive]}
        onPress={() => setSelectedTab('history')}
      >
        <Ionicons name="time" size={24} color={selectedTab === 'history' ? '#ffffff' : Colors.primary.teal} />
        <Text style={[styles.quickActionText, selectedTab === 'history' && styles.quickActionTextActive]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEarningOpportunity = ({ item }: { item: EarningOpportunity }) => (
    <TouchableOpacity
      style={[styles.earningCard, item.completed && styles.completedCard]}
      onPress={() => handleEarnMore(item)}
      disabled={item.completed}
    >
      <View style={styles.earningIcon}>
        <Ionicons name={item.icon as any} size={24} color={item.completed ? Colors.text.secondary : Colors.primary.teal} />
      </View>
      <View style={styles.earningContent}>
        <Text style={[styles.earningTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        <Text style={[styles.earningPoints, item.completed && styles.completedText]}>
          +{item.points} points
        </Text>
      </View>
      {item.completed && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.functional.success} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRedemptionOption = ({ item }: { item: RedemptionOption }) => (
    <View style={[styles.redemptionCard, !item.available && styles.unavailableCard]}>
      <View style={styles.redemptionHeader}>
        <View style={styles.redemptionIcon}>
          <Ionicons name={item.icon as any} size={24} color={item.available ? Colors.primary.teal : Colors.text.secondary} />
        </View>
        <View style={styles.redemptionContent}>
          <Text style={[styles.redemptionTitle, !item.available && styles.unavailableText]}>
            {item.title}
          </Text>
          <Text style={[styles.redemptionDescription, !item.available && styles.unavailableText]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.redemptionPoints}>
          <Text style={[styles.redemptionPointsText, !item.available && styles.unavailableText]}>
            {item.points}
          </Text>
          <Text style={[styles.redemptionPointsLabel, !item.available && styles.unavailableText]}>
            points
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.redeemButton, !item.available && styles.redeemButtonDisabled]}
        onPress={() => handleRedeem(item)}
        disabled={!item.available}
      >
        <Text style={[styles.redeemButtonText, !item.available && styles.redeemButtonTextDisabled]}>
          {item.available ? 'Redeem' : 'Not Available'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: PointsTransaction }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={[
          styles.historyPoints,
          { color: item.type === 'earned' ? Colors.functional.success : Colors.functional.error }
        ]}>
          {item.type === 'earned' ? '+' : ''}{item.points}
        </Text>
      </View>
      
      <Text style={styles.historyActivity}>{item.activity}</Text>
      <Text style={styles.historyBalance}>Balance: {item.balanceAfter} points</Text>
      
      {item.expiryDate && item.type === 'earned' && (
        <Text style={styles.historyExpiry}>Expires: {item.expiryDate}</Text>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'earn':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>How to Earn Points</Text>
            <FlatList
              data={earningOpportunities}
              renderItem={renderEarningOpportunity}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.earningRow}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.earningRowSeparator} />}
            />
          </View>
        );
        
      case 'redeem':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Redeem Your Points</Text>
            <Text style={styles.sectionSubtitle}>
              Minimum redemption: 50 points • Maximum per booking: 500 points
            </Text>
            <FlatList
              data={redemptionOptions}
              renderItem={renderRedemptionOption}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        );
        
      case 'history':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Points History</Text>
            <FlatList
              data={pointsHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        );
        
      default:
        return null;
    }
  };

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
        <Text style={styles.headerTitle}>MOVA Points</Text>
        <TouchableOpacity onPress={() => setShowTierDetails(true)}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderBalanceCard()}
        {renderTierProgress()}
        {renderQuickActions()}
        {renderTabContent()}
        
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
  content: {
    flex: 1,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  tierText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pointsLabel: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    marginLeft: 8,
  },
  pointsEquivalent: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 16,
  },
  expiringAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 243, 205, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  expiringText: {
    color: '#FFF3CD',
    fontSize: 14,
  },
  tierProgressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tierProgressHeader: {
    marginBottom: 12,
  },
  tierProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tierProgressSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.teal,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 12,
    padding: 4,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  quickActionActive: {
    backgroundColor: Colors.primary.teal,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  quickActionTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  earningRow: {
    justifyContent: 'space-between',
  },
  earningRowSeparator: {
    height: 12,
  },
  earningCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  completedCard: {
    backgroundColor: Colors.background.lightGrey,
    borderColor: Colors.text.secondary + '30',
  },
  earningIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.teal + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  earningContent: {
    alignItems: 'center',
  },
  earningTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  earningPoints: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  completedText: {
    color: Colors.text.secondary,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  redemptionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unavailableCard: {
    backgroundColor: Colors.background.lightGrey,
    borderColor: Colors.text.secondary + '30',
  },
  redemptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  redemptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  redemptionContent: {
    flex: 1,
  },
  redemptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  redemptionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  redemptionPoints: {
    alignItems: 'flex-end',
  },
  redemptionPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  redemptionPointsLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  unavailableText: {
    color: Colors.text.secondary,
  },
  redeemButton: {
    backgroundColor: Colors.primary.teal,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.text.secondary + '30',
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  redeemButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyActivity: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  historyBalance: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  historyExpiry: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});
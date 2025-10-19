import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Clipboard,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  maxDiscount?: number;
  minBookingValue: number;
  validTill: string;
  applicableOn: string[];
  category: 'all' | 'foryou' | 'newuser' | 'cards' | 'bank' | 'weekend' | 'festival';
  badge?: 'NEW' | 'EXPIRING SOON' | 'LIMITED TIME' | 'APPLIED';
  badgeColor?: string;
  isSaved: boolean;
  isExpanded: boolean;
  termsAndConditions: string[];
  bankName?: string;
  bankLogo?: string;
  paymentMethod?: string;
}

interface FeaturedOffer {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  countdown?: number;
  image?: string;
}

export default function OffersScreen() {
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'foryou' | 'newuser' | 'cards' | 'bank' | 'weekend' | 'festival'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const [savedCoupons, setSavedCoupons] = useState<string[]>(['WEEKEND20', 'FIRST500']);

  const categories = [
    { id: 'all', label: 'All Offers', icon: 'grid' },
    { id: 'foryou', label: 'For You', icon: 'person' },
    { id: 'newuser', label: 'New User', icon: 'star' },
    { id: 'cards', label: 'Cards', icon: 'card' },
    { id: 'bank', label: 'Bank Offers', icon: 'business' },
    { id: 'weekend', label: 'Weekend', icon: 'calendar' },
    { id: 'festival', label: 'Festival', icon: 'gift' },
  ];

  const featuredOffers: FeaturedOffer[] = [
    {
      id: '1',
      title: 'MEGA SALE',
      subtitle: 'Up to 50% OFF on all bookings',
      backgroundColor: Colors.primary.teal,
      countdown: 86400, // 24 hours in seconds
    },
    {
      id: '2',
      title: 'Weekend Special',
      subtitle: 'Extra 20% OFF on weekend rides',
      backgroundColor: Colors.accent.blue,
    },
    {
      id: '3',
      title: 'Festival Bonanza',
      subtitle: 'Celebrate with amazing discounts',
      backgroundColor: Colors.functional.warning,
    },
  ];

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      code: 'WEEKEND20',
      title: '20% Off on Weekend Bookings',
      description: 'Get flat 20% off on bookings made for Sat-Sun',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 1000,
      minBookingValue: 5000,
      validTill: '31 Jan 2025',
      applicableOn: ['SUVs', 'Sedans'],
      category: 'weekend',
      badge: 'LIMITED TIME',
      badgeColor: Colors.functional.warning,
      isSaved: true,
      isExpanded: false,
      termsAndConditions: [
        'Valid only on Saturday and Sunday bookings',
        'Cannot be combined with other offers',
        'Applicable on select vehicle categories',
        'Valid till 31st January 2025'
      ],
    },
    {
      id: '2',
      code: 'FIRST500',
      title: 'First Time User Special',
      description: 'Get ₹500 off on your first booking',
      discountType: 'flat',
      discountValue: 500,
      minBookingValue: 2000,
      validTill: '28 Feb 2025',
      applicableOn: ['All Vehicles'],
      category: 'newuser',
      badge: 'NEW',
      badgeColor: Colors.functional.success,
      isSaved: true,
      isExpanded: false,
      termsAndConditions: [
        'Valid only for first-time users',
        'Minimum booking value ₹2,000',
        'One-time use only',
        'Valid for 30 days from registration'
      ],
    },
    {
      id: '3',
      code: 'HDFC15',
      title: 'HDFC Credit Card Offer',
      description: '15% instant discount on HDFC credit cards',
      discountType: 'percentage',
      discountValue: 15,
      maxDiscount: 2000,
      minBookingValue: 3000,
      validTill: '31 Mar 2025',
      applicableOn: ['All Vehicles'],
      category: 'bank',
      bankName: 'HDFC Bank',
      isSaved: false,
      isExpanded: false,
      termsAndConditions: [
        'Valid on HDFC Credit Cards only',
        'Maximum discount ₹2,000',
        'Minimum transaction ₹3,000',
        'Instant discount at checkout'
      ],
    },
    {
      id: '4',
      code: 'DIWALI25',
      title: 'Diwali Special Offer',
      description: 'Celebrate Diwali with 25% off on all bookings',
      discountType: 'percentage',
      discountValue: 25,
      maxDiscount: 3000,
      minBookingValue: 4000,
      validTill: '15 Nov 2025',
      applicableOn: ['Premium Cars', 'Luxury Cars'],
      category: 'festival',
      badge: 'EXPIRING SOON',
      badgeColor: Colors.functional.error,
      isSaved: false,
      isExpanded: false,
      termsAndConditions: [
        'Valid during Diwali period only',
        'Applicable on premium and luxury vehicles',
        'Limited time offer',
        'Cannot be combined with other discounts'
      ],
    },
    {
      id: '5',
      code: 'PAYTM200',
      title: 'Paytm Cashback Offer',
      description: 'Get ₹200 cashback on Paytm payments',
      discountType: 'flat',
      discountValue: 200,
      minBookingValue: 2500,
      validTill: '31 Dec 2025',
      applicableOn: ['All Vehicles'],
      category: 'cards',
      paymentMethod: 'Paytm',
      isSaved: false,
      isExpanded: false,
      termsAndConditions: [
        'Cashback credited within 24 hours',
        'Valid on Paytm wallet payments only',
        'Minimum booking ₹2,500',
        'Maximum one cashback per user per month'
      ],
    },
  ]);

  const formatCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [countdown, setCountdown] = useState(86400);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesSearch = offer.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         offer.code.toLowerCase().includes(searchText.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = async (code: string) => {
    try {
      await Clipboard.setString(code);
      Alert.alert('Copied!', `Coupon code ${code} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy coupon code');
    }
  };

  const handleSaveCoupon = (offerId: string) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId
          ? { ...offer, isSaved: !offer.isSaved }
          : offer
      )
    );

    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      if (offer.isSaved) {
        setSavedCoupons(prev => prev.filter(code => code !== offer.code));
      } else {
        setSavedCoupons(prev => [...prev, offer.code]);
      }
    }
  };

  const handleApplyOffer = (offer: Offer) => {
    Alert.alert(
      'Apply Offer',
      `Apply ${offer.code} and get ${offer.discountType === 'flat' ? `₹${offer.discountValue}` : `${offer.discountValue}%`} off?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply & Book',
          onPress: () => {
            // Navigate to booking with pre-applied coupon
            router.push({
              pathname: '/(main)' as any,
              params: { appliedCoupon: offer.code }
            });
          }
        }
      ]
    );
  };

  const toggleTerms = (offerId: string) => {
    setExpandedOffer(expandedOffer === offerId ? null : offerId);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Offers & Coupons</Text>
      <TouchableOpacity onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
        <Ionicons 
          name={notificationsEnabled ? "notifications" : "notifications-off"} 
          size={24} 
          color={notificationsEnabled ? Colors.primary.teal : Colors.text.secondary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offers"
          placeholderTextColor={Colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id as any)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? '#ffffff' : Colors.primary.teal} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeaturedBanner = ({ item }: { item: FeaturedOffer }) => (
    <LinearGradient
      colors={[item.backgroundColor, item.backgroundColor + 'CC']}
      style={styles.featuredBanner}
    >
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        {item.countdown && (
          <View style={styles.countdownContainer}>
            <Ionicons name="time" size={16} color="#ffffff" />
            <Text style={styles.countdownText}>Ends in: {formatCountdown(countdown)}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Explore Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bannerIcon}>
        <Ionicons name="pricetag" size={40} color="rgba(255,255,255,0.3)" />
      </View>
    </LinearGradient>
  );

  const renderFeaturedOffers = () => (
    <View style={styles.featuredSection}>
      <Text style={styles.sectionTitle}>Featured Offers</Text>
      <FlatList
        horizontal
        data={featuredOffers}
        renderItem={renderFeaturedBanner}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 40}
        decelerationRate="fast"
        contentContainerStyle={styles.featuredContainer}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
          setCurrentBannerIndex(index);
        }}
      />
      <View style={styles.bannerIndicators}>
        {featuredOffers.map((_, index) => (
          <View
            key={index}
            style={[
              styles.bannerIndicator,
              currentBannerIndex === index && styles.bannerIndicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderOfferCard = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      {/* Badge */}
      {item.badge && (
        <View style={[styles.offerBadge, { backgroundColor: item.badgeColor }]}>
          <Text style={styles.offerBadgeText}>{item.badge}</Text>
        </View>
      )}

      {/* Save/Heart Icon */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={() => handleSaveCoupon(item.id)}
      >
        <Ionicons 
          name={item.isSaved ? "heart" : "heart-outline"} 
          size={20} 
          color={item.isSaved ? Colors.functional.error : Colors.text.secondary} 
        />
      </TouchableOpacity>

      {/* Coupon Code */}
      <View style={styles.couponCodeContainer}>
        <View style={styles.couponCode}>
          <Text style={styles.couponCodeText}>{item.code}</Text>
        </View>
        <TouchableOpacity 
          style={styles.copyButton}
          onPress={() => handleCopyCode(item.code)}
        >
          <Ionicons name="copy" size={16} color={Colors.primary.teal} />
        </TouchableOpacity>
      </View>

      {/* Offer Details */}
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>

      {/* Discount Info */}
      <View style={styles.discountInfo}>
        <View style={styles.discountMain}>
          <Text style={styles.discountValue}>
            {item.discountType === 'flat' ? `₹${item.discountValue}` : `${item.discountValue}%`} OFF
          </Text>
          {item.maxDiscount && (
            <Text style={styles.maxDiscount}>Up to ₹{item.maxDiscount}</Text>
          )}
        </View>
      </View>

      {/* Offer Details Grid */}
      <View style={styles.offerDetailsGrid}>
        <View style={styles.offerDetail}>
          <Text style={styles.offerDetailLabel}>Min. Booking</Text>
          <Text style={styles.offerDetailValue}>₹{item.minBookingValue}</Text>
        </View>
        <View style={styles.offerDetail}>
          <Text style={styles.offerDetailLabel}>Valid Till</Text>
          <Text style={styles.offerDetailValue}>{item.validTill}</Text>
        </View>
      </View>

      {/* Applicable On */}
      <View style={styles.applicableOn}>
        <Text style={styles.applicableOnLabel}>Applicable on:</Text>
        <View style={styles.applicableOnTags}>
          {item.applicableOn.map((vehicle, index) => (
            <View key={index} style={styles.vehicleTag}>
              <Ionicons name="car" size={12} color={Colors.primary.teal} />
              <Text style={styles.vehicleTagText}>{vehicle}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bank/Payment Method Info */}
      {(item.bankName || item.paymentMethod) && (
        <View style={styles.bankInfo}>
          <Ionicons name="card" size={16} color={Colors.primary.teal} />
          <Text style={styles.bankInfoText}>
            {item.bankName || item.paymentMethod}
          </Text>
        </View>
      )}

      {/* Terms & Conditions */}
      <TouchableOpacity 
        style={styles.termsButton}
        onPress={() => toggleTerms(item.id)}
      >
        <Text style={styles.termsButtonText}>Terms & Conditions</Text>
        <Ionicons 
          name={expandedOffer === item.id ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={Colors.primary.teal} 
        />
      </TouchableOpacity>

      {expandedOffer === item.id && (
        <View style={styles.termsContent}>
          {item.termsAndConditions.map((term, index) => (
            <Text key={index} style={styles.termText}>• {term}</Text>
          ))}
        </View>
      )}

      {/* Apply Button */}
      <TouchableOpacity 
        style={styles.applyButton}
        onPress={() => handleApplyOffer(item)}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.primary.darkTeal]}
          style={styles.applyButtonGradient}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderReferralCard = () => (
    <View style={styles.referralCard}>
      <LinearGradient
        colors={[Colors.accent.blue, Colors.primary.teal]}
        style={styles.referralGradient}
      >
        <View style={styles.referralContent}>
          <View style={styles.referralIcon}>
            <Ionicons name="people" size={32} color="#ffffff" />
          </View>
          <View style={styles.referralInfo}>
            <Text style={styles.referralTitle}>Refer friends, earn ₹500</Text>
            <Text style={styles.referralSubtitle}>Share your code and earn rewards</Text>
            <View style={styles.referralCodeContainer}>
              <Text style={styles.referralCodeLabel}>Your code:</Text>
              <Text style={styles.referralCode}>JOHN2025</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => router.push('/referral-page' as any)}
        >
          <Text style={styles.shareButtonText}>Share Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderSavedCoupons = () => {
    if (savedCoupons.length === 0) return null;

    return (
      <View style={styles.savedSection}>
        <Text style={styles.sectionTitle}>My Saved Coupons</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedCouponsContainer}
        >
          {savedCoupons.map((code, index) => (
            <View key={index} style={styles.savedCouponCard}>
              <Text style={styles.savedCouponCode}>{code}</Text>
              <TouchableOpacity onPress={() => handleCopyCode(code)}>
                <Ionicons name="copy" size={16} color={Colors.primary.teal} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderHowToUse = () => (
    <View style={styles.howToUseSection}>
      <Text style={styles.sectionTitle}>How to Use Coupons</Text>
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Copy coupon code</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Select vehicle and dates</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Apply code at checkout</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>Get instant discount</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={64} color={Colors.text.secondary} />
      <Text style={styles.emptyStateTitle}>No offers available right now</Text>
      <Text style={styles.emptyStateSubtitle}>Check back soon for exciting deals</Text>
      <TouchableOpacity 
        style={styles.notificationToggle}
        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
      >
        <Ionicons name="notifications" size={20} color={Colors.primary.teal} />
        <Text style={styles.notificationToggleText}>Get notified about new offers</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSearchBar()}
        {renderCategories()}
        {renderFeaturedOffers()}
        {renderSavedCoupons()}
        {renderReferralCard()}
        
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Offers' : categories.find(c => c.id === selectedCategory)?.label}
            {filteredOffers.length > 0 && (
              <Text style={styles.offerCount}> ({filteredOffers.length})</Text>
            )}
          </Text>
          
          {filteredOffers.length > 0 ? (
            <FlatList
              data={filteredOffers}
              renderItem={renderOfferCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.offerSeparator} />}
            />
          ) : (
            renderEmptyState()
          )}
        </View>

        {renderHowToUse()}
        
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
  searchContainer: {
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary.teal + '30',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  offerCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  featuredContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  featuredBanner: {
    width: width - 40,
    height: 140,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  countdownText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bannerIcon: {
    marginLeft: 20,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  bannerIndicatorActive: {
    backgroundColor: Colors.primary.teal,
  },
  savedSection: {
    marginBottom: 20,
  },
  savedCouponsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  savedCouponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal + '30',
    gap: 8,
  },
  savedCouponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  referralCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  referralGradient: {
    padding: 20,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referralIcon: {
    marginRight: 16,
  },
  referralInfo: {
    flex: 1,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  referralSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referralCodeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  referralCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  offersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  offerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  offerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    gap: 12,
  },
  couponCode: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  couponCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    letterSpacing: 1,
  },
  copyButton: {
    padding: 12,
    backgroundColor: Colors.primary.teal + '10',
    borderRadius: 8,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  discountInfo: {
    marginBottom: 16,
  },
  discountMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  discountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  maxDiscount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  offerDetailsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  offerDetail: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
    padding: 12,
    borderRadius: 8,
  },
  offerDetailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  offerDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  applicableOn: {
    marginBottom: 16,
  },
  applicableOnLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  applicableOnTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vehicleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  vehicleTagText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.blue + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  bankInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.accent.blue,
  },
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 16,
  },
  termsButtonText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  termsContent: {
    backgroundColor: Colors.background.lightGrey,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  termText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  applyButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  offerSeparator: {
    height: 16,
  },
  howToUseSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  notificationToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  bottomSpacing: {
    height: 40,
  },
});
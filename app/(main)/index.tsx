import { Colors } from '@/src/shared/constants/Colors';
import { useScrollContext } from '@/src/shared/contexts/ScrollContext';
import { useScrollDirection } from '@/src/shared/hooks/useScrollDirection';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Vehicle {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  specs: string;
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  startingPrice: number;
  image: any; // For require() imported images
}

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Cars');
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  // Scroll detection for animated tab bar
  const { scrollDirection, onScroll, cleanup } = useScrollDirection(8);
  const { updateScrollDirection } = useScrollContext();
  
  // Update scroll context when scroll direction changes
  React.useEffect(() => {
    updateScrollDirection(scrollDirection);
  }, [scrollDirection, updateScrollDirection]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Sample data - replace with API calls
  const promotions: Promotion[] = [
    {
      id: '1',
      title: '20% Off',
      subtitle: 'On your first booking',
      image: '',
      backgroundColor: Colors.primary.teal,
    },
    {
      id: '2',
      title: 'Weekend Special',
      subtitle: 'Book for 2+ days',
      image: '',
      backgroundColor: Colors.accent.blue,
    },
    {
      id: '3',
      title: 'Premium Collection',
      subtitle: 'Luxury cars available',
      image: '',
      backgroundColor: Colors.functional.info,
    },
  ];

  const filters = [
    'All Cars', 'Budget Friendly', 'SUV', 'Automatic', 
    'Self Drive', 'With Driver', 'Instant Booking', 'Top Rated'
  ];

  const categories: Category[] = [
    {
      id: '1',
      name: 'Economy Cars',
      icon: '🚗',
      count: 156,
      startingPrice: 800,
      image: require('@/assets/categories/Economy_cars.png'),
    },
    {
      id: '2',
      name: 'Premium Sedans',
      icon: '🚙',
      count: 89,
      startingPrice: 1500,
      image: require('@/assets/categories/Premium_Sedans.png'),
    },
    {
      id: '3',
      name: 'SUVs & MUVs',
      icon: '🚐',
      count: 124,
      startingPrice: 2000,
      image: require('@/assets/categories/SUVs_MUVs.png'),
    },
    {
      id: '4',
      name: 'Luxury Cars',
      icon: '🚘',
      count: 45,
      startingPrice: 3500,
      image: require('@/assets/categories/Luxury_Cars.png'),
    },
    {
      id: '5',
      name: 'Bikes & Scooters',
      icon: '🏍️',
      count: 234,
      startingPrice: 300,
      image: require('@/assets/categories/Scooty.png'),
    },
    {
      id: '6',
      name: 'Self Drive Specials',
      icon: '🔑',
      count: 178,
      startingPrice: 1000,
      image: require('@/assets/categories/Economy_cars.png'), // Using Economy_cars as fallback
    },
  ];

  const nearbyVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Maruti Swift Dzire',
      image: '',
      rating: 4.8,
      reviews: 23,
      price: 1500,
      distance: 2.3,
      specs: 'Automatic, Petrol, 5 seats',
    },
    {
      id: '2',
      name: 'Hyundai Creta',
      image: '',
      rating: 4.6,
      reviews: 41,
      price: 2200,
      distance: 1.8,
      specs: 'Manual, Diesel, 5 seats',
    },
    {
      id: '3',
      name: 'Toyota Innova',
      image: '',
      rating: 4.9,
      reviews: 67,
      price: 2800,
      distance: 3.1,
      specs: 'Manual, Diesel, 7 seats',
      featured: true,
    },
  ];

  const collections = [
    'Perfect for Weekend Trips',
    'Business Travel Essentials',
    'Family Vehicles',
    'Budget Friendly Options',
  ];

  const benefits = [
    { icon: 'shield-checkmark', title: 'Verified Vehicles', subtitle: 'All cars verified' },
    { icon: 'headset', title: '24/7 Support', subtitle: 'Round the clock help' },
    { icon: 'time', title: 'Flexible Booking', subtitle: 'Cancel anytime' },
    { icon: 'pricetag', title: 'Best Prices', subtitle: 'Guaranteed lowest rates' },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.locationSelector}>
          <Ionicons name="location" size={16} color={Colors.primary.teal} />
          <Text style={styles.cityText}>{selectedCity}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => router.push('/favorites-page' as any)}
          >
            <Ionicons name="heart-outline" size={20} color={Colors.primary.teal} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications-page' as any)}
          >
            <Ionicons name="notifications" size={20} color={Colors.text.secondary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/edit-profile-page' as any)}
          >
            <Ionicons name="person" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <TouchableOpacity style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where do you want to go?"
          placeholderTextColor={Colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={18} color={Colors.primary.teal} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipSelected
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextSelected
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPromotion = ({ item }: { item: Promotion }) => (
    <View style={[styles.promoCard, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>{item.title}</Text>
        <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promoImageContainer}>
        <Ionicons name="car-sport" size={40} color="rgba(255,255,255,0.3)" />
      </View>
    </View>
  );

  const renderPromotions = () => (
    <View style={styles.promotionsSection}>
      <FlatList
        horizontal
        data={promotions}
        renderItem={renderPromotion}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 40}
        decelerationRate="fast"
        contentContainerStyle={styles.promotionsContainer}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
          setCurrentPromoIndex(index);
        }}
      />
      <View style={styles.promoIndicators}>
        {promotions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.promoIndicator,
              currentPromoIndex === index && styles.promoIndicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryIcon}>
        <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} vehicles</Text>
      <Text style={styles.categoryPrice}>₹{item.startingPrice}+/day</Text>
    </TouchableOpacity>
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.categoriesGrid}
      />
    </View>
  );

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity style={styles.vehicleCard}>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      <View style={styles.vehicleImageContainer}>
        <Ionicons name="car-sport" size={32} color={Colors.primary.teal} />
      </View>
      
      <Text style={styles.vehicleName}>{item.name}</Text>
      
      <View style={styles.vehicleRating}>
        <Ionicons name="star" size={12} color="#FFC107" />
        <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
      </View>
      
      <Text style={styles.vehicleSpecs}>{item.specs}</Text>
      
      <View style={styles.vehicleFooter}>
        <View>
          <Text style={styles.vehiclePrice}>₹{item.price}/day</Text>
          <Text style={styles.vehicleDistance}>{item.distance} km away</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push({
                  pathname: '/booking' as any,
                  params: {
                    vehicleId: item.id,
                    vehicleName: item.name,
                    vehiclePrice: item.price.toString(),
                    vehicleImage: item.image,
                    vehicleLocation: 'Bangalore',
                    vehicleSpecs: item.specs,
                    vehicleRating: item.rating.toString(),
                    vehicleReviews: item.reviews.toString(),
                    vehicleFuelType: 'Petrol',
                    vehicleTransmission: 'Automatic',
                    vehicleSeats: '5'
                  }
                })}
        >
          <LinearGradient
            colors={[Colors.primary.teal, Colors.accent.blue]}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>Book</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyVehicles = () => (
    <View style={styles.nearbySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Near You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={nearbyVehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.vehiclesList}
      />
    </View>
  );

  const renderCollections = () => (
    <View style={styles.collectionsSection}>
      <Text style={styles.sectionTitle}>Collections</Text>
      {collections.map((collection, index) => (
        <TouchableOpacity key={index} style={styles.collectionItem}>
          <Ionicons name="albums" size={20} color={Colors.primary.teal} />
          <Text style={styles.collectionText}>{collection}</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBenefits = () => (
    <View style={styles.benefitsSection}>
      <Text style={styles.sectionTitle}>Why Choose MOVA</Text>
      <View style={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name={benefit.icon as any} size={24} color={Colors.primary.teal} />
            </View>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitSubtitle}>{benefit.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {renderSearchBar()}
        {renderFilters()}
        {renderPromotions()}
        {renderCategories()}
        {renderNearbyVehicles()}
        {renderCollections()}
        {renderBenefits()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.functional.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for tab bar
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  filterButton: {
    padding: 4,
  },
  filtersSection: {
    paddingVertical: 10,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  promotionsSection: {
    paddingVertical: 15,
  },
  promotionsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  promoCard: {
    width: width - 40,
    height: 120,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  promoImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 6,
  },
  promoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  promoIndicatorActive: {
    backgroundColor: Colors.primary.teal,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImage: {
    width: 35,
    height: 35,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  categoryPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  nearbySection: {
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  vehiclesList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  vehicleCard: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.functional.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  vehicleImageContainer: {
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  vehicleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  vehicleDistance: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  bookButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  collectionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  collectionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  benefitItem: {
    width: (width - 55) / 2,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  benefitSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

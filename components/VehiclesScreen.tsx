import { Colors } from '@/constants/Colors';
import { useScrollContext } from '@/contexts/ScrollContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Vehicle {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  distance: number;
  location: string;
  specs: string;
  features: string[];
  available: boolean;
  instantBooking: boolean;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seats: number;
}

export default function VehiclesScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('distance');

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

  // Sample vehicle data - replace with API data
  const availableVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Maruti Swift Dzire 2023',
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Swift+Dzire',
      rating: 4.8,
      reviews: 128,
      pricePerDay: 1200,
      distance: 0.8,
      location: 'MG Road, Bangalore',
      specs: 'Automatic, Petrol, 5 seats',
      features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'],
      available: true,
      instantBooking: true,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seats: 5,
    },
    {
      id: '2',
      name: 'Hyundai Creta 2023',
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Creta',
      rating: 4.6,
      reviews: 95,
      pricePerDay: 2000,
      distance: 1.2,
      location: 'Koramangala, Bangalore',
      specs: 'Manual, Diesel, 5 seats',
      features: ['AC', 'GPS', 'Sunroof', 'Cruise Control'],
      available: true,
      instantBooking: false,
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 5,
    },
    {
      id: '3',
      name: 'Toyota Innova Crysta',
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Innova',
      rating: 4.9,
      reviews: 203,
      pricePerDay: 2800,
      distance: 2.1,
      location: 'HSR Layout, Bangalore',
      specs: 'Manual, Diesel, 7 seats',
      features: ['AC', 'GPS', 'Captain Seats', 'Entertainment System'],
      available: true,
      instantBooking: true,
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 7,
    },
    {
      id: '4',
      name: 'Honda City 2023',
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=City',
      rating: 4.7,
      reviews: 87,
      pricePerDay: 1500,
      distance: 1.5,
      location: 'Indiranagar, Bangalore',
      specs: 'Automatic, Petrol, 5 seats',
      features: ['AC', 'GPS', 'Sunroof', 'Wireless Charging'],
      available: true,
      instantBooking: true,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seats: 5,
    },
    {
      id: '5',
      name: 'Mahindra Scorpio',
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Scorpio',
      rating: 4.5,
      reviews: 156,
      pricePerDay: 2200,
      distance: 3.2,
      location: 'Electronic City, Bangalore',
      specs: 'Manual, Diesel, 7 seats',
      features: ['AC', '4WD', 'High Ground Clearance', 'Tough Build'],
      available: false,
      instantBooking: false,
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 7,
    },
  ];

  const filters = ['All', 'Available Now', 'Instant Booking', 'Automatic', 'Manual', 'Under ₹2000'];

  const handleBookVehicle = (vehicle: Vehicle) => {
    // Clean up scroll context before navigation
    cleanup();
    
    // Navigate to booking flow with selected vehicle
    router.push({
      pathname: '/booking' as any,
      params: { 
        vehicleId: vehicle.id, 
        vehicleName: vehicle.name, 
        vehiclePrice: vehicle.pricePerDay,
        vehicleImage: vehicle.image,
        vehicleLocation: vehicle.location,
        vehicleSpecs: vehicle.specs,
        vehicleRating: vehicle.rating.toString(),
        vehicleReviews: vehicle.reviews.toString(),
        vehicleFuelType: vehicle.fuelType,
        vehicleTransmission: vehicle.transmission,
        vehicleSeats: vehicle.seats.toString()
      }
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Available Vehicles</Text>
      <Text style={styles.headerSubtitle}>Find and book your perfect ride</Text>
    </View>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vehicles..."
          placeholderTextColor={Colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={18} color={Colors.primary.teal} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={filters}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === item && styles.filterChipSelected
            ]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === item && styles.filterTextSelected
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      />
    </View>
  );

  const renderVehicleCard = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      {!item.available && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Not Available</Text>
        </View>
      )}
      
      {item.instantBooking && item.available && (
        <View style={styles.instantBadge}>
          <Ionicons name="flash" size={12} color="#ffffff" />
          <Text style={styles.instantText}>Instant</Text>
        </View>
      )}

      <View style={styles.vehicleImageContainer}>
        <View style={styles.placeholderImage}>
          <Ionicons name="car-sport" size={40} color={Colors.primary.teal} />
          <Text style={styles.vehicleNameInImage}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        
        <View style={styles.vehicleRating}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
        </View>
        
        <Text style={styles.vehicleSpecs}>{item.specs}</Text>
        
        <View style={styles.featuresContainer}>
          {item.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {item.features.length > 3 && (
            <Text style={styles.moreFeatures}>+{item.features.length - 3} more</Text>
          )}
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={12} color={Colors.text.secondary} />
          <Text style={styles.locationText}>{item.distance} km away • {item.location}</Text>
        </View>
      </View>

      <View style={styles.vehicleFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>₹{item.pricePerDay}/day</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.bookButton,
            !item.available && styles.bookButtonDisabled
          ]}
          onPress={() => handleBookVehicle(item)}
          disabled={!item.available}
        >
          <LinearGradient
            colors={item.available ? [Colors.primary.teal, Colors.accent.blue] : ['#E5E7EB', '#E5E7EB']}
            style={styles.bookButtonGradient}
          >
            <Text style={[
              styles.bookButtonText,
              !item.available && styles.bookButtonTextDisabled
            ]}>
              {item.available ? 'Book Now' : 'Unavailable'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredVehicles = availableVehicles.filter(vehicle => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Available Now') return vehicle.available;
    if (selectedFilter === 'Instant Booking') return vehicle.instantBooking && vehicle.available;
    if (selectedFilter === 'Automatic') return vehicle.transmission === 'Automatic';
    if (selectedFilter === 'Manual') return vehicle.transmission === 'Manual';
    if (selectedFilter === 'Under ₹2000') return vehicle.pricePerDay < 2000;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={renderSearchAndFilters}
      />
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
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  searchSection: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    marginHorizontal: 12,
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
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
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  vehicleCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.functional.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  unavailableText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  instantBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.functional.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instantText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  vehicleImageContainer: {
    height: 180,
    backgroundColor: '#F9FAFB',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  vehicleNameInImage: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  vehicleDetails: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  vehicleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehicleSpecs: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  moreFeatures: {
    fontSize: 12,
    color: Colors.text.secondary,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bookButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  images: string[];
  rating: number;
  reviews: number;
  distance: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  seats: number;
  pricePerDay: number;
  pricePerWeek?: number;
  vendor: {
    name: string;
    verified: boolean;
  };
  featured?: boolean;
  instantBooking?: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

interface Filter {
  priceRange: [number, number];
  vehicleTypes: string[];
  transmission: string[];
  fuelType: string[];
  seatingCapacity: string[];
  features: string[];
  bookingType: string[];
  instantBooking: boolean;
  rating: string;
  distance: string;
  vendorType: string[];
}

type SortOption = 'recommended' | 'priceLowToHigh' | 'priceHighToLow' | 'rating' | 'distance' | 'newest';

interface ActiveFilter {
  type: string;
  label: string;
  value: any;
}

export default function SearchResultsScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const [filters, setFilters] = useState<Filter>({
    priceRange: [500, 10000],
    vehicleTypes: [],
    transmission: [],
    fuelType: [],
    seatingCapacity: [],
    features: [],
    bookingType: [],
    instantBooking: false,
    rating: '',
    distance: '',
    vendorType: [],
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: 'location', label: 'Bangalore', value: 'bangalore' },
    { type: 'duration', label: '1-2 Days', value: '1-2' },
    { type: 'price', label: '₹1000-2000', value: [1000, 2000] },
  ]);

  // Sample data
  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Hyundai Creta',
      brand: 'Hyundai',
      images: [''], // Would contain actual image URLs
      rating: 4.9,
      reviews: 45,
      distance: 2.5,
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: 5,
      pricePerDay: 2500,
      pricePerWeek: 12000,
      vendor: { name: 'Amit Motors', verified: true },
      featured: true,
      instantBooking: true,
      location: { lat: 12.9716, lng: 77.5946 },
    },
    {
      id: '2',
      name: 'Maruti Swift Dzire',
      brand: 'Maruti',
      images: [''],
      rating: 4.7,
      reviews: 32,
      distance: 1.8,
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerDay: 1800,
      vendor: { name: 'City Cars', verified: true },
      instantBooking: true,
      location: { lat: 12.9716, lng: 77.5946 },
    },
    {
      id: '3',
      name: 'Toyota Innova Crysta',
      brand: 'Toyota',
      images: [''],
      rating: 4.8,
      reviews: 67,
      distance: 3.2,
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: 7,
      pricePerDay: 3200,
      pricePerWeek: 18000,
      vendor: { name: 'Premium Rentals', verified: true },
      featured: true,
      location: { lat: 12.9716, lng: 77.5946 },
    },
  ];

  const sortOptions = [
    { key: 'recommended', label: 'Recommended' },
    { key: 'priceLowToHigh', label: 'Price: Low to High' },
    { key: 'priceHighToLow', label: 'Price: High to Low' },
    { key: 'rating', label: 'Rating' },
    { key: 'distance', label: 'Distance' },
    { key: 'newest', label: 'Newest First' },
  ];

  const vehicleTypeOptions = [
    { key: 'hatchback', label: 'Hatchback', count: 45 },
    { key: 'sedan', label: 'Sedan', count: 67 },
    { key: 'suv', label: 'SUV', count: 34 },
    { key: 'muv', label: 'MUV', count: 23 },
    { key: 'luxury', label: 'Luxury', count: 12 },
    { key: 'bike', label: 'Bike/Scooter', count: 89 },
  ];

  const removeActiveFilter = (filterToRemove: ActiveFilter) => {
    setActiveFilters(prev => prev.filter(filter => 
      !(filter.type === filterToRemove.type && filter.value === filterToRemove.value)
    ));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilters({
      priceRange: [500, 10000],
      vehicleTypes: [],
      transmission: [],
      fuelType: [],
      seatingCapacity: [],
      features: [],
      bookingType: [],
      instantBooking: false,
      rating: '',
      distance: '',
      vendorType: [],
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>All Vehicles</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          >
            <Ionicons 
              name={viewMode === 'list' ? "map" : "list"} 
              size={20} 
              color={Colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActiveFilters = () => (
    <View style={styles.activeFiltersContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activeFiltersContent}
      >
        {activeFilters.map((filter, index) => (
          <View key={index} style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>{filter.label}</Text>
            <TouchableOpacity onPress={() => removeActiveFilter(filter)}>
              <Ionicons name="close" size={16} color={Colors.primary.teal} />
            </TouchableOpacity>
          </View>
        ))}
        
        {activeFilters.length > 0 && (
          <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  const renderSortFilterBar = () => (
    <View style={styles.sortFilterBar}>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setShowFilters(true)}
      >
        <Ionicons name="options" size={18} color={Colors.primary.teal} />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={() => setShowSortMenu(true)}
      >
        <Text style={styles.sortButtonText}>
          {sortOptions.find(opt => opt.key === sortBy)?.label}
        </Text>
        <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>
      
      <Text style={styles.resultsCount}>{vehicles.length} cars available</Text>
    </View>
  );

  const renderVehicleCard = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity style={styles.vehicleCard}>
      {/* Vehicle Image */}
      <View style={styles.vehicleImageContainer}>
        <View style={styles.vehicleImagePlaceholder}>
          <Ionicons name="car-sport" size={40} color={Colors.primary.teal} />
        </View>
        
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.badgeText}>Featured</Text>
          </View>
        )}
        
        {item.instantBooking && (
          <View style={styles.instantBookingBadge}>
            <Text style={styles.badgeText}>Instant Booking</Text>
          </View>
        )}
      </View>
      
      {/* Vehicle Info */}
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={14} color={Colors.text.secondary} />
          <Text style={styles.locationText}>{item.distance} km away</Text>
        </View>
        
        {/* Specs */}
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="settings" size={14} color={Colors.text.secondary} />
            <Text style={styles.specText}>{item.transmission}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="speedometer" size={14} color={Colors.text.secondary} />
            <Text style={styles.specText}>{item.fuel}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="people" size={14} color={Colors.text.secondary} />
            <Text style={styles.specText}>{item.seats} seats</Text>
          </View>
        </View>
        
        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <View>
            <Text style={styles.pricePerDay}>₹{item.pricePerDay}/day</Text>
            {item.pricePerWeek && (
              <Text style={styles.pricePerWeek}>₹{item.pricePerWeek}/week</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.viewDetailsButton}>
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.viewDetailsGradient}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Vendor Info */}
        <View style={styles.vendorContainer}>
          <Text style={styles.vendorText}>By {item.vendor.name}</Text>
          {item.vendor.verified && (
            <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSortMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={() => setShowSortMenu(false)}
      >
        <View style={styles.sortModal}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.sortOption}
              onPress={() => {
                setSortBy(option.key as SortOption);
                setShowSortMenu(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === option.key && styles.sortOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={20} color={Colors.primary.teal} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderFilterPanel = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterContent}>
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <Text style={styles.priceRangeText}>
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/day
              </Text>
              {/* Placeholder for slider */}
              <View style={styles.sliderPlaceholder}>
                <Text style={styles.sliderText}>Price Range Slider</Text>
              </View>
            </View>
          </View>
          
          {/* Vehicle Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Vehicle Type</Text>
            {vehicleTypeOptions.map((type) => (
              <TouchableOpacity key={type.key} style={styles.checkboxItem}>
                <View style={styles.checkbox}>
                  {filters.vehicleTypes.includes(type.key) && (
                    <Ionicons name="checkmark" size={16} color={Colors.primary.teal} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{type.label}</Text>
                <Text style={styles.checkboxCount}>({type.count})</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* More filter sections would go here */}
        </ScrollView>
        
        <View style={styles.filterFooter}>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyFiltersButton}>
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.applyFiltersGradient}
            >
              <Text style={styles.applyFiltersText}>Apply Filters ({vehicles.length})</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-sport" size={80} color={Colors.text.secondary} />
      <Text style={styles.emptyTitle}>No vehicles found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your filters or search</Text>
      
      <TouchableOpacity style={styles.emptyButton} onPress={clearAllFilters}>
        <Text style={styles.emptyButtonText}>Clear Filters</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.browseAllButton}>
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.browseAllGradient}
        >
          <Text style={styles.browseAllText}>Browse All Cars</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {renderHeader()}
      {renderActiveFilters()}
      {renderSortFilterBar()}
      
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesList}
        />
      ) : (
        renderEmptyState()
      )}
      
      {renderSortModal()}
      {renderFilterPanel()}
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  activeFiltersContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeFiltersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  sortFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    gap: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 'auto',
  },
  vehiclesList: {
    padding: 20,
    gap: 16,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  vehicleImageContainer: {
    height: 180,
    backgroundColor: '#F9FAFB',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.functional.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  instantBookingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  specsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricePerDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  pricePerWeek: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  viewDetailsButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewDetailsGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 40,
    paddingVertical: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  sortOptionTextSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  filterModal: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  priceRangeContainer: {
    gap: 12,
  },
  priceRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  sliderPlaceholder: {
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sliderText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  checkboxCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  filterFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  applyFiltersButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  applyFiltersGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  browseAllButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  browseAllGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
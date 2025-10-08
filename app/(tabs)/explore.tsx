import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
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

interface Brand {
  id: string;
  name: string;
  logo: string;
  vehicleCount: number;
}

interface SearchFilter {
  location: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  vehicleTypes: string[];
  priceRange: [number, number];
}

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    location: 'Bangalore',
    pickupDate: 'Today',
    pickupTime: '10:00 AM',
    returnDate: 'Tomorrow',
    returnTime: '10:00 AM',
    vehicleTypes: [],
    priceRange: [500, 5000],
  });

  const recentSearches = [
    'Swift Dzire in Bangalore',
    'SUV for weekend trip',
    'Automatic cars under ₹2000',
    'Luxury sedan HSR Layout',
    'Honda City Koramangala',
  ];

  const popularSearches = [
    'Swift Dzire Bangalore',
    'SUV for weekend',
    'Automatic cars near me',
    'Honda City rent',
    'Luxury cars Mumbai',
    'Self drive Hyderabad',
  ];

  const brands: Brand[] = [
    { id: '1', name: 'Maruti Suzuki', logo: '🚗', vehicleCount: 245 },
    { id: '2', name: 'Hyundai', logo: '🚙', vehicleCount: 189 },
    { id: '3', name: 'Honda', logo: '🚘', vehicleCount: 156 },
    { id: '4', name: 'Toyota', logo: '🚐', vehicleCount: 134 },
    { id: '5', name: 'Mahindra', logo: '🚚', vehicleCount: 98 },
    { id: '6', name: 'Tata', logo: '🚛', vehicleCount: 87 },
    { id: '7', name: 'MG', logo: '🏎️', vehicleCount: 45 },
    { id: '8', name: 'Kia', logo: '🚗', vehicleCount: 67 },
  ];

  const vehicleTypes = [
    'Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury', 'Convertible'
  ];

  const clearSearch = () => {
    setSearchText('');
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Add to recent searches and perform search
      console.log('Searching for:', searchText);
      setIsSearchFocused(false);
    }
  };

  const selectRecentSearch = (search: string) => {
    setSearchText(search);
    setIsSearchFocused(false);
  };

  const toggleVehicleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type]
    }));
  };

  const renderSearchHeader = () => (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by car, brand, location..."
            placeholderTextColor={Colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearchFocused(true)}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color={Colors.primary.teal} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderRecentSearches = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      {recentSearches.map((search, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchItem}
          onPress={() => selectRecentSearch(search)}
        >
          <Ionicons name="time" size={16} color={Colors.text.secondary} />
          <Text style={styles.searchItemText}>{search}</Text>
          <Ionicons name="arrow-back" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPopularSearches = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Searches</Text>
      
      <View style={styles.popularGrid}>
        {popularSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.popularChip}
            onPress={() => selectRecentSearch(search)}
          >
            <Ionicons name="trending-up" size={14} color={Colors.primary.teal} />
            <Text style={styles.popularText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBrand = ({ item }: { item: Brand }) => (
    <TouchableOpacity style={styles.brandCard}>
      <View style={styles.brandLogo}>
        <Text style={styles.brandEmoji}>{item.logo}</Text>
      </View>
      <Text style={styles.brandName}>{item.name}</Text>
      <Text style={styles.brandCount}>{item.vehicleCount} cars</Text>
    </TouchableOpacity>
  );

  const renderBrands = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Search by Brand</Text>
        <TouchableOpacity>
          <Text style={styles.showAllText}>Show All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={brands.slice(0, 6)}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.brandsGrid}
      />
    </View>
  );

  const renderDateTimeSection = () => (
    <View style={styles.dateTimeSection}>
      <Text style={styles.filterLabel}>Pickup & Return</Text>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeLabel}>Pickup</Text>
          <TouchableOpacity style={styles.dateTimeValue}>
            <Text style={styles.dateTimeText}>{filters.pickupDate}, {filters.pickupTime}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.durationIndicator}>
          <View style={styles.durationLine} />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>1 Day</Text>
          </View>
        </View>
        
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeLabel}>Return</Text>
          <TouchableOpacity style={styles.dateTimeValue}>
            <Text style={styles.dateTimeText}>{filters.returnDate}, {filters.returnTime}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.changeDatesButton}>
        <Ionicons name="calendar" size={16} color={Colors.primary.teal} />
        <Text style={styles.changeDatesText}>Change dates</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuickFilters = () => (
    <View style={styles.filtersSection}>
      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="options" size={18} color={Colors.primary.teal} />
        <Text style={styles.filterToggleText}>Filters</Text>
        <Ionicons 
          name={showFilters ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={Colors.text.secondary} 
        />
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Location Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Location</Text>
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="location" size={16} color={Colors.primary.teal} />
              <Text style={styles.locationText}>{filters.location}</Text>
              <Text style={styles.changeLocationText}>Change location</Text>
            </TouchableOpacity>
          </View>

          {renderDateTimeSection()}

          {/* Vehicle Type Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Vehicle Type</Text>
            <View style={styles.vehicleTypesContainer}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.vehicleTypeChip,
                    filters.vehicleTypes.includes(type) && styles.vehicleTypeChipSelected
                  ]}
                  onPress={() => toggleVehicleType(type)}
                >
                  <Text style={[
                    styles.vehicleTypeText,
                    filters.vehicleTypes.includes(type) && styles.vehicleTypeTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceLabels}>
                <Text style={styles.priceLabel}>₹{filters.priceRange[0]}/day</Text>
                <Text style={styles.priceLabel}>₹{filters.priceRange[1]}/day</Text>
              </View>
              <View style={styles.priceRangeSlider}>
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => setFilters(prev => ({ ...prev, priceRange: [500, 1500] }))}
                >
                  <Text style={styles.priceButtonText}>₹500-1500</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => setFilters(prev => ({ ...prev, priceRange: [1500, 3000] }))}
                >
                  <Text style={styles.priceButtonText}>₹1500-3000</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => setFilters(prev => ({ ...prev, priceRange: [3000, 5000] }))}
                >
                  <Text style={styles.priceButtonText}>₹3000+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Apply Filters Button */}
          <TouchableOpacity style={styles.applyFiltersButton}>
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.applyFiltersGradient}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {renderSearchHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isSearchFocused && renderQuickFilters()}
        
        {isSearchFocused ? (
          <>
            {renderRecentSearches()}
            {renderPopularSearches()}
          </>
        ) : (
          renderBrands()
        )}
        
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
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  searchInputContainer: {
    flex: 1,
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
  clearButton: {
    padding: 4,
  },
  voiceButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  showAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  searchItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  popularText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  brandsGrid: {
    gap: 12,
  },
  brandCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandEmoji: {
    fontSize: 20,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandCount: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  filterToggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  filtersContainer: {
    marginTop: 15,
    gap: 20,
  },
  filterItem: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  changeLocationText: {
    fontSize: 12,
    color: Colors.primary.teal,
    marginLeft: 'auto',
  },
  dateTimeSection: {
    gap: 12,
  },
  dateTimeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeItem: {
    gap: 8,
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  dateTimeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  durationIndicator: {
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  durationLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.primary.teal,
  },
  durationBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    top: 6,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  changeDatesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  changeDatesText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  vehicleTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vehicleTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vehicleTypeChipSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  vehicleTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  vehicleTypeTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  priceRangeContainer: {
    gap: 10,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  priceSlider: {
    height: 40,
  },
  priceRangeSlider: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  priceButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  priceButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  sliderThumb: {
    backgroundColor: Colors.primary.teal,
    width: 20,
    height: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  applyFiltersButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  applyFiltersGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 20,
  },
});
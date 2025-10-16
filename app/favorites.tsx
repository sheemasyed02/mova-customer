import { Colors } from '@/constants/Colors';
import { useScrollContext } from '@/contexts/ScrollContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface FavoriteVehicle {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  originalPrice?: number; // For price change detection
  distance: number;
  location: string;
  specs: string;
  features: string[];
  available: boolean;
  instantBooking: boolean;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seats: number;
  addedDate: string;
  collection?: string;
  priceChanged?: 'increased' | 'decreased';
  selected?: boolean;
}

interface Collection {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'price_low' | 'price_high' | 'distance';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedFilter, setSelectedFilter] = useState('All favorites');
  const [editMode, setEditMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Scroll detection for animated tab bar
  const { scrollDirection, onScroll, cleanup } = useScrollDirection(8);
  const { updateScrollDirection } = useScrollContext();

  React.useEffect(() => {
    updateScrollDirection(scrollDirection);
  }, [scrollDirection, updateScrollDirection]);

  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Sample data - replace with API data
  React.useEffect(() => {
    const sampleFavorites: FavoriteVehicle[] = [
      {
        id: '1',
        name: 'Maruti Swift Dzire 2023',
        image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Swift+Dzire',
        rating: 4.8,
        reviews: 128,
        pricePerDay: 1200,
        originalPrice: 1100,
        distance: 0.8,
        location: 'MG Road, Bangalore',
        specs: 'Automatic, Petrol, 5 seats',
        features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'],
        available: true,
        instantBooking: true,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        addedDate: '2024-10-14',
        collection: 'Budget options',
        priceChanged: 'increased',
      },
      {
        id: '2',
        name: 'Hyundai Creta 2023',
        image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Creta',
        rating: 4.6,
        reviews: 95,
        pricePerDay: 1800,
        originalPrice: 2000,
        distance: 1.2,
        location: 'Koramangala, Bangalore',
        specs: 'Manual, Diesel, 5 seats',
        features: ['AC', 'GPS', 'Sunroof', 'Cruise Control'],
        available: true,
        instantBooking: false,
        fuelType: 'Diesel',
        transmission: 'Manual',
        seats: 5,
        addedDate: '2024-10-12',
        collection: 'Weekend trips',
        priceChanged: 'decreased',
      },
      {
        id: '3',
        name: 'BMW 3 Series',
        image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=BMW+3+Series',
        rating: 4.9,
        reviews: 203,
        pricePerDay: 4500,
        distance: 2.1,
        location: 'HSR Layout, Bangalore',
        specs: 'Automatic, Petrol, 5 seats',
        features: ['AC', 'GPS', 'Sunroof', 'Premium Audio'],
        available: false,
        instantBooking: true,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        addedDate: '2024-10-10',
        collection: 'Luxury cars',
      },
    ];

    const sampleCollections: Collection[] = [
      { id: '1', name: 'Weekend trips', icon: 'car-sport', count: 5, color: Colors.primary.teal },
      { id: '2', name: 'Business travel', icon: 'briefcase', count: 3, color: Colors.accent.blue },
      { id: '3', name: 'Budget options', icon: 'wallet', count: 8, color: Colors.functional.success },
      { id: '4', name: 'Luxury cars', icon: 'diamond', count: 2, color: '#F59E0B' },
    ];

    setFavorites(sampleFavorites);
    setCollections(sampleCollections);
  }, []);

  const getSortedFavorites = () => {
    let filtered = favorites.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = selectedFilter === 'All favorites' || 
                           (selectedFilter === 'Available now' && vehicle.available) ||
                           (selectedFilter === 'Instant booking' && vehicle.instantBooking);
      const matchesCollection = !selectedCollection || vehicle.collection === selectedCollection;
      
      return matchesSearch && matchesFilter && matchesCollection;
    });

    switch (sortBy) {
      case 'price_low':
        return filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price_high':
        return filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'distance':
        return filtered.sort((a, b) => a.distance - b.distance);
      default: // recent
        return filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
    }
  };

  const toggleFavorite = (vehicleId: string) => {
    setFavorites(prev => prev.filter(v => v.id !== vehicleId));
  };

  const toggleSelection = (vehicleId: string) => {
    setFavorites(prev =>
      prev.map(v => v.id === vehicleId ? { ...v, selected: !v.selected } : v)
    );
  };

  const selectAll = () => {
    const allSelected = favorites.every(v => v.selected);
    setFavorites(prev =>
      prev.map(v => ({ ...v, selected: !allSelected }))
    );
  };

  const removeSelected = () => {
    const selectedCount = favorites.filter(v => v.selected).length;
    Alert.alert(
      'Remove Favorites',
      `Remove ${selectedCount} vehicles from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(v => !v.selected));
            setEditMode(false);
          },
        },
      ]
    );
  };

  const shareSelected = async () => {
    const selectedVehicles = favorites.filter(v => v.selected);
    const shareText = `Check out these amazing vehicles I found on MOVA:\n\n${selectedVehicles
      .map(v => `${v.name} - ₹${v.pricePerDay}/day`)
      .join('\n')}\n\nDownload MOVA app to book now!`;

    try {
      await Share.share({
        message: shareText,
        title: 'My MOVA Favorites',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const showVehicleActions = (vehicle: FavoriteVehicle) => {
    const options = ['View Details', 'Book Now', 'Share', 'Remove from Favorites', 'Cancel'];
    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 4;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              router.push(`/vehicle-details?id=${vehicle.id}` as any);
              break;
            case 1:
              handleBookVehicle(vehicle);
              break;
            case 2:
              shareVehicle(vehicle);
              break;
            case 3:
              toggleFavorite(vehicle.id);
              break;
          }
        }
      );
    } else {
      // Android alert fallback
      Alert.alert(
        vehicle.name,
        'Choose an action',
        [
          { text: 'View Details', onPress: () => router.push(`/vehicle-details?id=${vehicle.id}` as any) },
          { text: 'Book Now', onPress: () => handleBookVehicle(vehicle) },
          { text: 'Share', onPress: () => shareVehicle(vehicle) },
          { text: 'Remove', style: 'destructive', onPress: () => toggleFavorite(vehicle.id) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const shareVehicle = async (vehicle: FavoriteVehicle) => {
    try {
      await Share.share({
        message: `Check out this ${vehicle.name} for ₹${vehicle.pricePerDay}/day on MOVA! Available at ${vehicle.location}`,
        title: vehicle.name,
      });
    } catch (error) {
      console.error('Error sharing vehicle:', error);
    }
  };

  const handleBookVehicle = (vehicle: FavoriteVehicle) => {
    cleanup();
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
        vehicleSeats: vehicle.seats.toString(),
      },
    });
  };

  const shareFavoritesList = async () => {
    try {
      await Share.share({
        message: `Check out my vehicle wishlist on MOVA! I've saved ${favorites.length} amazing cars. Download the app to see them all!`,
        title: 'My MOVA Favorites',
      });
    } catch (error) {
      console.error('Error sharing favorites:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favorites.length} vehicle{favorites.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={shareFavoritesList}
          >
            <Ionicons name="share" size={20} color={Colors.primary.teal} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, editMode && styles.headerButtonActive]}
            onPress={() => setEditMode(!editMode)}
          >
            <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
              {editMode ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderViewOptions = () => (
    <View style={styles.viewOptions}>
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons
            name="grid"
            size={20}
            color={viewMode === 'grid' ? Colors.primary.teal : Colors.text.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons
            name="list"
            size={20}
            color={viewMode === 'list' ? Colors.primary.teal : Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
        {[
          { key: 'recent', label: 'Recently added' },
          { key: 'price_low', label: 'Price: Low to High' },
          { key: 'price_high', label: 'Price: High to Low' },
          { key: 'distance', label: 'Distance from you' },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.sortChip,
              sortBy === option.key && styles.sortChipActive,
            ]}
            onPress={() => setSortBy(option.key as SortOption)}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === option.key && styles.sortTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCollections = () => (
    <View style={styles.collectionsContainer}>
      <Text style={styles.collectionsTitle}>Collections</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.collectionCard,
            !selectedCollection && styles.collectionCardActive,
          ]}
          onPress={() => setSelectedCollection(null)}
        >
          <View style={[styles.collectionIcon, { backgroundColor: Colors.background.lightGrey }]}>
            <Ionicons name="heart" size={20} color={Colors.primary.teal} />
          </View>
          <Text style={styles.collectionName}>All</Text>
          <Text style={styles.collectionCount}>{favorites.length}</Text>
        </TouchableOpacity>

        {collections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={[
              styles.collectionCard,
              selectedCollection === collection.name && styles.collectionCardActive,
            ]}
            onPress={() =>
              setSelectedCollection(
                selectedCollection === collection.name ? null : collection.name
              )
            }
          >
            <View style={[styles.collectionIcon, { backgroundColor: collection.color + '20' }]}>
              <Ionicons name={collection.icon as any} size={20} color={collection.color} />
            </View>
            <Text style={styles.collectionName}>{collection.name}</Text>
            <Text style={styles.collectionCount}>{collection.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['All favorites', 'Available now', 'Instant booking'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEditModeActions = () => {
    if (!editMode) return null;

    const selectedCount = favorites.filter(v => v.selected).length;
    const allSelected = favorites.length > 0 && favorites.every(v => v.selected);

    return (
      <View style={styles.editActions}>
        <TouchableOpacity style={styles.selectAllButton} onPress={selectAll}>
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>

        {selectedCount > 0 && (
          <View style={styles.batchActions}>
            <TouchableOpacity style={styles.batchButton} onPress={shareSelected}>
              <Ionicons name="share" size={16} color={Colors.primary.teal} />
              <Text style={styles.batchButtonText}>Share ({selectedCount})</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.batchButton} onPress={removeSelected}>
              <Ionicons name="trash" size={16} color={Colors.functional.error} />
              <Text style={[styles.batchButtonText, { color: Colors.functional.error }]}>
                Remove ({selectedCount})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderVehicleCard = ({ item, index }: { item: FavoriteVehicle; index: number }) => {
    const isGrid = viewMode === 'grid';
    const cardStyle = isGrid ? styles.gridCard : styles.listCard;

    return (
      <TouchableOpacity
        style={[
          cardStyle,
          item.selected && styles.cardSelected,
          !item.available && styles.cardUnavailable,
        ]}
        onPress={() => {
          if (editMode) {
            toggleSelection(item.id);
          } else {
            router.push(`/vehicle-details?id=${item.id}` as any);
          }
        }}
        onLongPress={() => !editMode && showVehicleActions(item)}
      >
        {/* Selection checkbox in edit mode */}
        {editMode && (
          <View style={styles.selectionOverlay}>
            <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
              {item.selected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
            </View>
          </View>
        )}

        {/* Availability badge */}
        {!item.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Not Available</Text>
          </View>
        )}

        {/* Price change badge */}
        {item.priceChanged && (
          <View
            style={[
              styles.priceChangeBadge,
              item.priceChanged === 'increased' ? styles.priceIncreasedBadge : styles.priceDecreasedBadge,
            ]}
          >
            <Ionicons
              name={item.priceChanged === 'increased' ? 'trending-up' : 'trending-down'}
              size={12}
              color="#ffffff"
            />
            <Text style={styles.priceChangeText}>
              Price {item.priceChanged === 'increased' ? 'increased' : 'dropped'}
            </Text>
          </View>
        )}

        {/* Instant booking badge */}
        {item.instantBooking && item.available && (
          <View style={styles.instantBadge}>
            <Ionicons name="flash" size={12} color="#ffffff" />
            <Text style={styles.instantText}>Instant</Text>
          </View>
        )}

        {/* Vehicle image */}
        <View style={isGrid ? styles.gridImageContainer : styles.listImageContainer}>
          <View style={styles.placeholderImage}>
            <Ionicons name="car-sport" size={isGrid ? 40 : 30} color={Colors.primary.teal} />
            <Text style={styles.vehicleNameInImage}>{item.name}</Text>
          </View>
        </View>

        {/* Vehicle details */}
        <View style={isGrid ? styles.gridDetails : styles.listDetails}>
          <View style={styles.vehicleHeader}>
            <Text style={styles.vehicleName} numberOfLines={isGrid ? 2 : 1}>
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons name="heart" size={20} color={Colors.functional.error} />
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleRating}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviews} reviews)
            </Text>
          </View>

          <Text style={styles.vehicleSpecs}>{item.specs}</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {item.features.slice(0, isGrid ? 2 : 3).map((feature, idx) => (
              <View key={idx} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            {item.features.length > (isGrid ? 2 : 3) && (
              <Text style={styles.moreFeatures}>
                +{item.features.length - (isGrid ? 2 : 3)} more
              </Text>
            )}
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={12} color={Colors.text.secondary} />
            <Text style={styles.locationText}>
              {item.distance} km away • {item.location}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.vehicleFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.pricePerDay}/day</Text>
                {item.originalPrice && item.originalPrice !== item.pricePerDay && (
                  <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.bookButton, !item.available && styles.bookButtonDisabled]}
              onPress={() => handleBookVehicle(item)}
              disabled={!item.available}
            >
              <LinearGradient
                colors={
                  item.available
                    ? [Colors.primary.teal, Colors.accent.blue]
                    : ['#E5E7EB', '#E5E7EB']
                }
                style={styles.bookButtonGradient}
              >
                <Text
                  style={[
                    styles.bookButtonText,
                    !item.available && styles.bookButtonTextDisabled,
                  ]}
                >
                  {item.available ? 'Book Now' : 'Unavailable'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={80} color={Colors.text.secondary} />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>Start saving vehicles you like</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)/vehicles' as any)}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.browseButtonGradient}
        >
          <Text style={styles.browseButtonText}>Browse Vehicles</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const sortedFavorites = getSortedFavorites();

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.content}>
          {renderViewOptions()}
          {renderCollections()}
          {renderFilters()}
          {renderEditModeActions()}

          <FlatList
            data={sortedFavorites}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
        </View>
      )}
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonActive: {
    backgroundColor: Colors.primary.teal,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  editButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  viewOptions: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: Colors.background.white,
  },
  sortOptions: {
    marginTop: 8,
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortChipActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  sortTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  collectionsContainer: {
    backgroundColor: Colors.background.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  collectionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  collectionCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 20,
    marginRight: 4,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  collectionCardActive: {
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.background.white,
  },
  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  collectionCount: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  filtersContainer: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  editActions: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectAllButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  batchActions: {
    flexDirection: 'row',
    gap: 16,
  },
  batchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
  },
  batchButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    margin: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  listCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    flexDirection: 'row',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary.teal,
  },
  cardUnavailable: {
    opacity: 0.7,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
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
  priceChangeBadge: {
    position: 'absolute',
    top: 40,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceIncreasedBadge: {
    backgroundColor: Colors.functional.error,
  },
  priceDecreasedBadge: {
    backgroundColor: Colors.functional.success,
  },
  priceChangeText: {
    fontSize: 9,
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
  gridImageContainer: {
    height: 120,
    backgroundColor: '#F9FAFB',
  },
  listImageContainer: {
    width: 120,
    backgroundColor: '#F9FAFB',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  vehicleNameInImage: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  gridDetails: {
    padding: 12,
  },
  listDetails: {
    flex: 1,
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vehicleName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginRight: 8,
  },
  heartButton: {
    padding: 4,
  },
  vehicleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 4,
  },
  featureTag: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 10,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  moreFeatures: {
    fontSize: 10,
    color: Colors.text.secondary,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  bookButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
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
  bookButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Dimensions, 
    Platform,
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

  // If no favorites, show empty state
  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

      <Text style={styles.comingSoonText}>
        🚧 Favorites feature coming soon! 🚧
        {'\n\n'}
        This screen will allow you to save and organize your favorite vehicles for quick access.
      </Text>
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
  comingSoonText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
    lineHeight: 24,
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

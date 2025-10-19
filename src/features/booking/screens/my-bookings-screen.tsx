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
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BookingData {
  id: string;
  bookingId: string;
  vehicleImage: string;
  vehicleName: string;
  status: 'confirmed' | 'pending_approval' | 'payment_pending' | 'ongoing' | 'completed' | 'cancelled';
  pickupDate: string;
  returnDate: string;
  duration: string;
  pickupLocation: string;
  ownerName: string;
  ownerVerified: boolean;
  amount: number;
  refundAmount?: number;
  refundStatus?: 'refunded' | 'pending';
  cancellationReason?: string;
  cancellationDate?: string;
  completionDate?: string;
  isRated?: boolean;
  extraCharges?: number;
  liveStatus?: 'picked_up' | 'ongoing';
  endTimeHours?: number;
}

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
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

  // Sample data - replace with actual API data
  const sampleBookings: BookingData[] = [
    {
      id: '1',
      bookingId: 'MOV-12345',
      vehicleImage: 'https://via.placeholder.com/100x60/2D9B8E/FFFFFF?text=Creta',
      vehicleName: 'Hyundai Creta 2023',
      status: 'confirmed',
      pickupDate: '15 Jan, 10:00 AM',
      returnDate: '17 Jan, 10:00 AM',
      duration: '2 Days',
      pickupLocation: 'MG Road, Bangalore',
      ownerName: 'Amit Motors',
      ownerVerified: true,
      amount: 6844,
    },
    {
      id: '2',
      bookingId: 'MOV-12346',
      vehicleImage: 'https://via.placeholder.com/100x60/2D9B8E/FFFFFF?text=Swift',
      vehicleName: 'Maruti Swift',
      status: 'ongoing',
      pickupDate: '10 Jan, 09:00 AM',
      returnDate: '12 Jan, 09:00 AM',
      duration: '2 Days',
      pickupLocation: 'Koramangala, Bangalore',
      ownerName: 'Quick Rentals',
      ownerVerified: true,
      amount: 4200,
      liveStatus: 'ongoing',
      endTimeHours: 18,
    },
    {
      id: '3',
      bookingId: 'MOV-12347',
      vehicleImage: 'https://via.placeholder.com/100x60/2D9B8E/FFFFFF?text=Venue',
      vehicleName: 'Hyundai Venue',
      status: 'completed',
      pickupDate: '05 Jan, 08:00 AM',
      returnDate: '07 Jan, 08:00 AM',
      duration: '2 Days',
      pickupLocation: 'HSR Layout, Bangalore',
      ownerName: 'City Cars',
      ownerVerified: true,
      amount: 5500,
      completionDate: '07 Jan, 2025',
      isRated: false,
      extraCharges: 200,
    },
    {
      id: '4',
      bookingId: 'MOV-12348',
      vehicleImage: 'https://via.placeholder.com/100x60/2D9B8E/FFFFFF?text=Baleno',
      vehicleName: 'Maruti Baleno',
      status: 'cancelled',
      pickupDate: '02 Jan, 11:00 AM',
      returnDate: '04 Jan, 11:00 AM',
      duration: '2 Days',
      pickupLocation: 'Whitefield, Bangalore',
      ownerName: 'Express Cars',
      ownerVerified: false,
      amount: 4800,
      refundAmount: 4320,
      refundStatus: 'refunded',
      cancellationReason: 'Vehicle unavailable',
      cancellationDate: '01 Jan, 2025',
    },
  ];

  const getFilteredBookings = () => {
    let filtered = sampleBookings;

    // Filter by tab
    switch (activeTab) {
      case 'upcoming':
        filtered = filtered.filter(booking => ['confirmed', 'pending_approval', 'payment_pending'].includes(booking.status));
        break;
      case 'ongoing':
        filtered = filtered.filter(booking => booking.status === 'ongoing');
        break;
      case 'completed':
        filtered = filtered.filter(booking => booking.status === 'completed');
        break;
      case 'cancelled':
        filtered = filtered.filter(booking => booking.status === 'cancelled');
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(booking => 
        booking.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'upcoming':
        return sampleBookings.filter(booking => ['confirmed', 'pending_approval', 'payment_pending'].includes(booking.status)).length;
      case 'ongoing':
        return sampleBookings.filter(booking => booking.status === 'ongoing').length;
      case 'completed':
        return sampleBookings.filter(booking => booking.status === 'completed').length;
      case 'cancelled':
        return sampleBookings.filter(booking => booking.status === 'cancelled').length;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', color: Colors.functional.success, bg: '#D1FAE5' },
      pending_approval: { label: 'Pending Owner Approval', color: Colors.functional.warning, bg: '#FEF3C7' },
      payment_pending: { label: 'Payment Pending', color: Colors.functional.error, bg: '#FEE2E2' },
      ongoing: { label: 'Rental in Progress', color: Colors.primary.teal, bg: '#E0F2FE' },
      completed: { label: 'Completed', color: Colors.text.secondary, bg: '#F3F4F6' },
      cancelled: { label: 'Cancelled', color: Colors.functional.error, bg: '#FEE2E2' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  };

  const getCountdown = (pickupDate: string) => {
    // Simple countdown logic - in real app, calculate from actual dates
    return 'Starts in 2 days';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerSpacer} />
        
        <Text style={styles.headerTitle}>My Bookings</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by vehicle or booking ID"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.secondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'ongoing', label: 'Ongoing' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((tab) => {
          const count = getTabCount(tab.key);
          const isActive = activeTab === tab.key;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderBookingCard = ({ item }: { item: BookingData }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingId}>#{item.bookingId}</Text>
        {getStatusBadge(item.status)}
      </View>
      
      <View style={styles.bookingContent}>
        <Image source={{ uri: item.vehicleImage }} style={styles.vehicleImage} />
        
        <View style={styles.bookingInfo}>
          <Text style={styles.vehicleName}>{item.vehicleName}</Text>
          
          {activeTab === 'upcoming' && (
            <Text style={styles.countdown}>{getCountdown(item.pickupDate)}</Text>
          )}
          
          {activeTab === 'ongoing' && item.liveStatus && (
            <View style={styles.liveStatusContainer}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveStatus}>
                {item.liveStatus === 'picked_up' ? 'Vehicle Picked up' : 'Rental Ongoing'}
              </Text>
              {item.endTimeHours && (
                <Text style={styles.endTime}>• Return in {item.endTimeHours}h</Text>
              )}
            </View>
          )}
          
          <View style={styles.bookingDates}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={14} color={Colors.primary.teal} />
              <Text style={styles.dateText}>Pickup: {item.pickupDate}</Text>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={14} color={Colors.accent.blue} />
              <Text style={styles.dateText}>Return: {item.returnDate}</Text>
            </View>
          </View>
          
          <View style={styles.bookingDetails}>
            <Text style={styles.duration}>{item.duration}</Text>
            <Text style={styles.location}>{item.pickupLocation}</Text>
          </View>
          
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{item.ownerName}</Text>
            {item.ownerVerified && (
              <Ionicons name="checkmark-circle" size={14} color={Colors.functional.success} />
            )}
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>₹{item.amount.toLocaleString()}</Text>
            {item.extraCharges && (
              <Text style={styles.extraCharges}>+₹{item.extraCharges} extra</Text>
            )}
          </View>
        </View>
      </View>
      
      {renderActionButtons(item)}
    </View>
  );

  const renderActionButtons = (booking: BookingData) => {
    const buttons = [];

    // Common buttons
    buttons.push(
      <TouchableOpacity key="details" style={styles.actionButton}>
        <Text style={styles.actionButtonText}>View Details</Text>
      </TouchableOpacity>
    );

    switch (booking.status) {
      case 'pending_approval':
        buttons.push(
          <TouchableOpacity key="upload" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        );
        break;
        
      case 'confirmed':
        buttons.push(
          <TouchableOpacity key="cancel" style={[styles.actionButton, styles.cancelButton]}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel Booking</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="contact" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Contact Owner</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="modify" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Modify Booking</Text>
          </TouchableOpacity>
        );
        break;
        
      case 'ongoing':
        buttons.push(
          <TouchableOpacity key="location" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Track Vehicle</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="issue" style={styles.actionButton} onPress={() => router.push('/report-issue' as any)}>
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="extend" style={styles.actionButton} onPress={() => router.push('/extend-booking' as any)}>
            <Text style={styles.actionButtonText}>Extend Rental</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="support" style={[styles.actionButton, styles.emergencyButton]}>
            <Text style={[styles.actionButtonText, styles.emergencyButtonText]}>Emergency Support</Text>
          </TouchableOpacity>
        );
        break;
        
      case 'completed':
        if (!booking.isRated) {
          buttons.push(
            <TouchableOpacity key="rate" style={[styles.actionButton, styles.primaryButton]}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Rate Experience</Text>
            </TouchableOpacity>
          );
        }
        buttons.push(
          <TouchableOpacity key="book-again" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Book Again</Text>
          </TouchableOpacity>,
          <TouchableOpacity key="invoice" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Invoice</Text>
          </TouchableOpacity>
        );
        break;
        
      case 'cancelled':
        if (booking.refundStatus) {
          buttons.push(
            <TouchableOpacity key="refund" style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Refund Details</Text>
            </TouchableOpacity>
          );
        }
        buttons.push(
          <TouchableOpacity key="book-similar" style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Book Similar</Text>
          </TouchableOpacity>
        );
        break;
    }

    return (
      <View style={styles.actionButtonsContainer}>
        {buttons.slice(0, 3).map((button, index) => (
          <View key={index} style={styles.actionButtonWrapper}>
            {button}
          </View>
        ))}
        {buttons.length > 3 && (
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCancelledDetails = (booking: BookingData) => {
    if (booking.status !== 'cancelled') return null;
    
    return (
      <View style={styles.cancelledDetails}>
        <Text style={styles.cancelledDate}>Cancelled on {booking.cancellationDate}</Text>
        <Text style={styles.cancelledReason}>Reason: {booking.cancellationReason}</Text>
        {booking.refundStatus && (
          <Text style={[
            styles.refundStatus,
            { color: booking.refundStatus === 'refunded' ? Colors.functional.success : Colors.functional.warning }
          ]}>
            {booking.refundStatus === 'refunded' 
              ? `Refunded ₹${booking.refundAmount?.toLocaleString()}` 
              : 'Refund Pending'
            }
          </Text>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="car-outline" size={60} color={Colors.text.light} />
      </View>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptySubtitle}>Ready to rent your first vehicle?</Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/(main)' as any)}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.browseGradient}
        >
          <Text style={styles.browseButtonText}>Browse Vehicles</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.filterCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity>
            <Text style={styles.filterApply}>Apply</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            {['all', 'last_week', 'last_month', 'last_3_months'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.filterOption}
                onPress={() => setSelectedDateRange(option)}
              >
                <Text style={styles.filterOptionText}>
                  {option === 'all' ? 'All Time' : option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedDateRange === option && styles.radioButtonSelected
                ]}>
                  {selectedDateRange === option && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Vehicle Type</Text>
            {['all', 'hatchback', 'sedan', 'suv', 'luxury'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.filterOption}
                onPress={() => setSelectedVehicleType(option)}
              >
                <Text style={styles.filterOptionText}>
                  {option === 'all' ? 'All Types' : option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedVehicleType === option && styles.radioButtonSelected
                ]}>
                  {selectedVehicleType === option && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            {['newest', 'oldest', 'amount_high', 'amount_low'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.filterOption}
                onPress={() => setSortBy(option)}
              >
                <Text style={styles.filterOptionText}>
                  {option === 'newest' ? 'Newest First' :
                   option === 'oldest' ? 'Oldest First' :
                   option === 'amount_high' ? 'Amount (High to Low)' :
                   'Amount (Low to High)'}
                </Text>
                <View style={[
                  styles.radioButton,
                  sortBy === option && styles.radioButtonSelected
                ]}>
                  {sortBy === option && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const filteredBookings = getFilteredBookings();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderTabs()}
      
      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      ) : (
        renderEmptyState()
      )}
      
      {renderFilterModal()}
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text.primary,
  },
  tabsContainer: {
    backgroundColor: Colors.background.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary.teal,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.white,
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeTabBadge: {
    backgroundColor: Colors.text.white,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  activeTabBadgeText: {
    color: Colors.primary.teal,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100, // Extra space for tab bar
    gap: 16,
  },
  bookingCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bookingContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  bookingInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  countdown: {
    fontSize: 12,
    color: Colors.functional.warning,
    fontWeight: '500',
  },
  liveStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.functional.success,
  },
  liveStatus: {
    fontSize: 12,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  endTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  bookingDates: {
    gap: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  location: {
    fontSize: 12,
    color: Colors.text.secondary,
    flex: 1,
    textAlign: 'right',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerName: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  extraCharges: {
    fontSize: 10,
    color: Colors.functional.warning,
  },
  cancelledDetails: {
    backgroundColor: '#FEF3F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 4,
  },
  cancelledDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cancelledReason: {
    fontSize: 12,
    color: Colors.text.primary,
  },
  refundStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButtonWrapper: {
    flex: 1,
    minWidth: '30%',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.background.lightGrey,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  primaryButton: {
    backgroundColor: Colors.primary.teal,
  },
  primaryButtonText: {
    color: Colors.text.white,
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
  },
  cancelButtonText: {
    color: Colors.functional.error,
  },
  emergencyButton: {
    backgroundColor: '#FFF7ED',
  },
  emergencyButtonText: {
    color: Colors.functional.warning,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
  browseButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  browseGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  filterModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
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
  filterCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  filterApply: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary.teal,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary.teal,
  },
});

import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface BookingData {
  vehicle: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
    location: string;
  };
  pickup: {
    date: Date | null;
    time: string;
    location: string;
    delivery: boolean;
    deliveryAddress?: string;
  };
  return: {
    date: Date | null;
    time: string;
    location: string;
  };
  addons: any;
  pricing: {
    baseRental: number;
    addonsTotal: number;
    platformFee: number;
    gst: number;
    total: number;
    securityDeposit: number;
  };
  coupon: any;
  payment: any;
}

interface Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
}

export default function DateTimeSelection({ bookingData, updateBookingData, onNext }: Props) {
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [sameLocation, setSameLocation] = useState(true);
  const [estimatedKm, setEstimatedKm] = useState('600');

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push({ time12, display: time12 });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate calendar dates
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isAvailable = Math.random() > 0.3; // Random availability for demo
      dates.push({
        date,
        available: isAvailable,
        day: date.getDate(),
        month: date.toLocaleDateString('en', { month: 'short' }),
        weekday: date.toLocaleDateString('en', { weekday: 'short' }),
      });
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const calculateDuration = () => {
    if (bookingData.pickup.date && bookingData.return.date) {
      const diffTime = bookingData.return.date.getTime() - bookingData.pickup.date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculatePrice = () => {
    const days = calculateDuration();
    const baseRent = days * bookingData.vehicle.pricePerDay;
    const gst = Math.round(baseRent * 0.18);
    const total = baseRent + gst;
    return { baseRent, gst, total };
  };

  const isValidBooking = () => {
    return bookingData.pickup.date && 
           bookingData.return.date && 
           bookingData.pickup.time && 
           bookingData.return.time;
  };

  const handleContinue = () => {
    if (isValidBooking()) {
      const pricing = calculatePrice();
      updateBookingData({
        pricing: {
          ...bookingData.pricing,
          baseRental: pricing.baseRent,
          gst: pricing.gst,
          total: pricing.total,
        }
      });
      onNext();
    }
  };

  const renderVehicleSummary = () => (
    <View style={styles.vehicleSummaryCard}>
      <View style={styles.vehicleImageContainer}>
        <Ionicons name="car-sport" size={40} color={Colors.primary.teal} />
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{bookingData.vehicle.name}</Text>
        <Text style={styles.vehiclePrice}>₹{bookingData.vehicle.pricePerDay}/day</Text>
        <View style={styles.vehicleLocation}>
          <Ionicons name="location" size={14} color={Colors.text.secondary} />
          <Text style={styles.vehicleLocationText}>{bookingData.vehicle.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderDatePicker = (type: 'pickup' | 'return') => {
    const isVisible = type === 'pickup' ? showPickupCalendar : showReturnCalendar;
    const setVisible = type === 'pickup' ? setShowPickupCalendar : setShowReturnCalendar;
    const selectedDate = type === 'pickup' ? bookingData.pickup.date : bookingData.return.date;

    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Select {type === 'pickup' ? 'Pickup' : 'Return'} Date
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.calendarContainer}>
            <View style={styles.calendarGrid}>
              {calendarDates.map((dateObj, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCell,
                    !dateObj.available && styles.dateCellDisabled,
                    selectedDate?.toDateString() === dateObj.date.toDateString() && styles.dateCellSelected,
                  ]}
                  onPress={() => {
                    if (dateObj.available) {
                      const updates = type === 'pickup' 
                        ? { pickup: { ...bookingData.pickup, date: dateObj.date } }
                        : { return: { ...bookingData.return, date: dateObj.date } };
                      updateBookingData(updates);
                    }
                  }}
                  disabled={!dateObj.available}
                >
                  <Text style={[
                    styles.dateWeekday,
                    !dateObj.available && styles.dateTextDisabled,
                    selectedDate?.toDateString() === dateObj.date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {dateObj.weekday}
                  </Text>
                  <Text style={[
                    styles.dateDay,
                    !dateObj.available && styles.dateTextDisabled,
                    selectedDate?.toDateString() === dateObj.date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {dateObj.day}
                  </Text>
                  <Text style={[
                    styles.dateMonth,
                    !dateObj.available && styles.dateTextDisabled,
                    selectedDate?.toDateString() === dateObj.date.toDateString() && styles.dateTextSelected,
                  ]}>
                    {dateObj.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderTimePicker = (type: 'pickup' | 'return') => {
    const isVisible = type === 'pickup' ? showPickupTime : showReturnTime;
    const setVisible = type === 'pickup' ? setShowPickupTime : setShowReturnTime;
    const selectedTime = type === 'pickup' ? bookingData.pickup.time : bookingData.return.time;

    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Select {type === 'pickup' ? 'Pickup' : 'Return'} Time
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.timeContainer}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.time12 && styles.timeSlotSelected,
                ]}
                onPress={() => {
                  const updates = type === 'pickup'
                    ? { pickup: { ...bookingData.pickup, time: slot.time12 } }
                    : { return: { ...bookingData.return, time: slot.time12 } };
                  updateBookingData(updates);
                }}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === slot.time12 && styles.timeSlotTextSelected,
                ]}>
                  {slot.display}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderPickupDetails = () => (
    <View style={styles.sectionCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={() => setShowPickupCalendar(true)}
        >
          <Text style={styles.inputButtonText}>
            {bookingData.pickup.date ? 
              bookingData.pickup.date.toLocaleDateString('en', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              }) : 
              'Select Date'
            }
          </Text>
          <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Time</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={() => setShowPickupTime(true)}
        >
          <Text style={styles.inputButtonText}>
            {bookingData.pickup.time || 'Select Time'}
          </Text>
          <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color={Colors.primary.teal} />
            <Text style={styles.locationText}>{bookingData.pickup.location}</Text>
          </View>
          <TouchableOpacity style={styles.changeLocationButton}>
            <Text style={styles.changeLocationText}>Change pickup location</Text>
          </TouchableOpacity>
        </View>
        
        {/* Map Preview Placeholder */}
        <View style={styles.mapPreview}>
          <Ionicons name="map" size={24} color={Colors.text.secondary} />
          <Text style={styles.mapPreviewText}>Map Preview</Text>
        </View>
      </View>
    </View>
  );

  const renderReturnDetails = () => (
    <View style={styles.sectionCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={() => setShowReturnCalendar(true)}
        >
          <Text style={styles.inputButtonText}>
            {bookingData.return.date ? 
              bookingData.return.date.toLocaleDateString('en', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              }) : 
              'Select Date'
            }
          </Text>
          <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Time</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={() => setShowReturnTime(true)}
        >
          <Text style={styles.inputButtonText}>
            {bookingData.return.time || 'Select Time'}
          </Text>
          <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={styles.toggleRow}
          onPress={() => {
            setSameLocation(!sameLocation);
            if (!sameLocation) {
              updateBookingData({
                return: { ...bookingData.return, location: bookingData.pickup.location }
              });
            }
          }}
        >
          <View style={styles.toggle}>
            <View style={[styles.toggleButton, sameLocation && styles.toggleButtonActive]}>
              {sameLocation && <Ionicons name="checkmark" size={14} color="#ffffff" />}
            </View>
            <Text style={styles.toggleText}>Return to same location</Text>
          </View>
        </TouchableOpacity>
        
        {!sameLocation && (
          <Text style={styles.differentLocationNote}>Different return location option</Text>
        )}
      </View>
    </View>
  );

  const renderTripSummary = () => {
    const duration = calculateDuration();
    
    return (
      <View style={styles.sectionCard}>
        {duration > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>
              {duration} {duration === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Estimated KM (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={estimatedKm}
            onChangeText={setEstimatedKm}
            placeholder="Default: 300 km/day"
            keyboardType="numeric"
          />
          <Text style={styles.inputHint}>Helps estimate extra charges</Text>
        </View>
      </View>
    );
  };

  const renderPriceEstimate = () => {
    const pricing = calculatePrice();
    
    return (
      <View style={styles.priceCard}>
        <Text style={styles.priceTitle}>Price Estimate</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Base rent:</Text>
          <Text style={styles.priceValue}>₹{pricing.baseRent.toLocaleString()}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Estimated total:</Text>
          <Text style={styles.priceTotalValue}>₹{pricing.total.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity style={styles.viewBreakdownButton}>
          <Text style={styles.viewBreakdownText}>View price breakdown</Text>
        </TouchableOpacity>
        
        <Text style={styles.priceNote}>Final price shown at checkout</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {renderVehicleSummary()}
        {renderPickupDetails()}
        {renderReturnDetails()}
        {renderTripSummary()}
        {renderPriceEstimate()}
      </ScrollView>
      
      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.continueButton, !isValidBooking() && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!isValidBooking()}
        >
          <LinearGradient
            colors={isValidBooking() ? 
              [Colors.primary.teal, Colors.accent.blue] : 
              ['#E5E7EB', '#E5E7EB']
            }
            style={styles.continueGradient}
          >
            <Text style={[
              styles.continueButtonText,
              !isValidBooking() && styles.continueButtonTextDisabled
            ]}>
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {renderDatePicker('pickup')}
      {renderDatePicker('return')}
      {renderTimePicker('pickup')}
      {renderTimePicker('return')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  vehicleSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  vehicleImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  vehicleLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleLocationText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  inputButtonText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  locationContainer: {
    gap: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  changeLocationButton: {
    alignSelf: 'flex-start',
  },
  changeLocationText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  mapPreview: {
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  mapPreviewText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  toggleContainer: {
    marginTop: 8,
  },
  toggleRow: {
    paddingVertical: 8,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary.teal,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  differentLocationNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: Colors.text.primary,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  priceCard: {
    backgroundColor: '#E0F2FE',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  priceTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  viewBreakdownButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  viewBreakdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  priceNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateCell: {
    width: (width - 56) / 7,
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateCellDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.5,
  },
  dateCellSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  dateWeekday: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  dateMonth: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  dateTextDisabled: {
    color: '#9CA3AF',
  },
  dateTextSelected: {
    color: '#ffffff',
  },
  timeContainer: {
    flex: 1,
    padding: 20,
  },
  timeSlot: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  timeSlotText: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Modal,
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

interface BookingDetailsData {
  bookingId: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  timeline: Array<{
    step: string;
    date: string;
    completed: boolean;
  }>;
  vehicle: {
    image: string;
    name: string;
    registration: string;
    features: string[];
    rating: number;
  };
  owner: {
    name: string;
    photo: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    verified: boolean;
    phone: string;
  };
  pickup: {
    date: string;
    time: string;
    location: string;
    address: string;
    delivery: boolean;
    contactPhone: string;
  };
  return: {
    date: string;
    time: string;
    location: string;
    instructions: string;
  };
  duration: string;
  estimatedKm: number;
  pricing: {
    baseRental: number;
    deliveryCharges: number;
    enhancedCoverage: number;
    childSeat: number;
    subtotal: number;
    platformFee: number;
    gst: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    securityDeposit: number;
    coupon?: {
      code: string;
      discount: number;
    };
  };
  documents: {
    userDocs: Array<{
      type: string;
      status: 'uploaded' | 'pending' | 'rejected';
      expiryDate?: string;
    }>;
    vehicleDocs: Array<{
      type: string;
      validTill?: string;
    }>;
  };
}

export default function BookingDetailsScreen() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showRatePrompt, setShowRatePrompt] = useState(false);

  // Sample data - replace with actual API data
  const bookingData: BookingDetailsData = {
    bookingId: 'MOV-12345',
    status: 'upcoming',
    timeline: [
      { step: 'Booking created', date: '10 Jan, 3:00 PM', completed: true },
      { step: 'Payment successful', date: '10 Jan, 3:05 PM', completed: true },
      { step: 'Owner confirmed', date: '10 Jan, 4:00 PM', completed: true },
      { step: 'Documents uploaded', date: '12 Jan, 10:00 AM', completed: true },
      { step: 'Trip starts', date: '15 Jan, 10:00 AM', completed: false },
      { step: 'Trip ends', date: '17 Jan, 10:00 AM', completed: false },
    ],
    vehicle: {
      image: 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Creta',
      name: 'Hyundai Creta 2023',
      registration: 'KA-01-AB-1234',
      features: ['Automatic', 'Diesel', '5 Seater'],
      rating: 4.7,
    },
    owner: {
      name: 'Amit Motors',
      photo: 'https://via.placeholder.com/50x50/2D9B8E/FFFFFF?text=AM',
      rating: 4.8,
      reviewCount: 123,
      responseTime: 'Usually within 15 mins',
      verified: true,
      phone: '+91 98765 43210',
    },
    pickup: {
      date: '15 Jan 2025',
      time: '10:00 AM',
      location: 'MG Road, Bangalore',
      address: 'MG Road Metro Station, Brigade Road, Bengaluru, Karnataka 560001',
      delivery: true,
      contactPhone: '+91 98765 43210',
    },
    return: {
      date: '17 Jan 2025',
      time: '10:00 AM',
      location: 'Same as pickup',
      instructions: 'Please refuel before return',
    },
    duration: '2 Days',
    estimatedKm: 600,
    pricing: {
      baseRental: 5000,
      deliveryCharges: 200,
      enhancedCoverage: 300,
      childSeat: 100,
      subtotal: 5600,
      platformFee: 200,
      gst: 1044,
      total: 6844,
      paymentMethod: 'UPI (GPay)',
      paymentStatus: 'Paid',
      securityDeposit: 5000,
      coupon: {
        code: 'FIRST20',
        discount: 1000,
      },
    },
    documents: {
      userDocs: [
        { type: 'Driving License', status: 'uploaded', expiryDate: '15 Dec 2027' },
        { type: 'ID Proof (Aadhaar)', status: 'uploaded' },
      ],
      vehicleDocs: [
        { type: 'Registration Certificate', validTill: '15 May 2025' },
        { type: 'Insurance', validTill: '10 Mar 2025' },
        { type: 'Pollution Certificate', validTill: '20 Aug 2025' },
      ],
    },
  };

  // Show rate prompt for completed bookings that haven't been rated yet
  React.useEffect(() => {
    if (bookingData.status === 'completed') {
      // In a real app, you'd check if the user has already rated this booking
      const hasAlreadyRated = false; // This should come from your API
      if (!hasAlreadyRated) {
        const timer = setTimeout(() => {
          setShowRatePrompt(true);
        }, 1000); // Show prompt after 1 second
        
        return () => clearTimeout(timer);
      }
    }
  }, [bookingData.status]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Upcoming', color: Colors.primary.teal, bg: '#E0F2FE' },
      ongoing: { label: 'Ongoing', color: Colors.functional.success, bg: '#D1FAE5' },
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

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url);
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.bookingId}>#{bookingData.bookingId}</Text>
          {getStatusBadge(bookingData.status)}
        </View>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTimeline = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Status Timeline</Text>
      <View style={styles.timeline}>
        {bookingData.timeline.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[
                styles.timelineCircle,
                item.completed && styles.timelineCircleCompleted
              ]}>
                {item.completed && (
                  <Ionicons name="checkmark" size={12} color="#ffffff" />
                )}
              </View>
              {index < bookingData.timeline.length - 1 && (
                <View style={[
                  styles.timelineLine,
                  item.completed && styles.timelineLineCompleted
                ]} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[
                styles.timelineStep,
                item.completed && styles.timelineStepCompleted
              ]}>
                {item.step}
              </Text>
              <Text style={styles.timelineDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderVehicleDetails = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Vehicle Details</Text>
      <Image source={{ uri: bookingData.vehicle.image }} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{bookingData.vehicle.name}</Text>
        <Text style={styles.vehicleRegistration}>{bookingData.vehicle.registration}</Text>
        <View style={styles.vehicleFeatures}>
          {bookingData.vehicle.features.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <View style={styles.vehicleRating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{bookingData.vehicle.rating}</Text>
        </View>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Vehicle Details</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary.teal} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTripInfo = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Trip Information</Text>
      
      <View style={styles.tripSection}>
        <Text style={styles.tripSectionTitle}>Pickup</Text>
        <Text style={styles.tripDateTime}>{bookingData.pickup.date}, {bookingData.pickup.time}</Text>
        <Text style={styles.tripLocation}>{bookingData.pickup.location}</Text>
        <Text style={styles.tripAddress}>{bookingData.pickup.address}</Text>
        
        <View style={styles.tripActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openMaps(bookingData.pickup.address)}
          >
            <Ionicons name="navigate" size={16} color={Colors.primary.teal} />
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.deliveryInfo}>
          <Ionicons name="home" size={16} color={Colors.functional.success} />
          <Text style={styles.deliveryText}>Home delivery selected</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Contact for pickup:</Text>
          <TouchableOpacity onPress={() => callPhone(bookingData.pickup.contactPhone)}>
            <Text style={styles.contactPhone}>{bookingData.pickup.contactPhone}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.tripSection}>
        <Text style={styles.tripSectionTitle}>Return</Text>
        <Text style={styles.tripDateTime}>{bookingData.return.date}, {bookingData.return.time}</Text>
        <Text style={styles.tripLocation}>{bookingData.return.location}</Text>
        <Text style={styles.instructions}>{bookingData.return.instructions}</Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.tripStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{bookingData.duration}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Estimated KM</Text>
          <Text style={styles.statValue}>{bookingData.estimatedKm} km</Text>
        </View>
      </View>
    </View>
  );

  const renderPricingDetails = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Pricing Details</Text>
      
      <View style={styles.pricingSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Base rental:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.baseRental.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery charges:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.deliveryCharges.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Enhanced coverage:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.enhancedCoverage.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Child seat:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.childSeat.toLocaleString()}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Platform fee:</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.platformFee.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>GST (18%):</Text>
          <Text style={styles.priceValue}>₹{bookingData.pricing.gst.toLocaleString()}</Text>
        </View>
        
        {bookingData.pricing.coupon && (
          <View style={styles.discountSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, styles.discountLabel]}>
                Coupon ({bookingData.pricing.coupon.code}):
              </Text>
              <Text style={[styles.priceValue, styles.discountValue]}>
                -₹{bookingData.pricing.coupon.discount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.separator} />
        
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total paid:</Text>
          <Text style={styles.totalValue}>₹{bookingData.pricing.total.toLocaleString()}</Text>
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentMethod}>Payment method: {bookingData.pricing.paymentMethod}</Text>
          <View style={styles.paymentStatus}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
            <Text style={styles.paymentStatusText}>{bookingData.pricing.paymentStatus}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.securityDeposit}>
        <Text style={styles.securityTitle}>Security Deposit</Text>
        <View style={styles.securityInfo}>
          <Text style={styles.securityAmount}>₹{bookingData.pricing.securityDeposit.toLocaleString()}</Text>
          <Text style={styles.securityStatus}>On hold</Text>
        </View>
        <Text style={styles.securityNote}>Refunded after trip inspection</Text>
        <Text style={styles.securityRefund}>Expected refund: 7 days after return</Text>
      </View>
    </View>
  );

  const renderOwnerInfo = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Owner Information</Text>
      
      <View style={styles.ownerDetails}>
        <Image source={{ uri: bookingData.owner.photo }} style={styles.ownerPhoto} />
        <View style={styles.ownerInfo}>
          <View style={styles.ownerHeader}>
            <Text style={styles.ownerName}>{bookingData.owner.name}</Text>
            {bookingData.owner.verified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
            )}
          </View>
          <View style={styles.ownerRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ownerRatingText}>
              {bookingData.owner.rating} ({bookingData.owner.reviewCount} reviews)
            </Text>
          </View>
          <Text style={styles.responseTime}>{bookingData.owner.responseTime}</Text>
        </View>
      </View>
      
      <View style={styles.ownerActions}>
        <TouchableOpacity 
          style={styles.ownerActionButton}
          onPress={() => callPhone(bookingData.owner.phone)}
        >
          <Ionicons name="call" size={16} color={Colors.primary.teal} />
          <Text style={styles.ownerActionText}>Call Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.ownerActionButton}>
          <Ionicons name="chatbubble" size={16} color={Colors.primary.teal} />
          <Text style={styles.ownerActionText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.ownerActionButton}>
          <Ionicons name="person" size={16} color={Colors.primary.teal} />
          <Text style={styles.ownerActionText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Documents</Text>
      
      <View style={styles.documentsSection}>
        <Text style={styles.documentsSectionTitle}>Your Documents</Text>
        {bookingData.documents.userDocs.map((doc, index) => (
          <View key={index} style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentType}>{doc.type}</Text>
              {doc.expiryDate && (
                <Text style={styles.documentExpiry}>Expires: {doc.expiryDate}</Text>
              )}
            </View>
            <View style={styles.documentStatus}>
              {doc.status === 'uploaded' ? (
                <>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                  <Text style={styles.documentStatusText}>Uploaded</Text>
                </>
              ) : doc.status === 'pending' ? (
                <>
                  <Ionicons name="time" size={16} color={Colors.functional.warning} />
                  <Text style={styles.documentStatusText}>Pending</Text>
                </>
              ) : (
                <>
                  <Ionicons name="close-circle" size={16} color={Colors.functional.error} />
                  <Text style={styles.documentStatusText}>Rejected</Text>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.documentsSection}>
        <Text style={styles.documentsSectionTitle}>Vehicle Documents</Text>
        {bookingData.documents.vehicleDocs.map((doc, index) => (
          <View key={index} style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentType}>{doc.type}</Text>
              {doc.validTill && (
                <Text style={styles.documentExpiry}>Valid till: {doc.validTill}</Text>
              )}
            </View>
            <TouchableOpacity>
              <Text style={styles.viewDocumentText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.functional.success} />
          <Text style={styles.verifiedText}>All documents verified by MOVA</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.agreementButton}>
        <Ionicons name="document-text" size={16} color={Colors.primary.teal} />
        <Text style={styles.agreementText}>View Rental Agreement</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.primary.teal} />
      </TouchableOpacity>
    </View>
  );

  const renderImportantInfo = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Important Information</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Rental Terms</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>KM limit:</Text>
          <Text style={styles.infoValue}>300 km/day</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Extra KM charge:</Text>
          <Text style={styles.infoValue}>₹10/km</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Fuel policy:</Text>
          <Text style={styles.infoValue}>Full to Full</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Late return:</Text>
          <Text style={styles.infoValue}>₹200/hour</Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>What's Included</Text>
        <View style={styles.includedList}>
          {['Basic insurance coverage', '24/7 roadside assistance', 'Breakdown support', 'Customer support'].map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Ionicons name="checkmark" size={14} color={Colors.functional.success} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>What's NOT Included</Text>
        <View style={styles.includedList}>
          {['Fuel costs', 'Toll charges', 'Parking fees', 'Traffic fines'].map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Ionicons name="close" size={14} color={Colors.functional.error} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderFAQs = () => {
    const faqs = [
      { question: 'What if I\'m running late?', answer: 'Please contact the owner immediately. Late charges may apply after grace period.' },
      { question: 'Can I extend my booking?', answer: 'Yes, subject to vehicle availability. Additional charges will apply.' },
      { question: 'What if car breaks down?', answer: 'Contact our 24/7 roadside assistance immediately. We\'ll arrange help or replacement.' },
      { question: 'How to handle accident?', answer: 'Ensure safety first, call police if needed, then contact us immediately for guidance.' },
    ];

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Need Help?</Text>
        
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFAQ === faq.question ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
              {expandedFAQ === faq.question && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.supportButton}>
          <LinearGradient
            colors={[Colors.primary.teal, Colors.accent.blue]}
            style={styles.supportGradient}
          >
            <Ionicons name="headset" size={16} color="#ffffff" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomActions = () => {
    const getActionButtons = () => {
      switch (bookingData.status) {
        case 'upcoming':
          return [
            { icon: 'document-text', text: 'Upload Documents', color: Colors.primary.teal },
            { icon: 'camera', text: 'Pre-trip Inspection', color: Colors.primary.teal },
            { icon: 'call', text: 'Contact Owner', color: Colors.primary.teal },
            { icon: 'navigate', text: 'Get Directions', color: Colors.primary.teal },
            { icon: 'create', text: 'Modify Booking', color: Colors.text.secondary },
            { icon: 'close-circle', text: 'Cancel Booking', color: Colors.functional.error },
          ];
        case 'ongoing':
          return [
            { icon: 'warning', text: 'Report Issue', color: Colors.functional.warning },
            { icon: 'time', text: 'Extend Booking', color: Colors.primary.teal },
            { icon: 'car', text: 'Roadside Assistance', color: Colors.functional.error },
            { icon: 'call', text: 'Contact Owner', color: Colors.primary.teal },
          ];
        case 'completed':
          return [
            { icon: 'star', text: 'Rate & Review', color: Colors.primary.teal },
            { icon: 'camera', text: 'View Inspections', color: Colors.text.secondary },
            { icon: 'receipt', text: 'View Invoice', color: Colors.text.secondary },
            { icon: 'cash', text: 'Deposit Status', color: Colors.text.secondary },
            { icon: 'refresh', text: 'Book Again', color: Colors.primary.teal },
          ];
        default:
          return [];
      }
    };

    const buttons = getActionButtons();
    
    return (
      <View style={styles.bottomActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.actionButtonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.bottomActionButton}
                onPress={() => {
                  if (button.text === 'Cancel Booking') {
                    setShowCancelModal(true);
                  } else if (button.text === 'Pre-trip Inspection') {
                    router.push('/(features)/vehicles/vehicle-inspection' as any);
                  } else if (button.text === 'View Inspections') {
                    router.push('/(features)/vehicles/vehicle-inspection' as any);
                  } else if (button.text === 'Extend Booking') {
                    router.push('/extend-booking' as any);
                  } else if (button.text === 'Report Issue') {
                    router.push('/report-issue' as any);
                  } else if (button.text === 'Rate & Review') {
                    router.push({
                      pathname: '/rate-review' as any,
                      params: {
                        bookingId: bookingData.bookingId,
                        vehicleName: bookingData.vehicle.name,
                        ownerName: bookingData.owner.name,
                        vehicleImage: bookingData.vehicle.image,
                      }
                    });
                  }
                }}
              >
                <Ionicons name={button.icon as any} size={16} color={button.color} />
                <Text style={[styles.bottomActionText, { color: button.color }]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderMenuModal = () => (
    <Modal
      visible={showMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMenu(false)}
    >
      <TouchableOpacity 
        style={styles.menuOverlay}
        onPress={() => setShowMenu(false)}
      >
        <View style={styles.menuModal}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="download" size={20} color={Colors.text.primary} />
            <Text style={styles.menuItemText}>Download Invoice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="share" size={20} color={Colors.text.primary} />
            <Text style={styles.menuItemText}>Share Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="warning" size={20} color={Colors.functional.warning} />
            <Text style={styles.menuItemText}>Report Issue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              setShowCancelModal(true);
            }}
          >
            <Ionicons name="close-circle" size={20} color={Colors.functional.error} />
            <Text style={[styles.menuItemText, { color: Colors.functional.error }]}>
              Cancel Booking
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderCancelModal = () => (
    <Modal
      visible={showCancelModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCancelModal(false)}
    >
      <SafeAreaView style={styles.cancelModal}>
        <View style={styles.cancelHeader}>
          <TouchableOpacity onPress={() => setShowCancelModal(false)}>
            <Text style={styles.cancelCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.cancelTitle}>Cancel Booking</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <ScrollView style={styles.cancelContent}>
          <Text style={styles.cancelWarning}>
            Are you sure you want to cancel this booking?
          </Text>
          
          <View style={styles.refundInfo}>
            <Text style={styles.refundTitle}>Refund Amount</Text>
            <Text style={styles.refundAmount}>₹5,500</Text>
            <Text style={styles.refundNote}>
              Cancellation fee of ₹344 will be deducted as per policy
            </Text>
          </View>
          
          <View style={styles.reasonSection}>
            <Text style={styles.reasonTitle}>Reason for cancellation</Text>
            {[
              'Plans changed',
              'Found better option',
              'Vehicle not suitable',
              'Personal emergency',
              'Other'
            ].map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonOption}
                onPress={() => setCancelReason(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
                <View style={[
                  styles.radioButton,
                  cancelReason === reason && styles.radioButtonSelected
                ]}>
                  {cancelReason === reason && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
            
            {cancelReason === 'Other' && (
              <TextInput
                style={styles.customReasonInput}
                placeholder="Please specify..."
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                placeholderTextColor={Colors.text.secondary}
              />
            )}
          </View>
        </ScrollView>
        
        <View style={styles.cancelActions}>
          <TouchableOpacity 
            style={styles.keepBookingButton}
            onPress={() => setShowCancelModal(false)}
          >
            <Text style={styles.keepBookingText}>Keep Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.confirmCancelButton}>
            <Text style={styles.confirmCancelText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTimeline()}
        {renderVehicleDetails()}
        {renderTripInfo()}
        {renderPricingDetails()}
        {renderOwnerInfo()}
        {renderDocuments()}
        {renderImportantInfo()}
        {renderFAQs()}
      </ScrollView>
      
      {renderBottomActions()}
      {renderMenuModal()}
      {renderCancelModal()}
      
      {/* <RatePromptCard
        visible={showRatePrompt}
        bookingId={bookingData.bookingId}
        vehicleName={bookingData.vehicle.name}
        ownerName={bookingData.owner.name}
        vehicleImage={bookingData.vehicle.image}
        onDismiss={() => setShowRatePrompt(false)}
        onRate={() => setShowRatePrompt(false)}
      /> */}
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.background.white,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: Colors.functional.success,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.functional.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineStep: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  timelineStepCompleted: {
    color: Colors.text.primary,
  },
  timelineDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  vehicleInfo: {
    gap: 8,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  vehicleRegistration: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehicleFeatures: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: Colors.background.lightGrey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: Colors.text.primary,
  },
  vehicleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  tripSection: {
    gap: 8,
  },
  tripSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  tripDateTime: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tripLocation: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  tripAddress: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  tripActions: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: Colors.functional.success,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 12,
    color: Colors.functional.warning,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  pricingSection: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  discountSection: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  discountLabel: {
    color: Colors.functional.success,
  },
  discountValue: {
    color: Colors.functional.success,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  paymentInfo: {
    marginTop: 12,
    gap: 4,
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  securityDeposit: {
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 4,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  securityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  securityStatus: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  securityNote: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  securityRefund: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  ownerDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  ownerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerInfo: {
    flex: 1,
    gap: 4,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerRatingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  responseTime: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  ownerActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
  },
  ownerActionText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  documentsSection: {
    marginBottom: 20,
  },
  documentsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  documentExpiry: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  documentStatusText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  viewDocumentText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  agreementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    marginTop: 16,
  },
  agreementText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  includedList: {
    gap: 8,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  includedText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  faqSection: {
    marginBottom: 20,
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  faqQuestionText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 12,
    color: Colors.text.secondary,
    paddingBottom: 12,
    lineHeight: 16,
  },
  supportButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  supportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomActionButton: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    minWidth: 80,
  },
  bottomActionText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  cancelModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  cancelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  cancelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  cancelContent: {
    flex: 1,
    padding: 20,
  },
  cancelWarning: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  refundInfo: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  refundTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  refundAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    marginBottom: 8,
  },
  refundNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  reasonSection: {
    marginBottom: 24,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonText: {
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
  customReasonInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text.primary,
  },
  cancelActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  keepBookingButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  keepBookingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.functional.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

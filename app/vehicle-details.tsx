import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface VehicleDetails {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  category: string;
  instantBooking: boolean;
  verifiedOwner: boolean;
  subtitle: string;
  pricing: {
    daily: number;
    weekly?: number;
    monthly?: number;
    extraKmCharge: number;
    freeKmPerDay: number;
  };
  specifications: {
    registration: string;
    color: string;
    mileage: string;
    transmission: string;
    fuelType: string;
    insuranceValidTill: string;
    pollutionCertificate: boolean;
  };
  features: string[];
  description: string;
  location: {
    address: string;
    distance: number;
    deliveryAvailable: boolean;
    deliveryCharge: number;
    deliveryRadius: number;
  };
  pickupInstructions: string;
  owner: {
    name: string;
    memberSince: string;
    totalVehicles: number;
    responseTime: string;
    rating: number;
    reviewsCount: number;
    verified: {
      documents: boolean;
      phone: boolean;
    };
  };
  reviews: Review[];
  cancellationPolicy: string;
  included: string[];
  notIncluded: string[];
}

interface Review {
  id: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  photos?: string[];
  ownerReply?: string;
}

export default function VehicleDetailsScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    features: false,
    description: false,
    pricing: false,
    cancellation: false,
    faqs: false,
  });
  const [selectedDates, setSelectedDates] = useState({
    pickup: null as Date | null,
    return: null as Date | null,
  });
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample vehicle data
  const vehicle: VehicleDetails = {
    id: '1',
    name: 'Hyundai Creta 2023',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2023,
    images: ['', '', '', '', '', '', '', ''], // 8 placeholder images
    rating: 4.9,
    reviewsCount: 45,
    category: 'SUV',
    instantBooking: true,
    verifiedOwner: true,
    subtitle: 'Diesel, Automatic, 5 Seater',
    pricing: {
      daily: 2500,
      weekly: 12000,
      monthly: 35000,
      extraKmCharge: 10,
      freeKmPerDay: 300,
    },
    specifications: {
      registration: 'KA-01-AB-1234',
      color: 'White',
      mileage: '17 km/l',
      transmission: 'Automatic',
      fuelType: 'Diesel',
      insuranceValidTill: 'Apr 2025',
      pollutionCertificate: true,
    },
    features: [
      'Air Conditioning', 'GPS Navigation', 'Bluetooth', '5 Seats',
      'Automatic', 'Diesel', 'Parking Sensors', 'Music System',
      'USB Charging', 'Sunroof', 'Keyless Entry', 'Electric Windows'
    ],
    description: 'Well-maintained Creta with full service history. Perfect for city drives and highway trips. Recently serviced with new tyres. Non-smoking vehicle.',
    location: {
      address: 'MG Road, Bangalore',
      distance: 2.5,
      deliveryAvailable: true,
      deliveryCharge: 200,
      deliveryRadius: 10,
    },
    pickupInstructions: 'Please call 15 minutes before pickup. Vehicle will be cleaned and sanitized.',
    owner: {
      name: 'Amit Motors',
      memberSince: 'Jan 2023',
      totalVehicles: 12,
      responseTime: 'Usually within 15 mins',
      rating: 4.8,
      reviewsCount: 123,
      verified: {
        documents: true,
        phone: true,
      },
    },
    reviews: [
      {
        id: '1',
        userName: 'Rajesh Kumar',
        rating: 5,
        date: '2 days ago',
        text: 'Excellent car! Very clean and well-maintained. Amit was very responsive and helpful.',
        helpful: 8,
      },
      {
        id: '2',
        userName: 'Priya Sharma',
        rating: 5,
        date: '1 week ago',
        text: 'Great experience! The car was exactly as described. Smooth pickup and return process.',
        helpful: 12,
      },
    ],
    cancellationPolicy: 'Flexible',
    included: [
      'Basic insurance',
      '24/7 roadside assistance',
      '300 km/day',
      'Breakdown support'
    ],
    notIncluded: [
      'Fuel',
      'Tolls',
      'Parking charges',
      'Traffic fines'
    ],
  };

  const featureIcons: { [key: string]: string } = {
    'Air Conditioning': 'snow',
    'GPS Navigation': 'navigate',
    'Bluetooth': 'bluetooth',
    '5 Seats': 'people',
    'Automatic': 'settings',
    'Diesel': 'speedometer',
    'Parking Sensors': 'radio',
    'Music System': 'musical-notes',
    'USB Charging': 'battery-charging',
    'Sunroof': 'sunny',
    'Keyless Entry': 'key',
    'Electric Windows': 'car-sport',
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <FlatList
        data={vehicle.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => setShowImageZoom(true)}
          >
            <View style={styles.imagePlaceholder}>
              <Ionicons name="car-sport" size={60} color={Colors.primary.teal} />
              <Text style={styles.imageNumber}>Image {index + 1}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
      {/* Image counter */}
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {currentImageIndex + 1} / {vehicle.images.length}
        </Text>
      </View>
      
      {/* Action buttons */}
      <View style={styles.imageActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? Colors.functional.error : Colors.text.secondary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      {/* Thumbnails */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailsContainer}
        contentContainerStyle={styles.thumbnailsContent}
      >
        {vehicle.images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.thumbnail,
              currentImageIndex === index && styles.thumbnailActive
            ]}
            onPress={() => setCurrentImageIndex(index)}
          >
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="image" size={20} color={Colors.text.secondary} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickInfo = () => (
    <View style={styles.quickInfoBar}>
      <View style={styles.quickInfoLeft}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>{vehicle.rating} ({vehicle.reviewsCount} reviews)</Text>
        </View>
        
        <Text style={styles.categoryText}>{vehicle.category}</Text>
      </View>
      
      <View style={styles.badges}>
        {vehicle.instantBooking && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Instant Booking</Text>
          </View>
        )}
        
        {vehicle.verifiedOwner && (
          <View style={[styles.badge, styles.verifiedBadge]}>
            <Ionicons name="checkmark-circle" size={12} color="#ffffff" />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderVehicleNamePrice = () => (
    <View style={styles.nameCard}>
      <Text style={styles.vehicleName}>{vehicle.name}</Text>
      <Text style={styles.vehicleSubtitle}>{vehicle.subtitle}</Text>
      
      <View style={styles.pricingContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceDaily}>₹{vehicle.pricing.daily}/day</Text>
          {vehicle.pricing.weekly && (
            <Text style={styles.priceWeekly}>₹{vehicle.pricing.weekly}/week</Text>
          )}
          {vehicle.pricing.monthly && (
            <Text style={styles.priceMonthly}>₹{vehicle.pricing.monthly}/month</Text>
          )}
        </View>
        
        <Text style={styles.extraCharges}>
          + ₹{vehicle.pricing.extraKmCharge}/km after {vehicle.pricing.freeKmPerDay}km
        </Text>
      </View>
    </View>
  );

  const renderAvailabilityCalendar = () => (
    <View style={styles.sectionCard}>
      <TouchableOpacity 
        style={styles.availabilityButton}
        onPress={() => setShowCalendar(true)}
      >
        <Ionicons name="calendar" size={20} color={Colors.primary.teal} />
        <Text style={styles.availabilityText}>Check Availability</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderKeyFeatures = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <TouchableOpacity onPress={() => toggleSection('features')}>
          <Text style={styles.viewAllText}>
            {expandedSections.features ? 'Show less' : 'View all features'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.featuresGrid}>
        {(expandedSections.features ? vehicle.features : vehicle.features.slice(0, 8))
          .map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons 
              name={featureIcons[feature] as any || 'checkmark-circle'} 
              size={20} 
              color={Colors.primary.teal} 
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Specifications</Text>
      
      <View style={styles.specsContainer}>
        {Object.entries({
          'Brand': vehicle.brand,
          'Model': vehicle.model,
          'Year': vehicle.year.toString(),
          'Registration': vehicle.specifications.registration,
          'Color': vehicle.specifications.color,
          'Mileage': vehicle.specifications.mileage,
          'Transmission': vehicle.specifications.transmission,
          'Fuel Type': vehicle.specifications.fuelType,
          'Insurance Valid Till': vehicle.specifications.insuranceValidTill,
          'Pollution Certificate': vehicle.specifications.pollutionCertificate ? 'Valid' : 'Invalid',
        }).map(([key, value]) => (
          <View key={key} style={styles.specRow}>
            <Text style={styles.specKey}>{key}:</Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>About This Car</Text>
      <Text 
        style={styles.descriptionText}
        numberOfLines={expandedSections.description ? undefined : 3}
      >
        {vehicle.description}
      </Text>
      
      {vehicle.description.length > 150 && (
        <TouchableOpacity onPress={() => toggleSection('description')}>
          <Text style={styles.readMoreText}>
            {expandedSections.description ? 'Read less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPickupReturn = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Pickup & Return</Text>
      
      <View style={styles.locationInfo}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={Colors.primary.teal} />
          <Text style={styles.locationAddress}>{vehicle.location.address}</Text>
        </View>
        
        <TouchableOpacity style={styles.viewMapButton}>
          <Text style={styles.viewMapText}>View on Map</Text>
        </TouchableOpacity>
        
        <Text style={styles.distanceText}>
          Distance from you: {vehicle.location.distance} km
        </Text>
      </View>
      
      {vehicle.location.deliveryAvailable && (
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryText}>
            Delivery Available: Yes (₹{vehicle.location.deliveryCharge} extra)
          </Text>
          <Text style={styles.deliveryRadius}>
            Delivery radius: Within {vehicle.location.deliveryRadius} km
          </Text>
        </View>
      )}
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Pickup Instructions:</Text>
        <Text style={styles.instructionsText}>{vehicle.pickupInstructions}</Text>
      </View>
    </View>
  );

  const renderPricingBreakdown = () => (
    <View style={styles.sectionCard}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection('pricing')}
      >
        <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
        <Ionicons 
          name={expandedSections.pricing ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.text.secondary} 
        />
      </TouchableOpacity>
      
      {expandedSections.pricing && (
        <View style={styles.pricingBreakdown}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Base Rental: ₹{vehicle.pricing.daily} x 2 days</Text>
            <Text style={styles.pricingValue}>₹{vehicle.pricing.daily * 2}</Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Extra KM charges</Text>
            <Text style={styles.pricingValue}>₹{vehicle.pricing.extraKmCharge}/km after {vehicle.pricing.freeKmPerDay}km/day</Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Security Deposit (refundable)</Text>
            <Text style={styles.pricingValue}>₹5,000</Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Fuel Policy</Text>
            <Text style={styles.pricingValue}>Full to Full</Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Platform Fee</Text>
            <Text style={styles.pricingValue}>₹200</Text>
          </View>
          
          <View style={styles.pricingDivider} />
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Subtotal</Text>
            <Text style={styles.pricingValue}>₹{vehicle.pricing.daily * 2 + 200}</Text>
          </View>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>GST (18%)</Text>
            <Text style={styles.pricingValue}>₹{Math.round((vehicle.pricing.daily * 2 + 200) * 0.18)}</Text>
          </View>
          
          <View style={styles.pricingDivider} />
          
          <View style={[styles.pricingRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{Math.round((vehicle.pricing.daily * 2 + 200) * 1.18)}</Text>
          </View>
          
          <Text style={styles.pricingNote}>*Price may vary based on duration</Text>
        </View>
      )}
    </View>
  );

  const renderCancellationPolicy = () => (
    <View style={styles.sectionCard}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection('cancellation')}
      >
        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        <Ionicons 
          name={expandedSections.cancellation ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.text.secondary} 
        />
      </TouchableOpacity>
      
      <View style={styles.policyTypeContainer}>
        <Text style={styles.policyType}>{vehicle.cancellationPolicy}</Text>
      </View>
      
      {expandedSections.cancellation && (
        <View style={styles.policyDetails}>
          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
            <Text style={styles.policyText}>Free cancellation up to 24 hours before pickup</Text>
          </View>
          
          <View style={styles.policyItem}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.policyText}>50% refund if cancelled within 24 hours</Text>
          </View>
          
          <View style={styles.policyItem}>
            <Ionicons name="close-circle" size={16} color={Colors.functional.error} />
            <Text style={styles.policyText}>No refund after pickup time</Text>
          </View>
          
          <TouchableOpacity style={styles.fullPolicyLink}>
            <Text style={styles.fullPolicyText}>View full cancellation policy</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderWhatsIncluded = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>What's Included</Text>
      
      <View style={styles.includedSection}>
        <Text style={styles.includedTitle}>✓ Included:</Text>
        {vehicle.included.map((item, index) => (
          <View key={index} style={styles.includedItem}>
            <Ionicons name="checkmark" size={16} color={Colors.functional.success} />
            <Text style={styles.includedText}>{item}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.includedSection}>
        <Text style={styles.notIncludedTitle}>✗ Not Included:</Text>
        {vehicle.notIncluded.map((item, index) => (
          <View key={index} style={styles.includedItem}>
            <Ionicons name="close" size={16} color={Colors.functional.error} />
            <Text style={styles.includedText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderOwnerInfo = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Owner Information</Text>
      
      <View style={styles.ownerContainer}>
        <View style={styles.ownerPhoto}>
          <Ionicons name="person" size={24} color={Colors.text.secondary} />
        </View>
        
        <View style={styles.ownerDetails}>
          <View style={styles.ownerNameRow}>
            <Text style={styles.ownerName}>{vehicle.owner.name}</Text>
            <View style={styles.verificationBadges}>
              {vehicle.owner.verified.documents && (
                <Ionicons name="document-text" size={12} color={Colors.functional.success} />
              )}
              {vehicle.owner.verified.phone && (
                <Ionicons name="call" size={12} color={Colors.functional.success} />
              )}
            </View>
          </View>
          
          <Text style={styles.memberSince}>Member since {vehicle.owner.memberSince}</Text>
          <Text style={styles.ownerStats}>
            {vehicle.owner.totalVehicles} vehicles • {vehicle.owner.responseTime}
          </Text>
          
          <View style={styles.ownerRating}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.ownerRatingText}>
              {vehicle.owner.rating} ({vehicle.owner.reviewsCount} reviews)
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.ownerActions}>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviewsSection = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
      
      <View style={styles.overallRating}>
        <View style={styles.ratingNumberContainer}>
          <Text style={styles.overallRatingNumber}>{vehicle.rating}</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons 
                key={star}
                name="star" 
                size={16} 
                color={star <= Math.floor(vehicle.rating) ? "#FFC107" : "#E5E7EB"} 
              />
            ))}
          </View>
          <Text style={styles.ratingCount}>({vehicle.reviewsCount} reviews)</Text>
        </View>
        
        <View style={styles.ratingBreakdown}>
          <Text style={styles.breakdownTitle}>Rating Breakdown:</Text>
          {[
            { label: 'Cleanliness', rating: 4.9 },
            { label: 'Accuracy', rating: 4.8 },
            { label: 'Communication', rating: 5.0 },
            { label: 'Value for Money', rating: 4.7 },
          ].map((item, index) => (
            <View key={index} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{item.label}:</Text>
              <Text style={styles.breakdownRating}>{item.rating}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.ratingDistribution}>
        <Text style={styles.distributionTitle}>Rating Distribution:</Text>
        {[
          { stars: 5, percentage: 75 },
          { stars: 4, percentage: 20 },
          { stars: 3, percentage: 3 },
          { stars: 2, percentage: 1 },
          { stars: 1, percentage: 1 },
        ].map((item, index) => (
          <View key={index} style={styles.distributionRow}>
            <Text style={styles.distributionStars}>{item.stars} Star</Text>
            <View style={styles.distributionBar}>
              <View 
                style={[
                  styles.distributionFill, 
                  { width: `${item.percentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.recentReviews}>
        <Text style={styles.recentReviewsTitle}>Recent Reviews:</Text>
        {vehicle.reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerPhoto}>
                <Text style={styles.reviewerInitial}>
                  {review.userName.charAt(0)}
                </Text>
              </View>
              
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons 
                      key={star}
                      name="star" 
                      size={12} 
                      color={star <= review.rating ? "#FFC107" : "#E5E7EB"} 
                    />
                  ))}
                  <Text style={styles.reviewDate}> • {review.date}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.reviewText}>{review.text}</Text>
            
            <View style={styles.reviewActions}>
              <TouchableOpacity style={styles.helpfulButton}>
                <Ionicons name="thumbs-up-outline" size={14} color={Colors.text.secondary} />
                <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.seeAllReviews}>
          <Text style={styles.seeAllReviewsText}>See all {vehicle.reviewsCount} reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSimilarVehicles = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>You may also like</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.similarVehiclesContent}
      >
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.similarVehicleCard}>
            <View style={styles.similarVehicleImage}>
              <Ionicons name="car-sport" size={40} color={Colors.primary.teal} />
            </View>
            
            <View style={styles.similarVehicleInfo}>
              <Text style={styles.similarVehicleName}>Honda City 2022</Text>
              <Text style={styles.similarVehiclePrice}>₹2,200/day</Text>
              
              <View style={styles.similarVehicleRating}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.similarVehicleRatingText}>4.8 (23)</Text>
              </View>
              
              <TouchableOpacity style={styles.compareButton}>
                <Text style={styles.compareButtonText}>Compare</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderSafetyTrust = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Safety & Trust</Text>
      
      <View style={styles.safetyGrid}>
        {[
          { icon: 'shield-checkmark', title: 'Vehicle Inspection Done' },
          { icon: 'person-circle', title: 'Owner Verified' },
          { icon: 'car', title: 'Insured Vehicle' },
          { icon: 'headset', title: '24/7 Support Available' },
        ].map((item, index) => (
          <View key={index} style={styles.safetyItem}>
            <Ionicons name={item.icon as any} size={24} color={Colors.functional.success} />
            <Text style={styles.safetyText}>{item.title}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.safetyStandardsLink}>
        <Text style={styles.safetyStandardsText}>Learn about our safety standards</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFAQs = () => {
    const faqs = [
      {
        question: 'Can I extend my booking?',
        answer: 'Yes, you can extend your booking subject to vehicle availability. Extension charges will apply as per the daily rate.'
      },
      {
        question: 'What if I return late?',
        answer: 'Late return charges of ₹100 per hour will be applicable after a grace period of 30 minutes.'
      },
      {
        question: 'What documents do I need?',
        answer: 'You need a valid driving license (min 1 year old), Aadhaar card, and one additional ID proof.'
      },
      {
        question: 'Is the car insured?',
        answer: 'Yes, all vehicles have comprehensive insurance coverage. However, deductible charges may apply for damages.'
      },
      {
        question: 'What if the car breaks down?',
        answer: '24/7 roadside assistance is included. Call our support team immediately and we will arrange help or replacement vehicle.'
      },
    ];

    return (
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection('faqs')}
        >
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <Ionicons 
            name={expandedSections.faqs ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.text.secondary} 
          />
        </TouchableOpacity>
        
        {expandedSections.faqs && (
          <View style={styles.faqsContainer}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderReportListing = () => (
    <View style={styles.reportContainer}>
      <TouchableOpacity style={styles.reportButton}>
        <Ionicons name="flag-outline" size={16} color={Colors.text.secondary} />
        <Text style={styles.reportText}>Report this listing</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStickyBottomBar = () => (
    <View style={styles.stickyBottomBar}>
      <View style={styles.bottomPrice}>
        <Text style={styles.bottomPriceText}>₹{vehicle.pricing.daily}/day</Text>
      </View>
      
      <TouchableOpacity style={styles.bookNowButton}>
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.bookNowGradient}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.bottomActionButton}>
        <Ionicons name="share-outline" size={20} color={Colors.text.secondary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.bottomActionButton}
        onPress={() => setIsFavorite(!isFavorite)}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite ? Colors.functional.error : Colors.text.secondary} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary.teal} />
      
      {/* Header with back button - overlay on image */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderImageGallery()}
        {renderQuickInfo()}
        {renderVehicleNamePrice()}
        {renderAvailabilityCalendar()}
        {renderKeyFeatures()}
        {renderSpecifications()}
        {renderDescription()}
        {renderPickupReturn()}
        {renderPricingBreakdown()}
        {renderCancellationPolicy()}
        {renderWhatsIncluded()}
        {renderOwnerInfo()}
        {renderReviewsSection()}
        {renderSimilarVehicles()}
        {renderSafetyTrust()}
        {renderFAQs()}
        {renderReportListing()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderStickyBottomBar()}
      
      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCalendar(false)}
      >
        <SafeAreaView style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>Select Dates</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.calendarContent}>
            <View style={styles.dateRangeSelector}>
              <View style={styles.dateInputRow}>
                <View style={styles.dateInput}>
                  <Text style={styles.dateLabel}>Pickup Date & Time</Text>
                  <TouchableOpacity style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>
                      {selectedDates.pickup ? selectedDates.pickup.toDateString() : 'Select Date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateInput}>
                  <Text style={styles.dateLabel}>Return Date & Time</Text>
                  <TouchableOpacity style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>
                      {selectedDates.return ? selectedDates.return.toDateString() : 'Select Date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {selectedDates.pickup && selectedDates.return && (
                <View style={styles.durationInfo}>
                  <Text style={styles.durationText}>
                    Duration: {Math.ceil((selectedDates.return.getTime() - selectedDates.pickup.getTime()) / (1000 * 60 * 60 * 24))} days
                  </Text>
                </View>
              )}
            </View>
            
            {/* Calendar Grid would go here */}
            <View style={styles.calendarPlaceholder}>
              <Text style={styles.calendarPlaceholderText}>Calendar Component</Text>
              <Text style={styles.calendarNote}>
                • Green: Available dates{'\n'}
                • Red: Booked dates{'\n'}
                • Teal: Selected dates
              </Text>
            </View>
            
            <TouchableOpacity style={styles.continueButton}>
              <LinearGradient
                colors={[Colors.primary.teal, Colors.accent.blue]}
                style={styles.continueGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      
      {/* Image Zoom Modal */}
      <Modal
        visible={showImageZoom}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowImageZoom(false)}
      >
        <View style={styles.imageZoomModal}>
          <TouchableOpacity 
            style={styles.imageZoomClose}
            onPress={() => setShowImageZoom(false)}
          >
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.imageZoomContainer}>
            <View style={styles.imageZoomPlaceholder}>
              <Ionicons name="car-sport" size={100} color={Colors.primary.teal} />
              <Text style={styles.imageZoomText}>Zoomed Image View</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for sticky bottom bar
  },
  imageGallery: {
    height: 300,
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: 300,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumber: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  imageActions: {
    position: 'absolute',
    top: 40,
    right: 16,
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  thumbnailsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: Colors.primary.teal,
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickInfoLeft: {
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadge: {
    backgroundColor: Colors.primary.teal,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nameCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  pricingContainer: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  priceDaily: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  priceWeekly: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  priceMonthly: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  extraCharges: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  availabilityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  specsContainer: {
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specKey: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  locationInfo: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    flex: 1,
  },
  viewMapButton: {
    alignSelf: 'flex-start',
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  deliveryInfo: {
    marginTop: 12,
    gap: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  deliveryRadius: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  instructionsContainer: {
    marginTop: 16,
    gap: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  ownerContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  ownerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerDetails: {
    flex: 1,
    gap: 4,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  verificationBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  ownerStats: {
    fontSize: 12,
    color: Colors.text.secondary,
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
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.primary.teal,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  bookNowButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookNowGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomActionButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
  // Pricing Breakdown Styles
  pricingBreakdown: {
    gap: 12,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
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
  pricingNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  // Cancellation Policy Styles
  policyTypeContainer: {
    marginBottom: 8,
  },
  policyType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.success,
  },
  policyDetails: {
    gap: 12,
    marginTop: 12,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policyText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  fullPolicyLink: {
    marginTop: 8,
  },
  fullPolicyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  // What's Included Styles
  includedSection: {
    marginBottom: 16,
  },
  includedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.success,
    marginBottom: 8,
  },
  notIncludedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.error,
    marginBottom: 8,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  includedText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  // Reviews Styles
  overallRating: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  ratingNumberContainer: {
    alignItems: 'center',
    gap: 4,
  },
  overallRatingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  ratingBreakdown: {
    flex: 1,
    gap: 4,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  breakdownRating: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  ratingDistribution: {
    marginBottom: 20,
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  distributionStars: {
    fontSize: 12,
    color: Colors.text.secondary,
    width: 40,
  },
  distributionBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  distributionFill: {
    height: '100%',
    backgroundColor: Colors.primary.teal,
    borderRadius: 3,
  },
  distributionPercentage: {
    fontSize: 12,
    color: Colors.text.secondary,
    width: 30,
    textAlign: 'right',
  },
  recentReviews: {
    gap: 16,
  },
  recentReviewsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewCard: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewerPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reviewerInfo: {
    flex: 1,
    gap: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  seeAllReviews: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  seeAllReviewsText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  // Similar Vehicles Styles
  similarVehiclesContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  similarVehicleCard: {
    width: 180,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  similarVehicleImage: {
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  similarVehicleInfo: {
    gap: 4,
  },
  similarVehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  similarVehiclePrice: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  similarVehicleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  similarVehicleRatingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  compareButton: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary.teal,
    borderRadius: 4,
    alignItems: 'center',
  },
  compareButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Safety & Trust Styles
  safetyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  safetyItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safetyText: {
    fontSize: 12,
    color: Colors.text.primary,
    flex: 1,
  },
  safetyStandardsLink: {
    alignItems: 'center',
  },
  safetyStandardsText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  // FAQs Styles
  faqsContainer: {
    gap: 16,
    marginTop: 16,
  },
  faqItem: {
    gap: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  // Report Listing Styles
  reportContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  // Modal Styles
  calendarModal: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 24,
  },
  calendarContent: {
    flex: 1,
    padding: 20,
  },
  dateRangeSelector: {
    gap: 16,
    marginBottom: 24,
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  dateButton: {
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
  dateButtonText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  durationInfo: {
    padding: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
    textAlign: 'center',
  },
  calendarPlaceholder: {
    height: 300,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  calendarNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  continueButton: {
    borderRadius: 8,
    overflow: 'hidden',
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
  imageZoomModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoomClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoomContainer: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoomPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    width: '100%',
  },
  imageZoomText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
  },
});
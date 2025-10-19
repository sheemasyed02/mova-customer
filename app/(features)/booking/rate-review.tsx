import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
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

interface RatingDescriptor {
  [key: number]: string;
}

interface DetailedRating {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
}

export default function RateReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get booking data from params or fallback to sample data
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId || 'MOV-12345';
  const vehicleName = Array.isArray(params.vehicleName) ? params.vehicleName[0] : params.vehicleName || 'Hyundai Creta';
  const ownerName = Array.isArray(params.ownerName) ? params.ownerName[0] : params.ownerName || 'Amit Motors';
  const vehicleImage = Array.isArray(params.vehicleImage) ? params.vehicleImage[0] : params.vehicleImage || 'https://via.placeholder.com/300x200/2D9B8E/FFFFFF?text=Creta';

  // State management
  const [overallRating, setOverallRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState<DetailedRating[]>([
    { id: 'cleanliness', title: 'Cleanliness', subtitle: 'Interior and exterior condition', rating: 0 },
    { id: 'accuracy', title: 'Accuracy', subtitle: 'Vehicle matched description', rating: 0 },
    { id: 'communication', title: 'Communication', subtitle: 'Owner\'s responsiveness', rating: 0 },
    { id: 'value', title: 'Value for Money', subtitle: 'Worth the price paid', rating: 0 },
    { id: 'experience', title: 'Overall Experience', subtitle: 'General satisfaction', rating: 0 },
  ]);

  const [likedTags, setLikedTags] = useState<string[]>([]);
  const [improvementTags, setImprovementTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [wouldRentAgain, setWouldRentAgain] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<'yes' | 'no' | null>(null);
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [shareOnSocial, setShareOnSocial] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const ratingDescriptors: RatingDescriptor = {
    1: 'Terrible',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  };

  const likedOptions = [
    'Clean vehicle', 'Great owner', 'Well maintained', 'Easy pickup',
    'Smooth ride', 'Good mileage', 'Comfortable', 'As described',
    'Great value', 'Would recommend'
  ];

  const improvementOptions = [
    'Cleanliness', 'Maintenance', 'Communication', 'Late pickup',
    'Hidden charges', 'Vehicle condition', 'Not as described', 'Poor support'
  ];

  const renderStarRating = (rating: number, onPress: (star: number) => void, size: number = 24) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onPress(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FFD700' : '#E5E7EB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleDetailedRatingChange = (id: string, rating: number) => {
    setDetailedRatings(prev =>
      prev.map(item => item.id === id ? { ...item, rating } : item)
    );
  };

  const handleTagToggle = (tag: string, isLiked: boolean) => {
    if (isLiked) {
      setLikedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
    } else {
      setImprovementTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
    }
  };

  const handleImagePicker = async () => {
    if (uploadedPhotos.length >= 5) {
      Alert.alert('Limit Reached', 'You can only upload up to 5 photos.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (overallRating === 0) {
      Alert.alert('Rating Required', 'Please provide an overall rating.');
      return false;
    }
    return true;
  };

  const handleSubmitReview = () => {
    if (!validateForm()) return;
    
    setShowSubmissionModal(true);
    
    // Here you would typically send the review data to your API
    const reviewData = {
      bookingId,
      overallRating,
      detailedRatings,
      likedTags,
      improvementTags,
      reviewText,
      uploadedPhotos,
      wouldRentAgain,
      wouldRecommend,
      postAnonymously,
      shareOnSocial,
    };
    
    console.log('Review Data:', reviewData);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Rate Your Experience</Text>
          <Text style={styles.bookingId}>#{bookingId}</Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>
      
      <Text style={styles.headerSubtitle}>Help others make better decisions</Text>
    </View>
  );

  const renderVehicleInfo = () => (
    <View style={styles.card}>
      <View style={styles.vehicleHeader}>
        <Image source={{ uri: vehicleImage }} style={styles.vehicleImage} />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>{vehicleName}</Text>
          <Text style={styles.ownerName}>Owner: {ownerName}</Text>
        </View>
      </View>
    </View>
  );

  const renderOverallRating = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Overall Rating</Text>
      
      <View style={styles.overallRatingContainer}>
        {renderStarRating(overallRating, setOverallRating, 32)}
        
        {overallRating > 0 && (
          <Text style={styles.ratingDescriptor}>
            {ratingDescriptors[overallRating]}
          </Text>
        )}
      </View>
    </View>
  );

  const renderDetailedRatings = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Detailed Ratings</Text>
      <Text style={styles.sectionSubtitle}>Rate each aspect (1-5 stars)</Text>
      
      <View style={styles.detailedRatingsContainer}>
        {detailedRatings.map((item) => (
          <View key={item.id} style={styles.detailedRatingItem}>
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingTitle}>{item.title}</Text>
              <Text style={styles.ratingSubtitle}>{item.subtitle}</Text>
            </View>
            {renderStarRating(item.rating, (rating) => handleDetailedRatingChange(item.id, rating), 20)}
          </View>
        ))}
      </View>
    </View>
  );

  const renderLikedTags = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>What did you like?</Text>
      <Text style={styles.sectionSubtitle}>Select all that apply (optional)</Text>
      
      <View style={styles.tagsContainer}>
        {likedOptions.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              likedTags.includes(tag) && styles.tagSelected
            ]}
            onPress={() => handleTagToggle(tag, true)}
          >
            <Text style={[
              styles.tagText,
              likedTags.includes(tag) && styles.tagTextSelected
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderImprovementTags = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>What could be better?</Text>
      <Text style={styles.sectionSubtitle}>Select all that apply (optional)</Text>
      
      <View style={styles.tagsContainer}>
        {improvementOptions.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              styles.improvementTag,
              improvementTags.includes(tag) && styles.improvementTagSelected
            ]}
            onPress={() => handleTagToggle(tag, false)}
          >
            <Text style={[
              styles.tagText,
              styles.improvementTagText,
              improvementTags.includes(tag) && styles.improvementTagTextSelected
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReviewText = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Write Your Review</Text>
      <Text style={styles.sectionSubtitle}>Share details of your experience (optional but encouraged)</Text>
      
      <TextInput
        style={styles.reviewInput}
        placeholder="Share details of your experience..."
        placeholderTextColor={Colors.text.secondary}
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        maxLength={1000}
        textAlignVertical="top"
      />
      
      <View style={styles.reviewFooter}>
        <Text style={styles.characterCount}>{reviewText.length}/1000</Text>
        <Text style={styles.reviewTip}>Mention specific highlights or concerns</Text>
      </View>
      
      <Text style={styles.publicNote}>Your review will be public</Text>
    </View>
  );

  const renderPhotoUpload = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Add Photos</Text>
      <Text style={styles.sectionSubtitle}>Upload trip photos (optional, up to 5 photos)</Text>
      <Text style={styles.photoHelp}>Photos help future renters</Text>
      
      <View style={styles.photosContainer}>
        {uploadedPhotos.map((photo, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri: photo }} style={styles.uploadedPhoto} />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => removePhoto(index)}
            >
              <Ionicons name="close-circle" size={20} color={Colors.functional.error} />
            </TouchableOpacity>
          </View>
        ))}
        
        {uploadedPhotos.length < 5 && (
          <TouchableOpacity style={styles.addPhotoButton} onPress={handleImagePicker}>
            <Ionicons name="camera" size={24} color={Colors.primary.teal} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Additional Questions</Text>
      
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>Would you rent from this owner again?</Text>
        <View style={styles.optionsContainer}>
          {(['yes', 'no', 'maybe'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                wouldRentAgain === option && styles.optionButtonSelected
              ]}
              onPress={() => setWouldRentAgain(option)}
            >
              <View style={[
                styles.radioButton,
                wouldRentAgain === option && styles.radioButtonSelected
              ]}>
                {wouldRentAgain === option && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.optionText,
                wouldRentAgain === option && styles.optionTextSelected
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>Would you recommend this vehicle?</Text>
        <View style={styles.optionsContainer}>
          {(['yes', 'no'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                wouldRecommend === option && styles.optionButtonSelected
              ]}
              onPress={() => setWouldRecommend(option)}
            >
              <View style={[
                styles.radioButton,
                wouldRecommend === option && styles.radioButtonSelected
              ]}>
                {wouldRecommend === option && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.optionText,
                wouldRecommend === option && styles.optionTextSelected
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPrivacyOptions = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Privacy Options</Text>
      
      <TouchableOpacity
        style={styles.checkboxOption}
        onPress={() => setPostAnonymously(!postAnonymously)}
      >
        <View style={[styles.checkbox, postAnonymously && styles.checkboxSelected]}>
          {postAnonymously && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxText}>Post anonymously</Text>
          <Text style={styles.checkboxSubtext}>Name hidden, shows "Verified User"</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.checkboxOption}
        onPress={() => setShareOnSocial(!shareOnSocial)}
      >
        <View style={[styles.checkbox, shareOnSocial && styles.checkboxSelected]}>
          {shareOnSocial && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxText}>Share on social media</Text>
          <Text style={styles.checkboxSubtext}>Facebook/Instagram share option</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderGuidelines = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Review Guidelines</Text>
      
      <View style={styles.guidelinesContainer}>
        {[
          'Keep it respectful',
          'Be honest and specific',
          'No personal contact info',
          'No discriminatory language',
          'MOVA reserves right to remove inappropriate reviews'
        ].map((guideline, index) => (
          <View key={index} style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
            <Text style={styles.guidelineText}>{guideline}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderIncentiveBanner = () => (
    <View style={styles.incentiveBanner}>
      <LinearGradient
        colors={[Colors.primary.teal, Colors.accent.blue]}
        style={styles.incentiveGradient}
      >
        <Ionicons name="gift" size={24} color="#ffffff" />
        <View style={styles.incentiveContent}>
          <Text style={styles.incentiveTitle}>Get ₹100 off on next booking!</Text>
          <Text style={styles.incentiveSubtitle}>Coupon auto-applied to account after review</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.back()}
      >
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.submitButton,
          overallRating === 0 && styles.submitButtonDisabled
        ]}
        onPress={handleSubmitReview}
        disabled={overallRating === 0}
      >
        <LinearGradient
          colors={overallRating > 0 ? [Colors.primary.teal, Colors.accent.blue] : ['#E5E7EB', '#E5E7EB']}
          style={styles.submitButtonGradient}
        >
          <Text style={[
            styles.submitButtonText,
            overallRating === 0 && styles.submitButtonTextDisabled
          ]}>
            Submit Review
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderSubmissionModal = () => (
    <Modal
      visible={showSubmissionModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSubmissionModal(false)}
    >
      <SafeAreaView style={styles.submissionModal}>
        <View style={styles.submissionContent}>
          <View style={styles.submissionIcon}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.functional.success} />
          </View>
          
          <Text style={styles.submissionTitle}>Thank You!</Text>
          <Text style={styles.submissionSubtitle}>Your review is live!</Text>
          
          <View style={styles.pointsEarned}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.pointsText}>+50 MOVA points earned</Text>
          </View>
          
          <View style={styles.submissionActions}>
            <TouchableOpacity style={styles.viewReviewButton}>
              <Text style={styles.viewReviewText}>View your review</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareReviewButton}>
              <Ionicons name="share" size={16} color={Colors.primary.teal} />
              <Text style={styles.shareReviewText}>Share review</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.bookAgainButton}
            onPress={() => {
              setShowSubmissionModal(false);
              router.replace('/(main)/vehicles' as any);
            }}
          >
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.bookAgainGradient}
            >
              <Text style={styles.bookAgainText}>Book your next trip</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setShowSubmissionModal(false);
              router.back();
            }}
          >
            <Text style={styles.closeModalText}>Close</Text>
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
        {renderVehicleInfo()}
        {renderOverallRating()}
        {renderDetailedRatings()}
        {renderLikedTags()}
        {renderImprovementTags()}
        {renderReviewText()}
        {renderPhotoUpload()}
        {renderQuestions()}
        {renderPrivacyOptions()}
        {renderGuidelines()}
        {renderIncentiveBanner()}
      </ScrollView>
      
      {renderActionButtons()}
      {renderSubmissionModal()}
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
    marginBottom: 8,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  overallRatingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingDescriptor: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  detailedRatingsContainer: {
    gap: 16,
  },
  detailedRatingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ratingInfo: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  ratingSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  improvementTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  improvementTagSelected: {
    backgroundColor: Colors.functional.error,
    borderColor: Colors.functional.error,
  },
  tagText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  tagTextSelected: {
    color: '#ffffff',
  },
  improvementTagText: {
    color: Colors.functional.error,
  },
  improvementTagTextSelected: {
    color: '#ffffff',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  reviewTip: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  publicNote: {
    fontSize: 12,
    color: Colors.functional.warning,
    fontWeight: '500',
    marginTop: 8,
  },
  photoHelp: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    position: 'relative',
  },
  uploadedPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  questionSection: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  optionButtonSelected: {
    // No additional styles needed, handled by radio button
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
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  checkboxSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  guidelinesContainer: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  incentiveBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  incentiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  incentiveContent: {
    flex: 1,
  },
  incentiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  incentiveSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  submitButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  submissionModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  submissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  submissionIcon: {
    marginBottom: 24,
  },
  submissionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  submissionSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  pointsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  submissionActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  viewReviewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
  },
  viewReviewText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  shareReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
  },
  shareReviewText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  bookAgainButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bookAgainGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeModalButton: {
    paddingVertical: 12,
  },
  closeModalText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
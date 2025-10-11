import SignaturePad from '@/components/SignaturePad';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

interface InspectionData {
  bookingId: string;
  vehicleName: string;
  inspectionType: 'pre-trip' | 'post-trip';
  exterior: {
    front: { photo: string | null; damages: any[] };
    rear: { photo: string | null; damages: any[] };
    left: { photo: string | null; damages: any[] };
    right: { photo: string | null; damages: any[] };
    roof: { photo: string | null; damages: any[] };
  };
  interior: {
    dashboard: { photo: string | null; condition: string };
    frontSeats: { photo: string | null; condition: string };
    rearSeats: { photo: string | null; condition: string };
    trunk: { photo: string | null; condition: string };
    floorMats: { photo: string | null; condition: string };
  };
  functionalCheck: {
    lights: boolean | null;
    ac: boolean | null;
    musicSystem: boolean | null;
    horn: boolean | null;
    wipers: boolean | null;
    doorsLock: boolean | null;
    windows: boolean | null;
    mirrors: boolean | null;
  };
  tiresAndSpare: {
    tire1: { photo: string | null; condition: string };
    tire2: { photo: string | null; condition: string };
    tire3: { photo: string | null; condition: string };
    tire4: { photo: string | null; condition: string };
    spareTire: boolean | null;
    toolsPresent: boolean | null;
  };
  documents: {
    rcBook: boolean | null;
    insurance: boolean | null;
    pollution: boolean | null;
    emergencyContacts: boolean | null;
  };
  fuelAndOdometer: {
    fuelPhoto: string | null;
    fuelLevel: number;
    odometerReading: string;
    odometerPhoto: string | null;
    tripMeterReset: boolean;
  };
  cleanliness: {
    overallRating: number;
    interiorClean: boolean | null;
    exteriorClean: boolean | null;
    photos: string[];
  };
  additionalNotes: string;
  noIssuesFound: boolean;
  signatures: {
    customer: string | null;
    owner: string | null;
    confirmed: boolean;
  };
}

export default function VehicleInspectionScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('exterior');
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureType, setSignatureType] = useState<'customer' | 'owner'>('customer');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedDamageLocation, setSelectedDamageLocation] = useState<{x: number, y: number} | null>(null);
  const [damageType, setDamageType] = useState('');
  const [damageSeverity, setDamageSeverity] = useState('');
  const [damageNote, setDamageNote] = useState('');
  
  // Sample inspection data
  const [inspectionData, setInspectionData] = useState<InspectionData>({
    bookingId: 'MOV-12345',
    vehicleName: 'Hyundai Creta 2023',
    inspectionType: 'pre-trip',
    exterior: {
      front: { photo: null, damages: [] },
      rear: { photo: null, damages: [] },
      left: { photo: null, damages: [] },
      right: { photo: null, damages: [] },
      roof: { photo: null, damages: [] },
    },
    interior: {
      dashboard: { photo: null, condition: '' },
      frontSeats: { photo: null, condition: '' },
      rearSeats: { photo: null, condition: '' },
      trunk: { photo: null, condition: '' },
      floorMats: { photo: null, condition: '' },
    },
    functionalCheck: {
      lights: null,
      ac: null,
      musicSystem: null,
      horn: null,
      wipers: null,
      doorsLock: null,
      windows: null,
      mirrors: null,
    },
    tiresAndSpare: {
      tire1: { photo: null, condition: '' },
      tire2: { photo: null, condition: '' },
      tire3: { photo: null, condition: '' },
      tire4: { photo: null, condition: '' },
      spareTire: null,
      toolsPresent: null,
    },
    documents: {
      rcBook: null,
      insurance: null,
      pollution: null,
      emergencyContacts: null,
    },
    fuelAndOdometer: {
      fuelPhoto: null,
      fuelLevel: 50,
      odometerReading: '',
      odometerPhoto: null,
      tripMeterReset: false,
    },
    cleanliness: {
      overallRating: 0,
      interiorClean: null,
      exteriorClean: null,
      photos: [],
    },
    additionalNotes: '',
    noIssuesFound: false,
    signatures: {
      customer: null,
      owner: null,
      confirmed: false,
    },
  });

  const sections = [
    { key: 'exterior', title: 'Exterior', icon: 'car-outline' },
    { key: 'interior', title: 'Interior', icon: 'car-seat-outline' },
    { key: 'functional', title: 'Functional', icon: 'settings-outline' },
    { key: 'tires', title: 'Tires', icon: 'ellipse-outline' },
    { key: 'documents', title: 'Documents', icon: 'document-text-outline' },
    { key: 'fuel', title: 'Fuel & ODO', icon: 'speedometer-outline' },
    { key: 'cleanliness', title: 'Cleanliness', icon: 'sparkles-outline' },
    ...(inspectionData.inspectionType === 'post-trip' ? [{ key: 'comparison', title: 'Comparison', icon: 'swap-horizontal-outline' }] : []),
    { key: 'notes', title: 'Notes', icon: 'create-outline' },
    { key: 'signatures', title: 'Signatures', icon: 'pencil-outline' },
  ];

  const takePhoto = async (category: string, item: string) => {
    // Mock photo taking - in real app, use expo-image-picker
    Alert.alert('Camera', `Taking photo for ${category} - ${item}`);
    // Implementation would involve expo-image-picker here
  };

  const markDamage = (x: number, y: number) => {
    setSelectedDamageLocation({ x, y });
    setShowDamageModal(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Vehicle Inspection</Text>
          <Text style={styles.headerSubtitle}>#{inspectionData.bookingId} • {inspectionData.vehicleName}</Text>
        </View>
        
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {inspectionData.inspectionType === 'pre-trip' ? 'Pre-trip' : 'Post-trip'}
          </Text>
        </View>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>• Take photos of any existing damage</Text>
        <Text style={styles.instructionText}>• This protects you from false claims</Text>
        <Text style={styles.instructionText}>• Owner will also document condition</Text>
      </View>
    </View>
  );

  const renderSectionTabs = () => (
    <View style={styles.sectionTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[
              styles.sectionTab,
              activeSection === section.key && styles.activeSectionTab
            ]}
            onPress={() => setActiveSection(section.key)}
          >
            <Ionicons 
              name={section.icon as any} 
              size={16} 
              color={activeSection === section.key ? Colors.text.white : Colors.text.secondary} 
            />
            <Text style={[
              styles.sectionTabText,
              activeSection === section.key && styles.activeSectionTabText
            ]}>
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderExteriorSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Exterior 360° Photos</Text>
      <Text style={styles.sectionSubtitle}>Take photos from all angles</Text>
      
      {Object.entries(inspectionData.exterior).map(([key, value]) => (
        <View key={key} style={styles.photoItem}>
          <View style={styles.photoHeader}>
            <Text style={styles.photoLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)} View
            </Text>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => takePhoto('exterior', key)}
            >
              <Ionicons name="camera" size={16} color={Colors.primary.teal} />
              <Text style={styles.cameraButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          
          {value.photo ? (
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={(event) => {
                const { locationX, locationY } = event.nativeEvent;
                markDamage(locationX, locationY);
              }}
            >
              <Image source={{ uri: value.photo }} style={styles.photo} />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoOverlayText}>Tap to mark damage</Text>
              </View>
              {value.damages.map((damage, index) => (
                <View
                  key={index}
                  style={[
                    styles.damageMarker,
                    { left: damage.x - 10, top: damage.y - 10 }
                  ]}
                >
                  <Text style={styles.damageMarkerText}>{index + 1}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={40} color={Colors.text.light} />
              <Text style={styles.photoPlaceholderText}>No photo taken</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderInteriorSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Interior Inspection</Text>
      <Text style={styles.sectionSubtitle}>Document interior condition</Text>
      
      {Object.entries(inspectionData.interior).map(([key, value]) => (
        <View key={key} style={styles.interiorItem}>
          <View style={styles.photoHeader}>
            <Text style={styles.photoLabel}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Text>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => takePhoto('interior', key)}
            >
              <Ionicons name="camera" size={16} color={Colors.primary.teal} />
              <Text style={styles.cameraButtonText}>Photo</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.conditionInput}
            placeholder="Note any stains, tears, or damage..."
            value={value.condition}
            onChangeText={(text) => {
              setInspectionData(prev => ({
                ...prev,
                interior: {
                  ...prev.interior,
                  [key]: { ...prev.interior[key as keyof typeof prev.interior], condition: text }
                }
              }));
            }}
            multiline
            placeholderTextColor={Colors.text.secondary}
          />
        </View>
      ))}
    </View>
  );

  const renderFunctionalSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Functional Check</Text>
      <Text style={styles.sectionSubtitle}>Test all systems (Pass/Fail)</Text>
      
      {Object.entries(inspectionData.functionalCheck).map(([key, value]) => (
        <View key={key} style={styles.functionalItem}>
          <Text style={styles.functionalLabel}>
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} working
          </Text>
          <View style={styles.functionalButtons}>
            <TouchableOpacity
              style={[
                styles.functionalButton,
                value === true && styles.functionalButtonActive,
                value === true && styles.functionalButtonPass
              ]}
              onPress={() => {
                setInspectionData(prev => ({
                  ...prev,
                  functionalCheck: {
                    ...prev.functionalCheck,
                    [key]: true
                  }
                }));
              }}
            >
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={value === true ? Colors.text.white : Colors.functional.success} 
              />
              <Text style={[
                styles.functionalButtonText,
                value === true && styles.functionalButtonTextActive
              ]}>Pass</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.functionalButton,
                value === false && styles.functionalButtonActive,
                value === false && styles.functionalButtonFail
              ]}
              onPress={() => {
                setInspectionData(prev => ({
                  ...prev,
                  functionalCheck: {
                    ...prev.functionalCheck,
                    [key]: false
                  }
                }));
              }}
            >
              <Ionicons 
                name="close" 
                size={16} 
                color={value === false ? Colors.text.white : Colors.functional.error} 
              />
              <Text style={[
                styles.functionalButtonText,
                value === false && styles.functionalButtonTextActive
              ]}>Fail</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTiresSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Tires & Spare</Text>
      
      <View style={styles.tiresGrid}>
        {[1, 2, 3, 4].map((tire) => (
          <View key={tire} style={styles.tireItem}>
            <Text style={styles.tireLabel}>Tire {tire}</Text>
            <TouchableOpacity 
              style={styles.tireCameraButton}
              onPress={() => takePhoto('tire', `tire${tire}`)}
            >
              <Ionicons name="camera" size={20} color={Colors.primary.teal} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <View style={styles.spareSection}>
        <View style={styles.checkboxItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              inspectionData.tiresAndSpare.spareTire && styles.checkboxActive
            ]}
            onPress={() => {
              setInspectionData(prev => ({
                ...prev,
                tiresAndSpare: {
                  ...prev.tiresAndSpare,
                  spareTire: !prev.tiresAndSpare.spareTire
                }
              }));
            }}
          >
            {inspectionData.tiresAndSpare.spareTire && (
              <Ionicons name="checkmark" size={14} color={Colors.text.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Spare tire present</Text>
        </View>
        
        <View style={styles.checkboxItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              inspectionData.tiresAndSpare.toolsPresent && styles.checkboxActive
            ]}
            onPress={() => {
              setInspectionData(prev => ({
                ...prev,
                tiresAndSpare: {
                  ...prev.tiresAndSpare,
                  toolsPresent: !prev.tiresAndSpare.toolsPresent
                }
              }));
            }}
          >
            {inspectionData.tiresAndSpare.toolsPresent && (
              <Ionicons name="checkmark" size={14} color={Colors.text.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Tools present</Text>
        </View>
      </View>
    </View>
  );

  const renderDocumentsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Documents Check</Text>
      
      {Object.entries(inspectionData.documents).map(([key, value]) => (
        <View key={key} style={styles.documentItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              value && styles.checkboxActive
            ]}
            onPress={() => {
              setInspectionData(prev => ({
                ...prev,
                documents: {
                  ...prev.documents,
                  [key]: !prev.documents[key as keyof typeof prev.documents]
                }
              }));
            }}
          >
            {value && (
              <Ionicons name="checkmark" size={14} color={Colors.text.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            {key === 'rcBook' ? 'RC Book present' :
             key === 'insurance' ? 'Insurance papers present' :
             key === 'pollution' ? 'Pollution certificate present' :
             'Emergency contacts provided'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderFuelSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Fuel & Odometer</Text>
      
      <View style={styles.fuelItem}>
        <Text style={styles.fuelLabel}>Fuel Level Photo</Text>
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={() => takePhoto('fuel', 'gauge')}
        >
          <Ionicons name="camera" size={16} color={Colors.primary.teal} />
          <Text style={styles.cameraButtonText}>Photo Gauge</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.fuelSlider}>
        <Text style={styles.fuelSliderLabel}>Current Fuel Level: {inspectionData.fuelAndOdometer.fuelLevel}%</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderText}>Empty</Text>
          <View style={styles.slider}>
            <View 
              style={[
                styles.sliderFill, 
                { width: `${inspectionData.fuelAndOdometer.fuelLevel}%` }
              ]} 
            />
            <TouchableOpacity 
              style={[
                styles.sliderThumb, 
                { left: `${inspectionData.fuelAndOdometer.fuelLevel - 2}%` }
              ]}
            />
          </View>
          <Text style={styles.sliderText}>Full</Text>
        </View>
      </View>
      
      <View style={styles.odometerSection}>
        <Text style={styles.odometerLabel}>Odometer Reading</Text>
        <View style={styles.odometerInput}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter reading (km)"
            value={inspectionData.fuelAndOdometer.odometerReading}
            onChangeText={(text) => {
              setInspectionData(prev => ({
                ...prev,
                fuelAndOdometer: {
                  ...prev.fuelAndOdometer,
                  odometerReading: text
                }
              }));
            }}
            keyboardType="numeric"
            placeholderTextColor={Colors.text.secondary}
          />
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={() => takePhoto('odometer', 'reading')}
          >
            <Ionicons name="camera" size={16} color={Colors.primary.teal} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.checkboxItem}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            inspectionData.fuelAndOdometer.tripMeterReset && styles.checkboxActive
          ]}
          onPress={() => {
            setInspectionData(prev => ({
              ...prev,
              fuelAndOdometer: {
                ...prev.fuelAndOdometer,
                tripMeterReset: !prev.fuelAndOdometer.tripMeterReset
              }
            }));
          }}
        >
          {inspectionData.fuelAndOdometer.tripMeterReset && (
            <Ionicons name="checkmark" size={14} color={Colors.text.white} />
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Trip meter reset</Text>
      </View>
    </View>
  );

  const renderCleanlinessSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Cleanliness</Text>
      
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Overall Cleanliness Rating</Text>
        <View style={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => {
                setInspectionData(prev => ({
                  ...prev,
                  cleanliness: {
                    ...prev.cleanliness,
                    overallRating: star
                  }
                }));
              }}
            >
              <Ionicons
                name={star <= inspectionData.cleanliness.overallRating ? "star" : "star-outline"}
                size={24}
                color={star <= inspectionData.cleanliness.overallRating ? "#FFD700" : Colors.text.light}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.cleanlinessChecks}>
        <View style={styles.checkboxItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              inspectionData.cleanliness.interiorClean && styles.checkboxActive
            ]}
            onPress={() => {
              setInspectionData(prev => ({
                ...prev,
                cleanliness: {
                  ...prev.cleanliness,
                  interiorClean: !prev.cleanliness.interiorClean
                }
              }));
            }}
          >
            {inspectionData.cleanliness.interiorClean && (
              <Ionicons name="checkmark" size={14} color={Colors.text.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Interior clean</Text>
        </View>
        
        <View style={styles.checkboxItem}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              inspectionData.cleanliness.exteriorClean && styles.checkboxActive
            ]}
            onPress={() => {
              setInspectionData(prev => ({
                ...prev,
                cleanliness: {
                  ...prev.cleanliness,
                  exteriorClean: !prev.cleanliness.exteriorClean
                }
              }));
            }}
          >
            {inspectionData.cleanliness.exteriorClean && (
              <Ionicons name="checkmark" size={14} color={Colors.text.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Exterior clean</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.concernsButton}>
        <Ionicons name="camera" size={16} color={Colors.primary.teal} />
        <Text style={styles.concernsButtonText}>Photo if concerns</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotesSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Additional Notes</Text>
      
      <TextInput
        style={styles.notesInput}
        placeholder="Any observations or concerns..."
        value={inspectionData.additionalNotes}
        onChangeText={(text) => {
          setInspectionData(prev => ({
            ...prev,
            additionalNotes: text
          }));
        }}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        placeholderTextColor={Colors.text.secondary}
      />
      
      <View style={styles.checkboxItem}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            inspectionData.noIssuesFound && styles.checkboxActive
          ]}
          onPress={() => {
            setInspectionData(prev => ({
              ...prev,
              noIssuesFound: !prev.noIssuesFound
            }));
          }}
        >
          {inspectionData.noIssuesFound && (
            <Ionicons name="checkmark" size={14} color={Colors.text.white} />
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>No issues found</Text>
      </View>
    </View>
  );

  const renderSignaturesSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Digital Signatures</Text>
      
      <View style={styles.signatureSection}>
        <Text style={styles.signatureLabel}>Your Signature</Text>
        <TouchableOpacity 
          style={styles.signatureBox}
          onPress={() => {
            setSignatureType('customer');
            setShowSignaturePad(true);
          }}
        >
          {inspectionData.signatures.customer ? (
            <View style={styles.signatureSaved}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.functional.success} />
              <Text style={styles.signatureSavedText}>Signature saved</Text>
            </View>
          ) : (
            <Text style={styles.signaturePlaceholder}>Tap to sign</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.signatureSection}>
        <Text style={styles.signatureLabel}>Owner's Signature (if present)</Text>
        <TouchableOpacity 
          style={styles.signatureBox}
          onPress={() => {
            setSignatureType('owner');
            setShowSignaturePad(true);
          }}
        >
          {inspectionData.signatures.owner ? (
            <View style={styles.signatureSaved}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.functional.success} />
              <Text style={styles.signatureSavedText}>Owner signed</Text>
            </View>
          ) : (
            <Text style={styles.signaturePlaceholder}>Waiting for owner...</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.checkboxItem}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            inspectionData.signatures.confirmed && styles.checkboxActive
          ]}
          onPress={() => {
            setInspectionData(prev => ({
              ...prev,
              signatures: {
                ...prev.signatures,
                confirmed: !prev.signatures.confirmed
              }
            }));
          }}
        >
          {inspectionData.signatures.confirmed && (
            <Ionicons name="checkmark" size={14} color={Colors.text.white} />
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I confirm vehicle condition</Text>
      </View>
    </View>
  );

  const renderComparisonSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Pre vs Post Comparison</Text>
      <Text style={styles.sectionSubtitle}>Side-by-side view of vehicle condition</Text>
      
      <View style={styles.comparisonContainer}>
        <Text style={styles.comparisonTitle}>Exterior Views</Text>
        
        {Object.entries(inspectionData.exterior).map(([key, value]) => (
          <View key={key} style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)} View
            </Text>
            
            <View style={styles.comparisonImages}>
              <View style={styles.comparisonImageContainer}>
                <Text style={styles.comparisonImageLabel}>Pre-trip</Text>
                <View style={styles.comparisonImage}>
                  <Ionicons name="image-outline" size={40} color={Colors.text.light} />
                  <Text style={styles.comparisonImageText}>Before</Text>
                </View>
              </View>
              
              <View style={styles.comparisonDivider} />
              
              <View style={styles.comparisonImageContainer}>
                <Text style={styles.comparisonImageLabel}>Post-trip</Text>
                <View style={styles.comparisonImage}>
                  <Ionicons name="image-outline" size={40} color={Colors.text.light} />
                  <Text style={styles.comparisonImageText}>After</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.damageStatus}>
              <View style={styles.damageIndicator}>
                <View style={[styles.damageIcon, styles.damageIconSafe]}>
                  <Ionicons name="checkmark" size={12} color={Colors.text.white} />
                </View>
                <Text style={styles.damageStatusText}>No new damage detected</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.confirmationSection}>
          <TouchableOpacity style={styles.confirmationButton}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.functional.success} />
            <Text style={styles.confirmationText}>Confirm: No new damage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDamageModal = () => (
    <Modal
      visible={showDamageModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDamageModal(false)}
    >
      <SafeAreaView style={styles.damageModal}>
        <View style={styles.damageHeader}>
          <TouchableOpacity onPress={() => setShowDamageModal(false)}>
            <Text style={styles.damageCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.damageTitle}>Mark Damage</Text>
          <TouchableOpacity>
            <Text style={styles.damageSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.damageContent}>
          <Text style={styles.damageSection}>Damage Type</Text>
          {['Scratch', 'Dent', 'Crack', 'Paint chip', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.damageOption,
                damageType === type && styles.damageOptionSelected
              ]}
              onPress={() => setDamageType(type)}
            >
              <Text style={styles.damageOptionText}>{type}</Text>
              <View style={[
                styles.radioButton,
                damageType === type && styles.radioButtonSelected
              ]}>
                {damageType === type && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.damageSection}>Severity</Text>
          {['Minor', 'Major'].map((severity) => (
            <TouchableOpacity
              key={severity}
              style={[
                styles.damageOption,
                damageSeverity === severity && styles.damageOptionSelected
              ]}
              onPress={() => setDamageSeverity(severity)}
            >
              <Text style={styles.damageOptionText}>{severity}</Text>
              <View style={[
                styles.radioButton,
                damageSeverity === severity && styles.radioButtonSelected
              ]}>
                {damageSeverity === severity && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.damageSection}>Additional Notes</Text>
          <TextInput
            style={styles.damageNoteInput}
            placeholder="Describe the damage..."
            value={damageNote}
            onChangeText={setDamageNote}
            multiline
            placeholderTextColor={Colors.text.secondary}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'exterior':
        return renderExteriorSection();
      case 'interior':
        return renderInteriorSection();
      case 'functional':
        return renderFunctionalSection();
      case 'tires':
        return renderTiresSection();
      case 'documents':
        return renderDocumentsSection();
      case 'fuel':
        return renderFuelSection();
      case 'cleanliness':
        return renderCleanlinessSection();
      case 'comparison':
        return renderComparisonSection();
      case 'notes':
        return renderNotesSection();
      case 'signatures':
        return renderSignaturesSection();
      default:
        return renderExteriorSection();
    }
  };

  const renderBottomActions = () => (
    <View style={styles.bottomActions}>
      <TouchableOpacity style={styles.draftButton}>
        <Text style={styles.draftButtonText}>Save Draft</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => {
          Alert.alert(
            'Complete Inspection',
            'Are you sure you want to submit the inspection? This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Submit', 
                onPress: () => {
                  Alert.alert('Success', 'Inspection completed successfully!\n\n• Inspection report generated\n• PDF sent to email\n• Stored in trip details');
                }
              }
            ]
          );
        }}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.completeGradient}
        >
          <Text style={styles.completeButtonText}>Complete Inspection</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const handleSignatureSave = (signature: string) => {
    setInspectionData(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [signatureType]: signature
      }
    }));
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSectionTabs()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSectionContent()}
      </ScrollView>
      
      {renderBottomActions()}
      {renderDamageModal()}
      
      <SignaturePad
        visible={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={handleSignatureSave}
        title={signatureType === 'customer' ? 'Your Signature' : 'Owner Signature'}
      />
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
    marginBottom: 16,
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
  headerSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  stepIndicator: {
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.white,
  },
  instructions: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    gap: 4,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  sectionTabs: {
    backgroundColor: Colors.background.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    gap: 6,
  },
  activeSectionTab: {
    backgroundColor: Colors.primary.teal,
  },
  sectionTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeSectionTabText: {
    color: Colors.text.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  photoItem: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 16,
  },
  cameraButtonText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  photoOverlayText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  damageMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.functional.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  damageMarkerText: {
    color: Colors.text.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  photoPlaceholder: {
    height: 150,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  interiorItem: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conditionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text.primary,
  },
  functionalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  functionalLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  functionalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  functionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  functionalButtonActive: {
    borderColor: 'transparent',
  },
  functionalButtonPass: {
    backgroundColor: Colors.functional.success,
  },
  functionalButtonFail: {
    backgroundColor: Colors.functional.error,
  },
  functionalButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  functionalButtonTextActive: {
    color: Colors.text.white,
  },
  tiresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  tireItem: {
    width: (width - 64) / 2,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tireLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tireCameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spareSection: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary.teal,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fuelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fuelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  fuelSlider: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fuelSliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  slider: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary.teal,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary.teal,
  },
  odometerSection: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  odometerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  odometerInput: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text.primary,
  },
  ratingSection: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
  },
  cleanlinessChecks: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  concernsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  concernsButtonText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: Colors.background.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  signatureBox: {
    height: 120,
    backgroundColor: Colors.background.white,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signaturePlaceholder: {
    fontSize: 14,
    color: Colors.text.light,
  },
  signatureSaved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signatureSavedText: {
    fontSize: 14,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  comparisonContainer: {
    gap: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  comparisonItem: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  comparisonImages: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  comparisonImageContainer: {
    flex: 1,
  },
  comparisonImageLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  comparisonImage: {
    height: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  comparisonImageText: {
    fontSize: 10,
    color: Colors.text.light,
    marginTop: 4,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  damageStatus: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  damageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  damageIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  damageIconSafe: {
    backgroundColor: Colors.functional.success,
  },
  damageStatusText: {
    fontSize: 12,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  confirmationSection: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  confirmationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.functional.success,
  },
  confirmationText: {
    fontSize: 14,
    color: Colors.functional.success,
    fontWeight: '600',
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
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  completeButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  completeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  damageModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  damageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  damageCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  damageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  damageSave: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  damageContent: {
    flex: 1,
    padding: 20,
  },
  damageSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    marginTop: 20,
  },
  damageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  damageOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  damageOptionText: {
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
  damageNoteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text.primary,
  },
});
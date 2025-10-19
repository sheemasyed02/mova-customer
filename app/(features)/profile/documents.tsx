import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Document {
  id: string;
  type: 'driving_license' | 'aadhaar' | 'passport';
  status: 'verified' | 'pending' | 'rejected' | 'not_uploaded';
  number?: string;
  maskedNumber?: string;
  validTill?: string;
  imageUri?: string;
  rejectionReason?: string;
  uploadedAt?: string;
}

export default function DocumentsScreen() {
  const router = useRouter();
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'driving_license',
      status: 'verified',
      number: 'DL123456789',
      validTill: '20 Dec 2030',
      imageUri: undefined,
      uploadedAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'aadhaar',
      status: 'pending',
      number: '1234567890123',
      maskedNumber: 'XXXX XXXX 1234',
      imageUri: undefined,
      uploadedAt: '2024-01-20'
    },
    {
      id: '3',
      type: 'passport',
      status: 'not_uploaded',
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<Document | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'driving_license': return 'Driving License';
      case 'aadhaar': return 'Aadhaar Card';
      case 'passport': return 'Passport';
      default: return 'Document';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return Colors.functional.success;
      case 'pending': return Colors.functional.warning;
      case 'rejected': return Colors.functional.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'rejected': return 'close-circle';
      default: return 'document-outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified ✓';
      case 'pending': return 'Under verification (24-48 hours)';
      case 'rejected': return 'Rejected - Please re-upload';
      case 'not_uploaded': return 'Not Uploaded';
      default: return 'Unknown';
    }
  };

  const handleDocumentAction = (document: Document, action: string) => {
    switch (action) {
      case 'view':
        setSelectedDocument(document);
        setShowImageViewer(true);
        break;
      case 'upload':
      case 'reupload':
        setUploadingDocument(document);
        setShowUploadModal(true);
        break;
      case 'delete':
        Alert.alert(
          'Delete Document',
          `Are you sure you want to delete your ${getDocumentTitle(document.type)}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                setDocuments(prev => prev.map(doc => 
                  doc.id === document.id 
                    ? { ...doc, status: 'not_uploaded', imageUri: undefined, number: undefined }
                    : doc
                ));
              }
            }
          ]
        );
        break;
    }
  };

  const showDocumentActions = (document: Document) => {
    const options: string[] = [];
    const actions: string[] = [];

    if (document.status !== 'not_uploaded') {
      options.push('View Document');
      actions.push('view');
      
      options.push('Re-upload');
      actions.push('reupload');
      
      options.push('Delete');
      actions.push('delete');
    } else {
      options.push('Upload Document');
      actions.push('upload');
    }

    options.push('Cancel');

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: options.includes('Delete') ? options.indexOf('Delete') : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex < actions.length) {
            handleDocumentAction(document, actions[buttonIndex]);
          }
        }
      );
    } else {
      Alert.alert(
        getDocumentTitle(document.type),
        'Choose an action',
        [
          ...actions.map((action, index) => ({
            text: options[index],
            onPress: () => handleDocumentAction(document, action),
            style: (action === 'delete' ? 'destructive' : 'default') as 'destructive' | 'default'
          })),
          { text: 'Cancel', style: 'cancel' as 'cancel' }
        ]
      );
    }
  };

  const handleImageSelection = () => {
    const options = ['Take Photo', 'Choose from Gallery', 'Cancel'];
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await openCamera();
          } else if (buttonIndex === 1) {
            await openGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Image',
        'Choose how you want to add your document',
        [
          { text: 'Take Photo', onPress: openCamera },
          { text: 'Choose from Gallery', onPress: openGallery },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      processSelectedImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      processSelectedImage(result.assets[0].uri);
    }
  };

  const processSelectedImage = (imageUri: string) => {
    if (uploadingDocument) {
      // Simulate upload process
      setDocuments(prev => prev.map(doc => 
        doc.id === uploadingDocument.id 
          ? { 
              ...doc, 
              status: 'pending', 
              imageUri,
              uploadedAt: new Date().toISOString().split('T')[0]
            }
          : doc
      ));
      
      setShowUploadModal(false);
      setUploadingDocument(null);
      
      Alert.alert(
        'Document Uploaded',
        'Your document has been submitted for verification. You will be notified once verified.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDocumentCard = (document: Document) => (
    <TouchableOpacity
      key={document.id}
      style={styles.documentCard}
      onPress={() => showDocumentActions(document)}
    >
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{getDocumentTitle(document.type)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) + '20' }]}>
            <Ionicons 
              name={getStatusIcon(document.status) as any} 
              size={12} 
              color={getStatusColor(document.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
              {document.status === 'verified' ? 'Verified' : 
               document.status === 'pending' ? 'Pending' :
               document.status === 'rejected' ? 'Rejected' : 'Not Uploaded'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </View>

      {document.status !== 'not_uploaded' && (
        <View style={styles.documentDetails}>
          {document.type === 'driving_license' && (
            <>
              <Text style={styles.detailText}>License: {document.number}</Text>
              <Text style={styles.detailText}>Valid till: {document.validTill}</Text>
            </>
          )}
          {document.type === 'aadhaar' && (
            <Text style={styles.detailText}>Number: {document.maskedNumber}</Text>
          )}
          {document.type === 'passport' && document.number && (
            <Text style={styles.detailText}>Passport: {document.number}</Text>
          )}
          
          <View style={styles.documentPreview}>
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="document" size={24} color={Colors.primary.teal} />
              <Text style={styles.thumbnailText}>Document Preview</Text>
            </View>
          </View>
        </View>
      )}

      {document.status === 'rejected' && document.rejectionReason && (
        <View style={styles.rejectionInfo}>
          <Text style={styles.rejectionText}>Reason: {document.rejectionReason}</Text>
          <TouchableOpacity 
            style={styles.reuploadButton}
            onPress={() => handleDocumentAction(document, 'reupload')}
          >
            <Text style={styles.reuploadButtonText}>Upload Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {document.status === 'pending' && (
        <View style={styles.pendingInfo}>
          <Ionicons name="time" size={16} color={Colors.functional.warning} />
          <Text style={styles.pendingText}>Under verification (24-48 hours)</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderInfoCard = () => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Ionicons name="information-circle" size={20} color={Colors.primary.teal} />
        <Text style={styles.infoTitle}>Why We Need Documents</Text>
      </View>
      <View style={styles.infoContent}>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.functional.success} />
          <Text style={styles.infoText}>For your safety</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="document-text" size={16} color={Colors.functional.success} />
          <Text style={styles.infoText}>Legal requirement</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="heart" size={16} color={Colors.functional.success} />
          <Text style={styles.infoText}>Builds trust</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="car" size={16} color={Colors.functional.success} />
          <Text style={styles.infoText}>Required for booking</Text>
        </View>
      </View>
    </View>
  );

  const renderSecurityCard = () => (
    <View style={styles.securityCard}>
      <View style={styles.securityHeader}>
        <Ionicons name="lock-closed" size={20} color={Colors.primary.teal} />
        <Text style={styles.securityTitle}>Your documents are:</Text>
      </View>
      <View style={styles.securityContent}>
        <View style={styles.securityItem}>
          <Ionicons name="shield" size={14} color={Colors.functional.success} />
          <Text style={styles.securityText}>Encrypted</Text>
        </View>
        <View style={styles.securityItem}>
          <Ionicons name="eye-off" size={14} color={Colors.functional.success} />
          <Text style={styles.securityText}>Never shared without consent</Text>
        </View>
        <View style={styles.securityItem}>
          <Ionicons name="server" size={14} color={Colors.functional.success} />
          <Text style={styles.securityText}>Stored securely</Text>
        </View>
        <View style={styles.securityItem}>
          <Ionicons name="people" size={14} color={Colors.functional.success} />
          <Text style={styles.securityText}>Verified by trained team</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Documents</Text>
          <Text style={styles.headerSubtitle}>All documents are encrypted</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowInfoModal(true)}
        >
          <Ionicons name="information-circle-outline" size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Documents</Text>
          {documents.map(renderDocumentCard)}
        </View>

        {/* Info Cards */}
        {renderInfoCard()}
        {renderSecurityCard()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Upload {uploadingDocument ? getDocumentTitle(uploadingDocument.type) : 'Document'}
            </Text>
            <View style={styles.modalCloseButton} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.uploadGuidelines}>
              <Text style={styles.guidelinesTitle}>Quality Guidelines</Text>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                <Text style={styles.guidelineText}>Ensure all text is clear</Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                <Text style={styles.guidelineText}>No glare or blur</Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                <Text style={styles.guidelineText}>All 4 corners visible</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageSelection}
            >
              <Ionicons name="camera" size={24} color="#ffffff" />
              <Text style={styles.uploadButtonText}>Take Photo or Choose from Gallery</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        animationType="fade"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.imageViewerContainer}>
          <View style={styles.imageViewerHeader}>
            <TouchableOpacity
              style={styles.closeImageViewer}
              onPress={() => setShowImageViewer(false)}
            >
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.imageViewerTitle}>
              {selectedDocument ? getDocumentTitle(selectedDocument.type) : 'Document'}
            </Text>
          </View>
          <View style={styles.imageViewerContent}>
            <View style={styles.documentImagePlaceholder}>
              <Ionicons name="document-text" size={64} color={Colors.text.secondary} />
              <Text style={styles.documentImageText}>Document Preview</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Document Security</Text>
            <View style={styles.modalCloseButton} />
          </View>

          <ScrollView style={styles.modalContent}>
            {renderSecurityCard()}
            {renderInfoCard()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  infoButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  documentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  documentPreview: {
    marginTop: 8,
  },
  thumbnailPlaceholder: {
    height: 60,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  thumbnailText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  rejectionInfo: {
    backgroundColor: Colors.functional.error + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  rejectionText: {
    fontSize: 14,
    color: Colors.functional.error,
    marginBottom: 8,
  },
  reuploadButton: {
    backgroundColor: Colors.functional.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reuploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pendingText: {
    fontSize: 14,
    color: Colors.functional.warning,
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  infoContent: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  securityCard: {
    backgroundColor: Colors.primary.teal + '10',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.teal + '20',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  securityContent: {
    gap: 6,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    width: 60,
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.primary.teal,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  uploadGuidelines: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  uploadButton: {
    backgroundColor: Colors.primary.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeImageViewer: {
    padding: 4,
  },
  imageViewerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  imageViewerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentImageText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
});
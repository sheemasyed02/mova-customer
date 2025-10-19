import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    Share,
    StyleSheet, 
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface InspectionReportProps {
  inspectionData: any;
  onClose: () => void;
}

export default function InspectionReport({ inspectionData, onClose }: InspectionReportProps) {
  
  const shareReport = async () => {
    try {
      await Share.share({
        message: `Vehicle Inspection Report - ${inspectionData.bookingId}`,
        title: 'Vehicle Inspection Report',
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  const downloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading PDF report...');
  };

  const getInspectionSummary = () => {
    const functionalIssues = Object.values(inspectionData.functionalCheck).filter(v => v === false).length;
    const documentsPresent = Object.values(inspectionData.documents).filter(v => v === true).length;
    const totalDocuments = Object.keys(inspectionData.documents).length;
    
    return {
      functionalIssues,
      documentsPresent,
      totalDocuments,
      overallRating: inspectionData.cleanliness.overallRating,
      hasIssues: functionalIssues > 0 || documentsPresent < totalDocuments || inspectionData.cleanliness.overallRating < 3
    };
  };

  const summary = getInspectionSummary();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Inspection Report</Text>
          <Text style={styles.headerSubtitle}>#{inspectionData.bookingId}</Text>
        </View>
        
        <TouchableOpacity onPress={shareReport} style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color={Colors.primary.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              summary.hasIssues ? styles.statusIconWarning : styles.statusIconSuccess
            ]}>
              <Ionicons 
                name={summary.hasIssues ? "alert-circle" : "checkmark-circle"} 
                size={24} 
                color={Colors.text.white} 
              />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {summary.hasIssues ? 'Issues Found' : 'Inspection Passed'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {inspectionData.inspectionType === 'pre-trip' ? 'Pre-trip' : 'Post-trip'} inspection completed
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle:</Text>
            <Text style={styles.infoValue}>{inspectionData.vehicleName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking ID:</Text>
            <Text style={styles.infoValue}>{inspectionData.bookingId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Inspection Type:</Text>
            <Text style={styles.infoValue}>
              {inspectionData.inspectionType === 'pre-trip' ? 'Pre-trip' : 'Post-trip'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Summary Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{summary.functionalIssues}</Text>
              <Text style={styles.summaryLabel}>Functional Issues</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.documentsPresent}/{summary.totalDocuments}
              </Text>
              <Text style={styles.summaryLabel}>Documents Present</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{summary.overallRating}/5</Text>
              <Text style={styles.summaryLabel}>Cleanliness Rating</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {inspectionData.fuelAndOdometer.fuelLevel}%
              </Text>
              <Text style={styles.summaryLabel}>Fuel Level</Text>
            </View>
          </View>
        </View>

        {/* Functional Check Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Functional Check</Text>
          {Object.entries(inspectionData.functionalCheck).map(([key, value]) => (
            <View key={key} style={styles.checkItem}>
              <Text style={styles.checkLabel}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <View style={[
                styles.checkStatus,
                value === true ? styles.checkStatusPass : 
                value === false ? styles.checkStatusFail : styles.checkStatusPending
              ]}>
                <Ionicons 
                  name={value === true ? "checkmark" : value === false ? "close" : "help"} 
                  size={12} 
                  color={Colors.text.white} 
                />
                <Text style={styles.checkStatusText}>
                  {value === true ? 'Pass' : value === false ? 'Fail' : 'N/A'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Documents Check */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {Object.entries(inspectionData.documents).map(([key, value]) => (
            <View key={key} style={styles.checkItem}>
              <Text style={styles.checkLabel}>
                {key === 'rcBook' ? 'RC Book' :
                 key === 'insurance' ? 'Insurance Papers' :
                 key === 'pollution' ? 'Pollution Certificate' :
                 'Emergency Contacts'}
              </Text>
              <View style={[
                styles.checkStatus,
                value ? styles.checkStatusPass : styles.checkStatusFail
              ]}>
                <Ionicons 
                  name={value ? "checkmark" : "close"} 
                  size={12} 
                  color={Colors.text.white} 
                />
                <Text style={styles.checkStatusText}>
                  {value ? 'Present' : 'Missing'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Odometer Reading */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Odometer & Fuel</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Odometer Reading:</Text>
            <Text style={styles.infoValue}>
              {inspectionData.fuelAndOdometer.odometerReading || 'Not recorded'} km
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fuel Level:</Text>
            <Text style={styles.infoValue}>{inspectionData.fuelAndOdometer.fuelLevel}%</Text>
          </View>
        </View>

        {/* Additional Notes */}
        {inspectionData.additionalNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{inspectionData.additionalNotes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          <View style={styles.signaturesGrid}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Customer</Text>
              <View style={styles.signatureStatus}>
                <Ionicons 
                  name={inspectionData.signatures.customer ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={inspectionData.signatures.customer ? Colors.functional.success : Colors.text.light} 
                />
                <Text style={styles.signatureStatusText}>
                  {inspectionData.signatures.customer ? 'Signed' : 'Not signed'}
                </Text>
              </View>
            </View>
            
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Owner</Text>
              <View style={styles.signatureStatus}>
                <Ionicons 
                  name={inspectionData.signatures.owner ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={inspectionData.signatures.owner ? Colors.functional.success : Colors.text.light} 
                />
                <Text style={styles.signatureStatusText}>
                  {inspectionData.signatures.owner ? 'Signed' : 'Not signed'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadPDF}>
          <Ionicons name="download-outline" size={16} color={Colors.primary.teal} />
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareActionButton} onPress={shareReport}>
          <LinearGradient
            colors={[Colors.primary.teal, Colors.accent.blue]}
            style={styles.shareGradient}
          >
            <Ionicons name="share-outline" size={16} color={Colors.text.white} />
            <Text style={styles.shareActionButtonText}>Share Report</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  shareButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: Colors.background.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconSuccess: {
    backgroundColor: Colors.functional.success,
  },
  statusIconWarning: {
    backgroundColor: Colors.functional.warning,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  checkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  checkStatusPass: {
    backgroundColor: Colors.functional.success,
  },
  checkStatusFail: {
    backgroundColor: Colors.functional.error,
  },
  checkStatusPending: {
    backgroundColor: Colors.text.light,
  },
  checkStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.white,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  signaturesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  signatureBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  signatureStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signatureStatusText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  footerSpace: {
    height: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  shareActionButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  shareActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
});
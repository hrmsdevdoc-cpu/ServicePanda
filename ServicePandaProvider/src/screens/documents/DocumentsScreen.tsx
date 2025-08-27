const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { launchImageLibrary, launchCamera } = require('react-native-image-picker');
const ApiService = require('../../services/api');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const DocumentsScreen = ({ onNavigate, onBack }) => {
  const [documentFiles, setDocumentFiles] = useState({
    license: null,
    policeCheck: null,
    insuranceCertificate: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState({
    license: { name: 'License Document', uploadedDate: '8/5/2025', hasDocument: true },
    policeCheck: { name: 'Police Check', uploadedDate: '8/5/2025', hasDocument: true },
    insuranceCertificate: { name: 'Insurance Certificate', uploadedDate: '8/5/2025', hasDocument: true },
  });

  const handleDocumentSelect = async (documentType, source = 'library') => {
    try {
      let result;
      
      if (source === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        });
      } else {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        });
      }

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Create a file object compatible with FormData
        const fileObj = {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `document_${Date.now()}.jpg`,
          size: file.fileSize || 0,
        };

        setDocumentFiles(prev => ({
          ...prev,
          [documentType]: fileObj
        }));
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const removeDocument = (documentType) => {
    setDocumentFiles(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const uploadDocuments = async () => {
    try {
      // Check if at least one document is selected
      const hasDocuments = Object.values(documentFiles).some(doc => doc !== null);
      
      if (!hasDocuments) {
        Alert.alert('No Documents Selected', 'Please select at least one document to upload.');
        return;
      }

      setIsUploading(true);

      // Get provider ID from AsyncStorage
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) {
        throw new Error('Provider information not found.');
      }

      // Create FormData
      const formData = new FormData();
      
      if (documentFiles.license) {
        formData.append('license', documentFiles.license);
      }
      if (documentFiles.policeCheck) {
        formData.append('policeCheck', documentFiles.policeCheck);
      }
      if (documentFiles.insuranceCertificate) {
        formData.append('insuranceCertificate', documentFiles.insuranceCertificate);
      }

      // Upload documents
      await ApiService.uploadDocuments(providerId, formData);

      // Show success message
      Alert.alert(
        'Success!', 
        'Your documents have been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setDocumentFiles({
                license: null,
                policeCheck: null,
                insuranceCertificate: null,
              });
            }
          }
        ]
      );

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload documents. Please try again.';
      Alert.alert('Upload Error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const ExistingDocumentCard = ({ title, uploadedDate, hasDocument }) => (
    <Card style={styles.existingDocCard}>
      <Card.Content style={styles.existingDocContent}>
        <View style={styles.existingDocInfo}>
          <Text style={styles.existingDocIcon}>📄</Text>
          <View style={styles.existingDocText}>
            <Text style={styles.existingDocTitle}>{title}</Text>
            <Text style={styles.existingDocDate}>Uploaded: {uploadedDate}</Text>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={() => Alert.alert('View Document', `Viewing ${title}`)}
          style={styles.viewButton}
          icon="eye"
        >
          View
        </Button>
      </Card.Content>
    </Card>
  );

  const UpdateDocumentSection = ({ title, documentType }) => {
    const document = documentFiles[documentType];
    
    return (
      <View style={styles.updateDocSection}>
        <Text style={styles.updateDocTitle}>{title}</Text>
        <Text style={styles.updateDocSubtitle}>Choose File</Text>
        
        {!document ? (
          <View style={styles.uploadArea}>
            <Text style={styles.uploadIcon}>☁️</Text>
            <Text style={styles.uploadText}>PDF, JPG, PNG (10MB max)</Text>
            <Text style={styles.uploadFormats}>Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)</Text>
            <Button
              mode="contained"
              onPress={() => handleDocumentSelect(documentType, 'library')}
              style={styles.chooseFilesButton}
              disabled={isUploading}
            >
              Choose Files
            </Button>
          </View>
        ) : (
          <View style={styles.selectedDocument}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{document.name}</Text>
              <Text style={styles.documentSize}>
                {document.size ? `${(document.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeDocument(documentType)}
              style={styles.removeButton}
              disabled={isUploading}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Existing Documents Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Existing Documents</Title>
        <View style={styles.existingDocsContainer}>
          <ExistingDocumentCard
            title="License Document"
            uploadedDate="8/5/2025"
            hasDocument={true}
          />
          <ExistingDocumentCard
            title="Police Check"
            uploadedDate="8/5/2025"
            hasDocument={true}
          />
          <ExistingDocumentCard
            title="Insurance Certificate"
            uploadedDate="8/5/2025"
            hasDocument={true}
          />
        </View>
      </View>

      {/* Update Documents Section */}
      <View style={styles.section}>
        <View style={styles.updateSectionHeader}>
          <Text style={styles.updateSectionIcon}>📤</Text>
          <Title style={styles.sectionTitle}>Update Documents</Title>
        </View>
        <Paragraph style={styles.updateSectionDescription}>
          Upload new versions of your documents. You can update individual documents as needed.
        </Paragraph>
        
        <View style={styles.updateDocsContainer}>
          <UpdateDocumentSection
            title="License Document"
            documentType="license"
          />
          <UpdateDocumentSection
            title="Police Check"
            documentType="policeCheck"
          />
          <UpdateDocumentSection
            title="Insurance Certificate"
            documentType="insuranceCertificate"
          />
        </View>
      </View>

      {/* Upload Button */}
      <View style={styles.uploadSection}>
        <Button
          mode="contained"
          onPress={uploadDocuments}
          disabled={isUploading || !Object.values(documentFiles).some(doc => doc !== null)}
          style={styles.uploadAllButton}
          loading={isUploading}
        >
          {isUploading ? 'Updating...' : 'Update Documents'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  updateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  updateSectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  updateSectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  existingDocsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  existingDocCard: {
    elevation: 1,
    backgroundColor: '#f8f9fa',
  },
  existingDocContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  existingDocInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  existingDocIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  existingDocText: {
    flex: 1,
  },
  existingDocTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  existingDocDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  viewButton: {
    backgroundColor: colors.primary,
  },
  updateDocsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  updateDocSection: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
  },
  updateDocTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  updateDocSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  uploadArea: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadFormats: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  chooseFilesButton: {
    backgroundColor: colors.primary,
  },
  selectedDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  uploadSection: {
    padding: 16,
    alignItems: 'center',
  },
  uploadAllButton: {
    width: '100%',
    marginBottom: 16,
    paddingVertical: 8,
  },
});

module.exports = DocumentsScreen;








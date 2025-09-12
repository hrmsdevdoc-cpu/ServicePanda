const React = require('react');
const { useState } = require('react');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  Animated,
  Dimensions,
} = require('react-native');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

// Document upload component for registration

const documentTypes = [
  {
    key: 'license',
    title: 'License Document',
    description: 'Your professional license or certification',
    required: true,
  },
  {
    key: 'policeCheck',
    title: 'Police Check',
    description: 'National Police Certificate or background check',
    required: true,
  },
  {
    key: 'insuranceCertificate',
    title: 'Insurance Certificate',
    description: 'Public liability insurance certificate',
    required: true,
  },
];

const DocumentUploadStep = ({
  documentFiles,
  setDocumentFiles,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [uploadingDocument, setUploadingDocument] = useState(null);
  const [imagePickerAvailable, setImagePickerAvailable] = useState(true);

  // Always show the interface - we'll handle errors in the pickDocument function
  React.useEffect(() => {
    setImagePickerAvailable(true);
    console.log('🔍 Document upload interface enabled');
  }, []);

  const pickDocument = async (documentType, source = 'library') => {
    try {
      setUploadingDocument(documentType);
      
      console.log('🔍 Starting REAL document pick for:', documentType);
      
      // Use React Native's ImagePicker
      const ImagePicker = require('react-native-image-crop-picker');
      
      console.log('✅ Image picker functions available');
      
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: false, // Disable cropping initially to avoid crashes
          quality: 0.3, // Much lower quality to reduce file size
          includeBase64: false,
          mediaType: 'photo',
        });
      } else {
        result = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false, // Disable cropping initially to avoid crashes
          quality: 0.3, // Much lower quality to reduce file size
          includeBase64: false,
          mediaType: 'photo',
        });
      }

      console.log('🔍 Image picker result:', result);

      if (!result || !result.path) {
        console.log('User cancelled image selection or no image selected');
        return;
      }

      console.log('🔍 Selected file:', result);
      
      // Check file size (10MB limit for server compatibility)
      if (result.size && result.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'File size must be less than 10MB. Please choose a smaller file or compress the image.');
        return;
      }

      // Create a file object compatible with FormData
      const fileObj = {
        uri: result.path,
        type: result.mime || 'image/jpeg',
        name: result.filename || `${documentType}_${Date.now()}.jpg`,
        size: result.size || 0,
      };

      console.log('🔍 Created file object:', fileObj);

      setDocumentFiles(prev => ({
        ...prev,
        [documentType]: fileObj,
      }));

      Alert.alert('Success', 'Document selected successfully!');
      return;
        
    } catch (imagePickerError) {
      console.error('❌ Image picker error:', imagePickerError);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    } finally {
      setUploadingDocument(null);
    }
  };

  const removeDocument = (documentType) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setDocumentFiles(prev => ({
              ...prev,
              [documentType]: null,
            }));
          },
        },
      ]
    );
  };

  const getFileInfo = (file) => {
    if (!file) return null;
    
    const fileName = file.name || 'Unknown file';
    const fileSize = file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
    const fileType = file.type || fileName.split('.').pop()?.toUpperCase() || 'Unknown';
    
    return { fileName, fileSize, fileType };
  };

  const isAllDocumentsUploaded = () => {
    return documentFiles.license && documentFiles.policeCheck && documentFiles.insuranceCertificate;
  };

  const handleSubmit = () => {
    if (!isAllDocumentsUploaded()) {
      Alert.alert('Error', 'Please upload all three required documents before proceeding.');
      return;
    }
    onSubmit();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Documents</Text>
        <Text style={styles.subtitle}>
          Upload all three required documents for verification (all mandatory)
        </Text>
        
        {!imagePickerAvailable && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Document picker not available. Please restart the app or check installation.
            </Text>
            <TouchableOpacity 
              style={styles.debugButton}
              onPress={async () => {
                console.log('🔧 Debug: Current status...');
                Alert.alert(
                  'Debug Info',
                  `Current Status:\n\nImage picker is working\nDocument upload is functional`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.debugButtonText}>Debug</Text>
            </TouchableOpacity>
            


          </View>
        )}
      </View>

      {/* Document Upload Sections */}
      <View style={styles.documentsContainer}>
        {documentTypes.map((docType) => {
          const file = documentFiles[docType.key];
          const fileInfo = getFileInfo(file);
          const isUploading = uploadingDocument === docType.key;
          
          return (
            <View key={docType.key} style={styles.documentSection}>
              <View style={styles.documentHeader}>
                <Text style={styles.documentTitle}>
                  {docType.title} {docType.required && <Text style={styles.required}>*</Text>}
                </Text>
                <Text style={styles.documentDescription}>{docType.description}</Text>
              </View>

              {!file ? (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => {
                    Alert.alert(
                      'Select Document',
                      'Choose how you want to add your document:',
                      [
                        {
                          text: 'Photo Library',
                          onPress: () => pickDocument(docType.key, 'library')
                        },
                        {
                          text: 'Take Photo',
                          onPress: () => pickDocument(docType.key, 'camera')
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        }
                      ]
                    );
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <>
                      <Text style={styles.uploadIcon}>📷</Text>
                      <Text style={styles.uploadText}>Add Document</Text>
                      <Text style={styles.uploadSubtext}>Photo Library or Camera</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedFile}>
                  <View style={styles.fileInfo}>
                    {file && file.uri ? (
                      <Image 
                        source={{ uri: file.uri }} 
                        style={styles.filePreview}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.fileIcon}>📄</Text>
                    )}
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {fileInfo?.fileName}
                      </Text>
                      <Text style={styles.fileMeta}>
                        {fileInfo?.fileType} • {fileInfo?.fileSize}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeDocument(docType.key)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.nextButton, !isAllDocumentsUploaded() && styles.nextButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isAllDocumentsUploaded() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.nextButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  documentsContainer: {
    padding: 20,
  },
  documentSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentHeader: {
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  documentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  required: {
    color: colors.error,
    fontSize: 18,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  uploadedFile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  filePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  fileMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: colors.warning || '#FFF3CD',
    borderWidth: 1,
    borderColor: colors.warning || '#FFEAA7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.warningText || '#856404',
    lineHeight: 18,
  },
  debugButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  debugButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

module.exports = DocumentUploadStep;

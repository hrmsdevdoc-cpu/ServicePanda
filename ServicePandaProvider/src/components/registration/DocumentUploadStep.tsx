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
} = require('react-native');
const { colors } = require('../../utils/theme');

// Import image picker with proper error handling (same as DocumentsScreen)
let launchImageLibrary = null;
let launchCamera = null;

try {
  const ImagePicker = require('react-native-image-picker');
  launchImageLibrary = ImagePicker.launchImageLibrary;
  launchCamera = ImagePicker.launchCamera;
  console.log('Image picker imported successfully');
} catch (error) {
  console.error('Failed to import image picker:', error);
}

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

  const pickDocument = async (documentType, source = 'library') => {
    try {
      setUploadingDocument(documentType);
      
      console.log('🔍 Starting document pick for:', documentType, 'from:', source);
      
      // Check if image picker functions are available
      if (!launchImageLibrary || !launchCamera) {
        Alert.alert(
          'Image Picker Not Available', 
          'The image picker module is not properly installed. Please restart the app or check the installation.',
          [{ text: 'OK' }]
        );
        return;
      }

      let result;
      
      if (source === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
          saveToPhotos: false,
        });
      } else {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
          selectionLimit: 1,
        });
      }

      console.log('🔍 Image picker result:', result);

      if (result.didCancel) {
        console.log('User cancelled image selection');
        return;
      }

      if (result.errorCode) {
        console.error('Image picker error:', result.errorCode, result.errorMessage);
        
        // Handle specific error codes
        let errorMessage = 'Failed to select document. ';
        
        switch (result.errorCode) {
          case 'camera_unavailable':
            errorMessage += 'Camera is not available on this device.';
            break;
          case 'permission':
            errorMessage += 'Permission denied. Please grant camera/photo library access.';
            break;
          case 'others':
            errorMessage += 'Unknown error occurred.';
            break;
          default:
            errorMessage += result.errorMessage || 'Please try again.';
        }
        
        Alert.alert('Selection Error', errorMessage, [{ text: 'OK' }]);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('🔍 Selected file:', file);
        
        // Check file size (10MB limit)
        if (file.fileSize && file.fileSize > 10 * 1024 * 1024) {
          Alert.alert('Error', 'File size must be less than 10MB. Please choose a smaller file.');
          return;
        }

        // Create a file object compatible with FormData (same as DocumentsScreen)
        const fileObj = {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `document_${Date.now()}.jpg`,
          size: file.fileSize || 0,
        };

        console.log('🔍 Created file object:', fileObj);

        setDocumentFiles(prev => ({
          ...prev,
          [documentType]: fileObj,
        }));

        // Removed success alert - user can see the uploaded file in the UI
      } else {
        console.log('No assets found in result');
        Alert.alert('No File Selected', 'Please select a file to continue.');
      }
    } catch (error) {
      console.error('❌ Document pick error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      Alert.alert('Error', `Failed to pick document: ${error.message || 'Unknown error'}. Please try again.`);
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
                      'Select Source',
                      'Choose how you want to add your document:',
                      [
                        {
                          text: 'Photo Library',
                          onPress: () => pickDocument(docType.key, 'library')
                        },
                        {
                          text: 'Camera',
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
                      <Text style={styles.uploadSubtext}>Camera or Photo Library</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedFile}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileIcon}>📄</Text>
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
});

module.exports = DocumentUploadStep;

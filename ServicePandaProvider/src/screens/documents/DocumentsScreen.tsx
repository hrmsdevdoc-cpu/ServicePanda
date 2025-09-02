const React = require('react');
const { useState, useEffect } = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, ActivityIndicator, Linking } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');
// Import image picker with proper error handling
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
const ApiService = require('../../services/api');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const DocumentsScreen = ({ onNavigate, onBack }) => {
  const [documentFiles, setDocumentFiles] = useState({
    license: null,
    policeCheck: null,
    insuranceCertificate: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [existingDocuments, setExistingDocuments] = useState({
    license: null,
    policeCheck: null,
    insuranceCertificate: null,
  });
  const [providerId, setProviderId] = useState(null);

  // Fetch existing documents when component mounts
  useEffect(() => {
    // Get provider ID from AsyncStorage first (same as web version)
    const getProviderId = async () => {
      try {
        const storedProviderId = await AsyncStorage.getItem('providerId');
        console.log('🔍 DocumentsScreen - Initial providerId from AsyncStorage:', storedProviderId);
        
        if (storedProviderId) {
          // Convert to number to ensure proper API calls
          const numericProviderId = parseInt(storedProviderId, 10);
          console.log('🔍 DocumentsScreen - Converted providerId to number:', numericProviderId);
          setProviderId(numericProviderId);
          // Now fetch documents with the numeric provider ID
          await fetchExistingDocuments(numericProviderId);
        } else {
          console.log('❌ DocumentsScreen - No providerId found in AsyncStorage');
          setIsLoadingDocuments(false);
        }
      } catch (error) {
        console.error('❌ DocumentsScreen - Error getting providerId:', error);
        setIsLoadingDocuments(false);
      }
    };
    
    getProviderId();
  }, []);

  const fetchExistingDocuments = async (providerIdParam: number | null = null) => {
    try {
      setIsLoadingDocuments(true);
      
      // Use provided providerId or get from state
      const currentProviderId = providerIdParam || providerId;
      console.log('🔍 DocumentsScreen - Using providerId:', currentProviderId);
      
      if (!currentProviderId) {
        console.log('❌ Provider ID not found, skipping document fetch');
        setIsLoadingDocuments(false);
        return;
      }

      // Fetch documents from API (same endpoint as web app)
      console.log('🔍 DocumentsScreen - Calling API with providerId:', currentProviderId);
      console.log('🔍 DocumentsScreen - API endpoint: /api/service-providers/${currentProviderId}/documents');
      
      const documents = await ApiService.getDocuments(currentProviderId);
      console.log('✅ DocumentsScreen - API response:', documents);
      console.log('✅ DocumentsScreen - API response type:', typeof documents);
      console.log('✅ DocumentsScreen - API response isArray:', Array.isArray(documents));

      // Map API response to our document structure - DYNAMIC LIST FROM REAL DATA
      const mappedDocs = {
        license: null,
        policeCheck: null,
        insuranceCertificate: null,
      };

      if (documents && Array.isArray(documents)) {
        console.log('✅ DocumentsScreen - Processing', documents.length, 'documents');
        
        // Sort documents by upload date (newest first)
        const sortedDocuments = documents.sort((a, b) => {
          const dateA = new Date(a.uploadedAt || a.createdAt || 0);
          const dateB = new Date(b.uploadedAt || b.createdAt || 0);
          return dateB - dateA; // Newest first
        });
        
        console.log('✅ DocumentsScreen - Sorted documents (newest first):', sortedDocuments);
        
        // Process each document type and get the LATEST one
        sortedDocuments.forEach((doc, index) => {
          console.log(`✅ DocumentsScreen - Document ${index + 1}:`, doc);
          
          // Map document types correctly
          if (doc.documentType === 'license' && !mappedDocs.license) {
            mappedDocs.license = {
              id: doc.id,
              name: doc.fileName || 'License Document',
              uploadedDate: formatDate(doc.uploadedAt || doc.createdAt),
              hasDocument: true,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              filePath: doc.filePath,
              fileName: doc.fileName,
            };
            console.log('✅ DocumentsScreen - Latest License:', mappedDocs.license);
          } else if (doc.documentType === 'police_check' && !mappedDocs.policeCheck) {
            mappedDocs.policeCheck = {
              id: doc.id,
              name: doc.fileName || 'Police Check',
              uploadedDate: formatDate(doc.uploadedAt || doc.createdAt),
              hasDocument: true,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              filePath: doc.filePath,
              fileName: doc.fileName,
            };
            console.log('✅ DocumentsScreen - Latest Police Check:', mappedDocs.policeCheck);
          } else if (doc.documentType === 'insurance' && !mappedDocs.insuranceCertificate) {
            mappedDocs.insuranceCertificate = {
              id: doc.id,
              name: doc.fileName || 'Insurance Certificate',
              uploadedDate: formatDate(doc.uploadedAt || doc.createdAt),
              hasDocument: true,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              filePath: doc.filePath,
              fileName: doc.fileName,
            };
            console.log('✅ DocumentsScreen - Latest Insurance:', mappedDocs.insuranceCertificate);
          }
        });
      }

      console.log('✅ Final mapped documents:', mappedDocs);

      console.log('Mapped documents:', mappedDocs);
      setExistingDocuments(mappedDocs);
    } catch (error) {
      console.error('Error fetching existing documents:', error);
      // Don't show error to user, just log it
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      const kb = bytes / 1024;
      return `${kb.toFixed(2)} KB`;
    }
  };



  // This function calls the exact same API as your web app
  const handleViewDocument = async (document, title) => {
    if (!document || !document.hasDocument) {
      Alert.alert('No Document', `No ${title} document has been uploaded yet.`);
      return;
    }

    try {
      // Get provider ID from AsyncStorage
      const providerId = await AsyncStorage.getItem('providerId');
      if (!providerId) {
        Alert.alert('Error', 'Provider information not found.');
        return;
      }

      // Extract filename from filePath or use fileName (same logic as web app)
      let filename = document.fileName;
      if (document.filePath) {
        // Extract filename from path (same logic as web app)
        // Handle both forward slashes and backslashes
        const pathSeparator = document.filePath.includes('\\') ? '\\' : '/';
        filename = document.filePath.split(pathSeparator).pop();
      }

      if (!filename) {
        Alert.alert('Error', 'Document filename not found.');
        return;
      }

      console.log('🔍 Original filePath:', document.filePath);
      console.log('🔍 Extracted filename:', filename);

      // Construct the document view URL (EXACT SAME as web app)
      const documentViewUrl = `http://192.168.1.39:4000/api/provider/documents/view/${filename}/${providerId}`;
      
      console.log('🔍 FULL DOCUMENT URL:', documentViewUrl);
      console.log('🔍 API Base URL:', 'http://192.168.1.39:4000');
      console.log('🔍 Filename:', filename);
      console.log('🔍 Provider ID:', providerId);

      // Open document in external browser/app (same as web app behavior)
      const supported = await Linking.canOpenURL(documentViewUrl);
      
      if (supported) {
        await Linking.openURL(documentViewUrl);
        console.log('Document opened successfully in external viewer');
      } else {
              // Fallback: show document details with FULL URL
      Alert.alert('Document Details', 
        `File: ${document.name}\nSize: ${formatFileSize(document.fileSize)}\nType: ${document.mimeType}\n\nFULL URL: ${documentViewUrl}\n\nDocument will open in external viewer.`
      );
      }

    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Failed to open document. Please try again.');
    }
  };

  const handleDocumentSelect = async (documentType, source = 'library') => {
    try {
      console.log(`Opening ${source} for ${documentType}...`);
      
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

      console.log('Image picker result:', result);

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
        console.log('Selected file:', file);
        
        // Create a file object compatible with FormData
        // For React Native, we need to create a proper file object
        const fileObj = {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `document_${Date.now()}.jpg`,
          size: file.fileSize || 0,
        };

        console.log('Created file object:', fileObj);

        setDocumentFiles(prev => ({
          ...prev,
          [documentType]: fileObj
        }));
        
        console.log(`Document ${documentType} selected successfully`);
      } else {
        console.log('No assets found in result');
        Alert.alert('No File Selected', 'Please select a file to continue.');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      
      // More specific error handling
      let errorMessage = 'Failed to select document. ';
      
      if (error.message) {
        errorMessage += error.message;
      } else if (error.code) {
        errorMessage += `Error code: ${error.code}`;
      } else {
        errorMessage += 'Please try again.';
      }
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
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

      // Use provider ID from state (same as web version)
      if (!providerId) {
        throw new Error('Provider information not found. Please complete registration first.');
      }

      // Create FormData for React Native - WORKING VERSION
      const formData = new FormData();
      
      console.log('Creating FormData with files:', documentFiles);
      
      if (documentFiles.license) {
        console.log('Adding license file:', documentFiles.license);
        
        // Validate file URI
        if (!documentFiles.license.uri) {
          throw new Error('License file URI is missing');
        }
        
        // React Native FormData - WORKING STRUCTURE
        const licenseFile = {
          uri: documentFiles.license.uri,
          type: documentFiles.license.type || 'image/jpeg',
          name: documentFiles.license.name || 'license.jpg',
        };
        console.log('License file object:', licenseFile);
        formData.append('license', licenseFile);
      }
      
      if (documentFiles.policeCheck) {
        console.log('Adding policeCheck file:', documentFiles.policeCheck);
        
        // Validate file URI
        if (!documentFiles.policeCheck.uri) {
          throw new Error('Police check file URI is missing');
        }
        
        const policeFile = {
          uri: documentFiles.policeCheck.uri,
          type: documentFiles.policeCheck.type || 'image/jpeg',
          name: documentFiles.policeCheck.name || 'police_check.jpg',
        };
        console.log('Police file object:', policeFile);
        formData.append('policeCheck', policeFile);
      }
      
      if (documentFiles.insuranceCertificate) {
        console.log('Adding insurance file:', documentFiles.insuranceCertificate);
        
        // Validate file URI
        if (!documentFiles.insuranceCertificate.uri) {
          throw new Error('Insurance certificate file URI is missing');
        }
        
        const insuranceFile = {
          uri: documentFiles.insuranceCertificate.uri,
          type: documentFiles.insuranceCertificate.type || 'image/jpeg',
          name: documentFiles.insuranceCertificate.name || 'insurance.jpg',
        };
        console.log('Insurance file object:', insuranceFile);
        formData.append('insuranceCertificate', insuranceFile);
      }
      
      console.log('FormData created successfully');
      console.log('Files being uploaded:');
      if (documentFiles.license) {
        console.log('License file:', {
          uri: documentFiles.license.uri,
          type: documentFiles.license.type,
          name: documentFiles.license.name,
          size: documentFiles.license.size
        });
      }
      if (documentFiles.policeCheck) {
        console.log('Police Check file:', {
          uri: documentFiles.policeCheck.uri,
          type: documentFiles.policeCheck.type,
          name: documentFiles.policeCheck.name,
          size: documentFiles.policeCheck.size
        });
      }
      if (documentFiles.insuranceCertificate) {
        console.log('Insurance file:', {
          uri: documentFiles.insuranceCertificate.uri,
          type: documentFiles.insuranceCertificate.type,
          name: documentFiles.insuranceCertificate.name,
          size: documentFiles.insuranceCertificate.size
        });
      }

      // Upload documents using FormData (fixed for React Native)
      console.log('About to upload to providerId:', providerId);
      
      // Upload documents using FormData (fixed for React Native)
      console.log('About to upload to providerId:', providerId);
      console.log('FormData object:', formData);
      console.log('FormData type:', typeof formData);
      console.log('FormData constructor:', formData.constructor.name);
      
      // Log the actual FormData content
      console.log('=== FORM DATA DEBUG ===');
      console.log('FormData keys:');
      if (formData._parts) {
        console.log('FormData _parts:', formData._parts);
      }
      if (formData.getParts) {
        console.log('FormData getParts():', formData.getParts());
      }
      console.log('=== END FORM DATA DEBUG ===');
      
      try {
        // Try FormData first
        const result = await ApiService.uploadDocuments(providerId, formData);
        console.log('Upload result:', result);
        return result;
      } catch (formDataError) {
        console.log('FormData upload failed, trying alternative method:', formDataError);
        
        // Fallback: Use direct fetch with proper file handling
        console.log('Trying direct fetch approach...');
        
        // Create a working multipart request using Blob
        const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
        let multipartBody = '';
        
        if (documentFiles.license) {
          multipartBody += `--${boundary}\r\n`;
          multipartBody += `Content-Disposition: form-data; name="license"; filename="${documentFiles.license.name}"\r\n`;
          multipartBody += `Content-Type: ${documentFiles.license.type || 'image/jpeg'}\r\n\r\n`;
          multipartBody += `file://${documentFiles.license.uri}\r\n`;
        }
        
        if (documentFiles.policeCheck) {
          multipartBody += `--${boundary}\r\n`;
          multipartBody += `Content-Disposition: form-data; name="policeCheck"; filename="${documentFiles.policeCheck.name}"\r\n`;
          multipartBody += `Content-Type: ${documentFiles.policeCheck.type || 'image/jpeg'}\r\n\r\n`;
          multipartBody += `file://${documentFiles.policeCheck.uri}\r\n`;
        }
        
        if (documentFiles.insuranceCertificate) {
          multipartBody += `--${boundary}\r\n`;
          multipartBody += `Content-Disposition: form-data; name="insuranceCertificate"; filename="${documentFiles.insuranceCertificate.name}"\r\n`;
          multipartBody += `Content-Type: ${documentFiles.insuranceCertificate.type || 'image/jpeg'}\r\n\r\n`;
          multipartBody += `file://${documentFiles.insuranceCertificate.uri}\r\n`;
        }
        
        multipartBody += `--${boundary}--\r\n`;
        
        console.log('Multipart body created:', multipartBody);
        
        // Try direct fetch
        const response = await fetch(`${ApiService.API_BASE_URL}/api/service-providers/${providerId}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Accept': 'application/json',
            'x-provider-id': providerId,
          },
          body: multipartBody,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Direct fetch failed: ${errorData.message || `HTTP ${response.status}`}`);
        }
        
        const result = await response.json();
        console.log('Direct fetch upload result:', result);
        return result;
      }

      // Show success message
      Alert.alert(
        'Success!', 
        'Your documents have been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form and refresh existing documents
              setDocumentFiles({
                license: null,
                policeCheck: null,
                insuranceCertificate: null,
              });
              // Refresh the existing documents list
              fetchExistingDocuments();
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

  const ExistingDocumentCard = ({ title, document, documentType }) => {
    if (!document || !document.hasDocument) {
      return (
        <Card style={styles.existingDocCard}>
          <Card.Content style={styles.existingDocContent}>
            <View style={styles.existingDocInfo}>
              <Text style={styles.existingDocIcon}>📄</Text>
              <View style={styles.existingDocText}>
                <Text style={styles.existingDocTitle}>{title}</Text>
                <Text style={styles.existingDocDate}>No document uploaded yet</Text>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Upload Required', `Please upload a ${title} document.`)}
              style={styles.uploadRequiredButton}
              disabled={true}
            >
              Upload Required
            </Button>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.existingDocCard}>
        <Card.Content style={styles.existingDocContent}>
          <View style={styles.existingDocInfo}>
            <Text style={styles.existingDocIcon}>📄</Text>
            <View style={styles.existingDocText}>
              <Text style={styles.existingDocTitle}>{document.name}</Text>
              <Text style={styles.existingDocDate}>Uploaded: {document.uploadedDate}</Text>
              {document.fileSize && (
                <Text style={styles.existingDocSize}>{formatFileSize(document.fileSize)}</Text>
              )}
            </View>
          </View>
          <Button
            mode="contained"
            onPress={() => handleViewDocument(document, title)}
            style={styles.viewButton}
            icon="eye"
          >
            View
          </Button>
        </Card.Content>
      </Card>
    );
  };

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
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleDocumentSelect(documentType, 'library')}
                style={[styles.chooseFilesButton, styles.halfWidth]}
                disabled={isUploading}
              >
                📁 Gallery
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDocumentSelect(documentType, 'camera')}
                style={[styles.cameraButton, styles.halfWidth]}
                disabled={isUploading}
              >
                📷 Camera
              </Button>
            </View>
            <Text style={styles.buttonHint}>
              Tap Gallery to select from photos, or Camera to take a new photo
            </Text>

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
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionIcon}>📄</Text>
            <Title style={styles.sectionTitle}>Existing Documents</Title>
          </View>
          <TouchableOpacity onPress={fetchExistingDocuments} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
        
        {isLoadingDocuments ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading documents...</Text>
          </View>
        ) : (
          <View style={styles.existingDocsContainer}>
            <ExistingDocumentCard
              title="License Document"
              document={existingDocuments.license}
              documentType="license"
            />
            <ExistingDocumentCard
              title="Police Check"
              document={existingDocuments.policeCheck}
              documentType="policeCheck"
            />
            <ExistingDocumentCard
              title="Insurance Certificate"
              document={existingDocuments.insuranceCertificate}
              documentType="insuranceCertificate"
            />
          </View>
        )}
      </View>

      {/* Update Documents Section */}
      <View style={styles.section}>
        <View style={styles.updateSectionHeader}>
          <Text style={styles.sectionIcon}>📤</Text>
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
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  refreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.primary + '20',
    borderRadius: 6,
  },
  refreshButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textSecondary,
  },
  existingDocsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  existingDocCard: {
    elevation: 1,
    backgroundColor: colors.surface,
    marginBottom: 8,
    borderRadius: 8,
  },
  existingDocContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  existingDocInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  existingDocIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  existingDocText: {
    flex: 1,
  },
  existingDocTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  existingDocDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  existingDocSize: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  uploadRequiredButton: {
    borderColor: colors.textSecondary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  updateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  updateSectionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  updateDocsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  updateDocSection: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
  },
  updateDocTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  updateDocSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  uploadArea: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadFormats: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  chooseFilesButton: {
    backgroundColor: colors.primary,
    flex: 1,
    paddingVertical: 6,
  },
  cameraButton: {
    borderColor: colors.primary,
    flex: 1,
    paddingVertical: 6,
  },
  halfWidth: {
    flex: 1,
  },
  buttonHint: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary + '10',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  removeButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 11,
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








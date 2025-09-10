const React = require('react');
const { useState, useEffect } = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, ActivityIndicator, Linking, Image } = require('react-native');
const { Title, Paragraph, Card, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');
// Import image crop picker with proper error handling and fallback
let ImagePicker = null;

try {
  ImagePicker = require('react-native-image-crop-picker');
  console.log('✅ Image crop picker imported successfully');
} catch (error) {
  console.error('❌ Failed to import image crop picker:', error);
}

// Function to check if image picker is available
const isImagePickerAvailable = () => {
  return ImagePicker !== null;
};
const ApiService = require('../../services/api');

const { API_BASE_URL } = require('../../config/api');

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
  const [viewingDocument, setViewingDocument] = useState(null);


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

      // Use the original filename that was uploaded (not the hashed one)
      // The admin panel uses original filenames like "1757504052321.jpg"
      let filename = document.name || document.fileName;
      
      // If we have a filePath, try to extract the original filename
      if (document.filePath) {
        const pathSeparator = document.filePath.includes('\\') ? '\\' : '/';
        const extractedFilename = document.filePath.split(pathSeparator).pop();
        
        // Always prefer the document name over filePath for viewing
        // The server expects the original filename for the view endpoint
        if (document.name) {
          filename = document.name;
        } else if (document.fileName) {
          filename = document.fileName;
        } else {
          filename = extractedFilename;
        }
      }

      if (!filename) {
        Alert.alert('Error', 'Document filename not found.');
        return;
      }

      console.log('🔍 Document object:', document);
      console.log('🔍 Original filePath:', document.filePath);
      console.log('🔍 Original fileName:', document.fileName);
      console.log('🔍 Document name:', document.name);
      console.log('🔍 Final filename to use:', filename);

      // Construct the document view URL (EXACT SAME as web app)
      const { API_BASE_URL } = require('../../config/api');
      const documentViewUrl = `${API_BASE_URL}/api/provider/documents/view/${filename}/${providerId}`;
      
      console.log('🔍 FULL DOCUMENT URL:', documentViewUrl);
      console.log('🔍 API Base URL:', API_BASE_URL);
      console.log('🔍 Filename:', filename);
      console.log('🔍 Provider ID:', providerId);

      // For images, show them inline instead of opening externally
      if (document.mimeType && document.mimeType.startsWith('image/')) {
        console.log('📸 Opening image inline:', documentViewUrl);
        
        // Show the image in our inline viewer
        setViewingDocument({
          title: document.name,
          fileName: document.name,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          viewUrl: documentViewUrl
        });
      } else {
        // For non-images, try to open externally
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
      if (!isImagePickerAvailable()) {
        console.error('❌ Image crop picker not available');
        Alert.alert(
          'Image Picker Not Available', 
          'The image picker module is not properly installed. Please:\n\n1. Restart the app\n2. Check if react-native-image-crop-picker is installed\n3. Try running: npx react-native run-android',
          [
            { text: 'OK' },
            { 
              text: 'Retry', 
              onPress: () => {
                // Try to re-import the image picker
                try {
                  ImagePicker = require('react-native-image-crop-picker');
                  console.log('✅ Image crop picker re-imported successfully');
                  // Retry the document pick
                  handleDocumentSelect(documentType, source);
                } catch (retryError) {
                  console.error('❌ Retry failed:', retryError);
                }
              }
            }
          ]
        );
        return;
      }
      
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: false, // Disable cropping initially to avoid crashes
          quality: 0.8,
          includeBase64: false,
          mediaType: 'photo',
        });
      } else {
        result = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false, // Disable cropping initially to avoid crashes
          quality: 0.8,
          includeBase64: false,
          mediaType: 'photo',
        });
      }

      console.log('Image picker result:', result);

      if (!result || !result.path) {
        console.log('User cancelled image selection or no image selected');
        return;
      }

      // Create a file object compatible with FormData
      // For react-native-image-crop-picker, result has different structure
      const fileObj = {
        uri: result.path,
        type: result.mime || 'image/jpeg',
        name: result.filename || `document_${Date.now()}.jpg`,
        size: result.size || 0,
      };

      console.log('Created file object:', fileObj);

      setDocumentFiles(prev => ({
        ...prev,
        [documentType]: fileObj
      }));
      
      console.log(`Document ${documentType} selected successfully`);
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
      {/* Simple Image Viewer Modal */}
      {viewingDocument && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{viewingDocument.title}</Text>
              <TouchableOpacity 
                onPress={() => setViewingDocument(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageContainer}>
              <Text style={styles.imageFileName}>{viewingDocument.fileName}</Text>
              <Text style={styles.imageInfo}>
                Size: {formatFileSize(viewingDocument.fileSize)} | Type: {viewingDocument.mimeType}
              </Text>
              
              <View style={styles.imageViewContainer}>
                <Image
                  source={{ uri: viewingDocument.viewUrl }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={() => setViewingDocument(null)}
                style={styles.closeModalButton}
              >
                Close
              </Button>
            </View>
          </View>
        </View>
      )}
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
    elevation: 3,
    backgroundColor: colors.surface,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  existingDocContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  existingDocInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  existingDocIcon: {
    fontSize: 24,
    marginRight: 12,
    color: colors.primary,
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
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  existingDocSize: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  uploadRequiredButton: {
    borderColor: colors.textSecondary,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
  // Simple modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',

    maxHeight: '40%',
    marginTop: -800, // smaller top space



  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.error + '15',
  },
  closeButtonText: {
    color: colors.error,
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageFileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  imageInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageViewContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    // marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  documentImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    resizeMode: 'contain',
    maxHeight: 300,
  },
  modalFooter: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  closeModalButton: {
    minWidth: 100,
  },
});

module.exports = DocumentsScreen;








const React = require('react');
const { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions, Linking } = require('react-native');
const { colors } = require('../utils/theme');

const { width, height } = Dimensions.get('window');

const ProfessionalListModal = ({ visible, onClose, professionals, serviceRequest }) => {
  
  // Don't return null - always render the modal if visible
  if (!visible) {
    return null;
  }

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderProfessional = (professional, index) => (
    <View key={professional.id || index} style={styles.professionalCard}>
      <View style={styles.professionalHeader}>
        <View style={styles.professionalInfo}>
          <Text style={styles.serviceName}>{professional.serviceName}</Text>
          <Text style={styles.professionalName}>{professional.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {professional.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactText}>{professional.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactText}>{professional.phone}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => handleCall(professional.phone)}
        >
          <Text style={styles.callButtonIcon}>📞</Text>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.emailButton}
          onPress={() => handleEmail(professional.email)}
        >
          <Text style={styles.emailButtonIcon}>📧</Text>
          <Text style={styles.emailButtonText}>Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.acceptanceInfo}>
        <Text style={styles.acceptanceIcon}>📅</Text>
        <Text style={styles.acceptanceText}>Accepted on {professional.acceptedDate}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Professionals Who Accepted Your Service Request</Text>
              <Text style={styles.subtitle}>
                {professionals.length} professional{professionals.length > 1 ? 's' : ''} accepted your {serviceRequest?.category || 'service'} request.
              </Text>
            </View>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {(() => {
              console.log('🔍 Modal rendering professionals:', professionals);
              console.log('🔍 Professionals length:', professionals?.length);
              console.log('🔍 Professionals type:', typeof professionals);
              console.log('🔍 Is array:', Array.isArray(professionals));
              
              if (professionals && professionals.length > 0) {
                console.log('🔍 Rendering professional cards');
                return professionals.map(renderProfessional);
              } else {
                console.log('🔍 Rendering empty state');
                return (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>👥</Text>
                    <Text style={styles.emptyStateTitle}>No Professionals Yet</Text>
                    <Text style={styles.emptyStateSubtitle}>
                      No professionals have accepted this service request yet. Check back later!
                    </Text>
                    <Text style={styles.emptyStateSubtitle}>
                      Debug: professionals = {JSON.stringify(professionals)}
                    </Text>
                  </View>
                );
              }
            })()}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.closeActionButton} onPress={onClose}>
              <Text style={styles.closeActionButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalContent: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  professionalCard: {
    backgroundColor: colors.success + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  professionalHeader: {
    marginBottom: 12,
  },
  professionalInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  callButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  acceptanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  acceptanceIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  acceptanceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeActionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeActionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

module.exports = ProfessionalListModal;

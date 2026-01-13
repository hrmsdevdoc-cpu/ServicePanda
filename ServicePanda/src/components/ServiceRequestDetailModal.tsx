const React = require('react');
const { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } = require('react-native');
const { colors } = require('../utils/theme');

const { width, height } = Dimensions.get('window');

const ServiceRequestDetailModal = ({ visible, onClose, request }) => {
  if (!request) return null;

  const renderDetailRow = (label, value, isStatus = false) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      {isStatus ? (
        <View style={[styles.statusBadge, { backgroundColor: request.statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: request.statusColor }]}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
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
            <Text style={styles.modalTitle}>Service Request Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {renderDetailRow('Service Category', request.category)}
            {renderDetailRow('Status', request.status, true)}
            {renderDetailRow('Location', request.location)}
            {renderDetailRow('Booking Type', request.bookingType || 'Regular')}
            {renderDetailRow('Request Date', request.date)}
            {renderDetailRow('Preferred Date', request.preferredDate || request.date)}
            
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{request.description}</Text>
            </View>

            <View style={styles.providerSection}>
              <Text style={styles.sectionTitle}>Provider Information</Text>
              {renderDetailRow('Provider Name', request.provider)}
              {renderDetailRow('Rating', `⭐ ${request.providerRating}`)}
              {renderDetailRow('Estimated Cost', request.estimatedCost)}
              {renderDetailRow('Contact', request.providerContact || 'Contact via app')}
            </View>

          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>Close</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
    maxHeight: height * 0.6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionSection: {
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  providerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

module.exports = ServiceRequestDetailModal;

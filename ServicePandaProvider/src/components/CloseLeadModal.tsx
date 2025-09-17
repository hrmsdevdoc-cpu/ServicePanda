const React = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Modal } = require('react-native');
const { colors } = require('../utils/theme');

interface CloseLeadModalProps {
  visible: boolean;
  lead: any;
  onClose: () => void;
  onConfirm: (isJobBooked: boolean) => void;
}

function CloseLeadModal({ 
  visible, 
  lead, 
  onClose, 
  onConfirm 
}: CloseLeadModalProps) {
  if (!lead) return null;

  const handleConfirm = (isJobBooked: boolean) => {
    onConfirm(isJobBooked);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Close Lead</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Instruction Text */}
            <Text style={styles.instructionText}>
              You're about to close this lead. Please let us know:
            </Text>

            {/* Lead Information Card */}
            <View style={styles.leadInfoCard}>
              <Text style={styles.leadTitle}>
                {lead.categoryName} - {lead.suburb}
              </Text>
              <Text style={styles.customerName}>
                Customer: {lead.customerName || 'N/A'}
              </Text>
            </View>

            {/* Question */}
            <Text style={styles.questionText}>Was this job booked?</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.noButton} 
                onPress={() => handleConfirm(false)}
              >
                <Text style={styles.noButtonText}>No, Not Booked</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.yesButton} 
                onPress={() => handleConfirm(true)}
              >
                <Text style={styles.yesButtonText}>Yes, Job Booked!</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Text */}
            <Text style={styles.footerText}>
              This lead will be moved to your closed leads and removed from active leads.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  leadInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  noButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  noButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  yesButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

module.exports = CloseLeadModal;

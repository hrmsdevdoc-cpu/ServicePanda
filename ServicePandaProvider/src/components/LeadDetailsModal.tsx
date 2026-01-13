const React = require('react');
const { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView, Linking } = require('react-native');
const { colors } = require('../utils/theme');

interface LeadDetailsModalProps {
  visible: boolean;
  lead: any;
  onClose: () => void;
  onCallCustomer: (phone: string) => void;
  onSendSMS: (phone: string) => void;
  onSendEmail: (email: string) => void;
}

function LeadDetailsModal({ 
  visible, 
  lead, 
  onClose, 
  onCallCustomer, 
  onSendSMS, 
  onSendEmail 
}: LeadDetailsModalProps) {
  if (!lead) return null;

  const handleCall = () => {
    if (lead.customerPhone) {
      onCallCustomer(lead.customerPhone);
    }
  };

  const handleSMS = () => {
    if (lead.customerPhone) {
      onSendSMS(lead.customerPhone);
    }
  };

  const handleEmail = () => {
    if (lead.customerEmail) {
      onSendEmail(lead.customerEmail);
    }
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
            <Text style={styles.modalTitle}>{lead.categoryName || 'Lead Details'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Status and Price */}
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Purchased</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>${lead.leadCost || 0}</Text>
              </View>
            </View>

            {/* Customer Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Contact</Text>
              
              {lead.customerEmail && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>✉️</Text>
                  <Text style={styles.contactText}>{lead.customerEmail}</Text>
                </View>
              )}
              
              {lead.customerPhone && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>📞</Text>
                  <Text style={styles.contactText}>{lead.customerPhone}</Text>
                </View>
              )}
            </View>

            {/* Job Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Details</Text>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📍</Text>
                <Text style={styles.contactText}>
                  {lead.suburb}, {lead.postcode}
                </Text>
              </View>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📅</Text>
                <Text style={styles.contactText}>
                  Purchased: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Job Description */}
            {lead.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.descriptionText}>{lead.description}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]} 
              onPress={handleCall}
            >
              <Text style={styles.actionButtonIcon}>📞</Text>
              <Text style={styles.actionButtonText}>Call Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.smsButton]} 
              onPress={handleSMS}
            >
              <Text style={styles.actionButtonIcon}>💬</Text>
              <Text style={styles.actionButtonText}>Send SMS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.emailButton]} 
              onPress={handleEmail}
            >
              <Text style={styles.actionButtonIcon}>✉️</Text>
              <Text style={styles.actionButtonText}>Send Email</Text>
            </TouchableOpacity>
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
    maxHeight: '80%',
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
    paddingVertical: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  priceBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  callButton: {
    backgroundColor: '#007AFF',
  },
  smsButton: {
    backgroundColor: colors.success,
  },
  emailButton: {
    backgroundColor: '#8E44AD',
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

module.exports = LeadDetailsModal;

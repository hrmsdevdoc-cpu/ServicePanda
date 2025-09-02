# Lead Management Features

## Overview

This document describes the new Lead Management features added to the ServicePanda admin panel. These features provide comprehensive control over the lead system, provider credit access, and service types management.

## Features Implemented

### 1. Free Lead System Toggle

**Location**: Admin Panel → Settings → Lead Management

**Description**: Allows administrators to enable or disable the free lead system for new service providers.

**Functionality**:
- **When Enabled**: New providers receive 3 free leads upon registration
- **When Disabled**: New providers must purchase all leads from the start
- **Default State**: Enabled (true)

**Impact**:
- Controls whether new providers get free leads
- Affects the provider registration flow
- Influences lead purchase behavior

### 2. Provider Credit Access Control

**Location**: Admin Panel → Settings → Lead Management

**Description**: Controls provider access to credit redemption and voucher systems.

**Functionality**:
- **When Enabled**: Providers can redeem vouchers, view credit balances, and use credits for lead purchases
- **When Disabled**: All credit and voucher features are hidden from both customers and service providers
- **Default State**: Enabled (true)

**Conditional Behavior**:
- **Customer Voucher Area**: Hidden when credits are disabled
- **SP Credits Area**: Hidden when credits are disabled
- **Provider Dashboard**: Shows "Credit System Disabled" message when disabled

### 3. Service Types Management

**Location**: Admin Panel → Settings → Lead Management

**Description**: Complete CRUD (Create, Read, Update, Delete) management for service categories.

**Features**:
- **Add New Service Types**: Create new service categories with name, icon, description
- **Edit Existing Types**: Modify name, icon, description, active status, and popularity
- **Delete Service Types**: Remove categories (with safety checks)
- **Active/Inactive Toggle**: Enable or disable service categories
- **Popular Flag**: Mark categories as popular for special display

**Safety Checks**:
- Prevents deletion of categories used by providers
- Prevents deletion of categories with associated service requests
- Validates required fields before creation/update

## Technical Implementation

### Database Schema

#### Lead Management Settings
The system uses existing tables with new system settings:

```sql
-- System settings for credit access control
INSERT INTO system_settings (key, value, description) VALUES
('providers_can_redeem_credits', 'true', 'Enable/disable provider credit access'),
('customer_voucher_area_visible', 'true', 'Show/hide customer voucher area'),
('sp_credits_area_visible', 'true', 'Show/hide service provider credits area');
```

#### Service Categories
Uses existing `service_categories` table:

```sql
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  icon VARCHAR NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### Admin Endpoints
- `GET /api/admin/lead-management-settings` - Get current settings
- `PUT /api/admin/lead-management-settings` - Update settings
- `POST /api/admin/service-categories` - Create new service category
- `PUT /api/admin/service-categories/:id` - Update service category
- `DELETE /api/admin/service-categories/:id` - Delete service category

#### Provider Endpoints
- `GET /api/provider/lead-management-settings` - Get credit visibility settings

### Frontend Components

#### AdminLeadManagement.tsx
Main admin interface for managing all lead management features:

```typescript
interface LeadManagementSettings {
  freeLeadsEnabled: boolean;
  providersCanRedeemCredits: boolean;
  customerVoucherAreaVisible: boolean;
  spCreditsAreaVisible: boolean;
}
```

#### ProviderDashboard.tsx
Updated to conditionally show/hide credit system based on settings:

```typescript
// Conditional rendering of credit system
{activeMenuItem === "credits" && leadManagementSettings?.spCreditsAreaVisible !== false && (
  <ProviderCreditSystem />
)}

// Show disabled message when credits are disabled
{activeMenuItem === "credits" && leadManagementSettings?.spCreditsAreaVisible === false && (
  <CreditSystemDisabledMessage />
)}
```

## User Interface

### Admin Panel Navigation
- **Path**: `/admin/lead-management`
- **Navigation**: Admin Sidebar → Settings → Lead Management
- **Access**: Admin authentication required

### Interface Sections

#### 1. Free Lead System
- Toggle switch for enabling/disabling free leads
- Clear description of functionality
- Visual indicators for enabled/disabled state

#### 2. Provider Credit Access
- Toggle switch for credit system access
- Warning section explaining what happens when disabled
- Clear descriptions of impact on customers and providers

#### 3. Service Types Management
- **Add New Service Type**: Form with name, icon, description, active/popular toggles
- **Existing Service Types**: List with edit/delete actions
- **Edit Mode**: Inline editing for quick updates
- **Safety Checks**: Confirmation dialogs for deletions

## Configuration Options

### Default Settings
```typescript
const defaultSettings = {
  freeLeadsEnabled: true,
  providersCanRedeemCredits: true,
  customerVoucherAreaVisible: true,
  spCreditsAreaVisible: true,
};
```

### System Settings Keys
- `providers_can_redeem_credits` - Controls provider credit access
- `customer_voucher_area_visible` - Controls customer voucher visibility
- `sp_credits_area_visible` - Controls provider credits area visibility

## Testing

### Test Script
Run `test_lead_management_features.cjs` to verify:
- Database connectivity
- Lead settings access
- System settings management
- Service category CRUD operations
- Default settings creation

### Manual Testing Checklist
- [ ] Access admin lead management page
- [ ] Toggle free lead system on/off
- [ ] Toggle provider credit access on/off
- [ ] Create new service category
- [ ] Edit existing service category
- [ ] Delete service category (with safety checks)
- [ ] Verify provider dashboard shows/hides credit system
- [ ] Test conditional visibility in provider interface

## Security Considerations

### Authentication
- All admin endpoints require admin authentication
- Provider endpoints require provider authentication
- Settings are encrypted in the database

### Data Validation
- Service category names are required
- Deletion checks prevent orphaned data
- Input sanitization for all user inputs

### Access Control
- Admin-only access to management interface
- Read-only access for providers to relevant settings
- Conditional rendering based on permissions

## Future Enhancements

### Potential Additions
1. **Audit Logging**: Track all changes to lead management settings
2. **Bulk Operations**: Mass update service categories
3. **Import/Export**: CSV import/export for service categories
4. **Advanced Permissions**: Role-based access to specific features
5. **Analytics**: Track usage of credit system and free leads

### Integration Points
- **Email Notifications**: Notify providers when credit system is disabled
- **Dashboard Widgets**: Show lead management statistics
- **Reporting**: Include lead management metrics in reports

## Troubleshooting

### Common Issues

#### Settings Not Saving
- Check admin authentication
- Verify database connectivity
- Check for validation errors

#### Service Categories Not Loading
- Verify database schema
- Check for missing dependencies
- Validate API endpoint responses

#### Provider Interface Issues
- Check lead management settings
- Verify provider authentication
- Test conditional rendering logic

### Debug Commands
```bash
# Test database connectivity
node test_lead_management_features.cjs

# Check system settings
SELECT * FROM system_settings WHERE key LIKE '%credit%';

# Verify service categories
SELECT * FROM service_categories ORDER BY name;
```

## Conclusion

The Lead Management features provide comprehensive control over the ServicePanda lead system, allowing administrators to:

1. **Control Free Lead Distribution**: Enable/disable free leads for new providers
2. **Manage Credit Access**: Control provider access to voucher and credit systems
3. **Organize Service Types**: Full CRUD management of service categories

These features enhance the platform's flexibility and provide administrators with the tools needed to optimize the lead distribution system based on business requirements. 
# Email System Testing Plan

## Test Case 1: Admin Mailgun Configuration Setup
**Objective**: Test that admin can configure Mailgun credentials
**Steps**:
1. Navigate to admin dashboard (/admin-login)
2. Login with admin credentials (username: admin, password: ServicePanda2025!)
3. Click "Configure Email (Mailgun)" button
4. Enter valid Mailgun API key (starts with 'key-')
5. Enter valid Mailgun domain
6. Submit configuration
**Expected Result**: Success message, configuration saved encrypted in database

## Test Case 2: Mailgun Configuration Validation
**Objective**: Test API key format validation
**Steps**:
1. Navigate to Mailgun configuration page
2. Enter invalid API key (not starting with 'key-')
3. Submit form
**Expected Result**: Error message "Mailgun API keys should start with 'key-'"

## Test Case 3: Mailgun Configuration Status Check
**Objective**: Test configuration status display
**Steps**:
1. Check admin settings API endpoint
2. Verify mailgunConfigured status
**Expected Result**: Status correctly reflects configuration state

## Test Case 4: Password Reset Email Flow
**Objective**: Test complete password reset email sending
**Steps**:
1. Ensure Mailgun is configured with valid credentials
2. Navigate to forgot password page (/forgot-password)
3. Enter valid user email address
4. Submit form
5. Check email inbox for reset link
**Expected Result**: 
- Success message displayed
- Email received with reset link
- Console shows "Password reset email sent successfully"

## Test Case 5: Email Service Error Handling
**Objective**: Test behavior when Mailgun credentials are missing
**Steps**:
1. Clear Mailgun configuration from database
2. Attempt password reset
**Expected Result**:
- User still sees success message (for security)
- Console shows "Mailgun not configured - missing API keys"
- No actual email sent

## Test Case 6: Email Template Content Verification
**Objective**: Test email template renders correctly
**Steps**:
1. Send password reset email
2. Check HTML and text content
**Expected Result**:
- Professional email template with ServicePanda branding
- Working reset link with proper token
- Security warning about 1-hour expiration
- Clear instructions for user

## Test Case 7: Email Service API Integration
**Objective**: Test Mailgun API integration
**Steps**:
1. Configure Mailgun with sandbox credentials
2. Send test email
3. Verify API call to Mailgun
**Expected Result**:
- Proper Basic authentication header
- Correct form data format
- Successful API response from Mailgun

## Test Case 8: Database Security
**Objective**: Test credential encryption
**Steps**:
1. Save Mailgun credentials
2. Check database directly
3. Verify credentials are encrypted
**Expected Result**: 
- API key and domain stored as encrypted values
- No plaintext credentials in database

## Test Case 9: Configuration Update Flow
**Objective**: Test updating existing Mailgun configuration
**Steps**:
1. Configure Mailgun credentials initially
2. Update with new credentials
3. Test email sending with new credentials
**Expected Result**: New credentials used for email sending

## Test Case 10: Complete Integration Test
**Objective**: Test entire forgot password flow end-to-end
**Steps**:
1. Admin configures Mailgun
2. Customer requests password reset
3. Customer receives email and clicks reset link
4. Customer successfully resets password
5. Customer logs in with new password
**Expected Result**: Complete flow works seamlessly

## Success Criteria
- ✅ All 10 test cases pass
- ✅ No console errors during email operations
- ✅ Secure credential storage verified
- ✅ Professional email templates delivered
- ✅ Integration works with real Mailgun API
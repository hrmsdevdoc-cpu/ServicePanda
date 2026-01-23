/**
 * Email signature configuration for different team members (client-side)
 * This should match the server-side emailSignatures.ts
 */

export interface EmailSignature {
  name: string;
  role: string;
  directNumber?: string;
  intlNumber: string;
  email: string;
  website: string;
}

/**
 * Signature configuration mapped by username or email
 */
export const emailSignatures: Record<string, EmailSignature> = {
  'Rohan': {
    name: 'Rohan Kannojia',
    role: 'ServicePanda Support Team',
    directNumber: '0485 873 908',
    intlNumber: '+61 7 5606 0808',
    email: 'rohan@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
  'Rohan Kanaujia': {
    name: 'Rohan Kannojia',
    role: 'ServicePanda Support Team',
    directNumber: '0485 873 908',
    intlNumber: '+61 7 5606 0808',
    email: 'rohan@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
  'rohan@servicepanda.com.au': {
    name: 'Rohan Kannojia',
    role: 'ServicePanda Support Team',
    directNumber: '0485 873 908',
    intlNumber: '+61 7 5606 0808',
    email: 'rohan@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
  'Shubham': {
    name: 'Shubham Chauhan',
    role: 'ServicePanda Support Team',
    intlNumber: '+61 7 5606 0808',
    email: 'shubham@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
  'Shubham Chauhan': {
    name: 'Shubham Chauhan',
    role: 'ServicePanda Support Team',
    intlNumber: '+61 7 5606 0808',
    email: 'shubham@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
  'shubham@servicepanda.com.au': {
    name: 'Shubham Chauhan',
    role: 'ServicePanda Support Team',
    intlNumber: '+61 7 5606 0808',
    email: 'shubham@servicepanda.com.au',
    website: 'www.servicepanda.com.au',
  },
};

/**
 * Get email signature for a user by username or email
 * @param identifier Username or email address
 * @returns EmailSignature object or null if not found
 */
export function getEmailSignature(identifier: string | null | undefined): EmailSignature | null {
  if (!identifier) {
    console.log('❌ getEmailSignature: No identifier provided');
    return null;
  }
  
  // Trim and normalize the identifier
  const normalizedIdentifier = identifier.trim();
  
  console.log('🔎 getEmailSignature: Looking for identifier:', normalizedIdentifier);
  console.log('📋 getEmailSignature: Available keys:', Object.keys(emailSignatures));
  
  // Try exact match first
  const exactMatch = emailSignatures[normalizedIdentifier];
  if (exactMatch) {
    console.log('✅ getEmailSignature: Found exact match for:', normalizedIdentifier);
    return exactMatch;
  }
  
  // Try case-insensitive match
  const lowerIdentifier = normalizedIdentifier.toLowerCase();
  for (const [key, sig] of Object.entries(emailSignatures)) {
    if (key.toLowerCase().trim() === lowerIdentifier) {
      console.log('✅ getEmailSignature: Found case-insensitive match with key:', key);
      return sig;
    }
  }
  
  console.log('❌ getEmailSignature: No match found for:', normalizedIdentifier);
  return null;
}

/**
 * Format signature for display in the UI
 * @param signature EmailSignature object
 * @returns Formatted signature JSX-ready string
 */
export function formatSignatureForDisplay(signature: EmailSignature): string {
  let text = `${signature.name} | ${signature.role}\n`;
  
  if (signature.directNumber) {
    text += `Direct Number: ${signature.directNumber} | Intl Number: ${signature.intlNumber}\n`;
  } else {
    text += `Intl Number: ${signature.intlNumber}\n`;
  }
  
  text += `Email: ${signature.email}\n`;
  text += `Website: ${signature.website}`;
  
  return text;
}

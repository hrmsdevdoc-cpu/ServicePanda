/**
 * Email signature configuration for different team members
 * Each signature is associated with a username or email address
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
  if (!identifier) return null;
  
  // Try exact match first
  const signature = emailSignatures[identifier];
  if (signature) return signature;
  
  // Try case-insensitive match
  const lowerIdentifier = identifier.toLowerCase();
  for (const [key, sig] of Object.entries(emailSignatures)) {
    if (key.toLowerCase() === lowerIdentifier) {
      return sig;
    }
  }
  
  return null;
}

/**
 * Format signature as plain text
 * @param signature EmailSignature object
 * @returns Formatted signature string
 */
export function formatSignatureText(signature: EmailSignature): string {
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

/**
 * Format signature as HTML
 * @param signature EmailSignature object
 * @returns Formatted signature HTML string
 */
export function formatSignatureHtml(signature: EmailSignature): string {
  let html = `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #4b5563; font-size: 14px; line-height: 1.6;">`;
  html += `<div style="font-weight: 500; color: #1f2937;">${signature.name} | ${signature.role}</div>`;
  
  if (signature.directNumber) {
    html += `<div>Direct Number: ${signature.directNumber} | Intl Number: ${signature.intlNumber}</div>`;
  } else {
    html += `<div>Intl Number: ${signature.intlNumber}</div>`;
  }
  
  html += `<div>Email: <a href="mailto:${signature.email}" style="color: #3b82f6; text-decoration: none;">${signature.email}</a></div>`;
  html += `<div>Website: <a href="https://${signature.website}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none;">${signature.website}</a></div>`;
  html += `</div>`;
  
  return html;
}

/**
 * Append signature to email body (both text and HTML)
 * @param body Original email body
 * @param signature EmailSignature object
 * @param isHtml Whether the body is HTML format
 * @returns Email body with signature appended
 */
export function appendSignatureToBody(
  body: string,
  signature: EmailSignature,
  isHtml: boolean = false
): string {
  if (isHtml) {
    // For HTML, append signature HTML
    return body + '\n' + formatSignatureHtml(signature);
  } else {
    // For plain text, append signature text
    return body + '\n\n' + formatSignatureText(signature);
  }
}

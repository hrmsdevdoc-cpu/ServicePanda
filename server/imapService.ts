import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { storage } from './storage';
import { createHash } from 'crypto';

// In-memory lock to prevent concurrent fetches for the same email account
const fetchLocks = new Map<string, boolean>();

// Helper function to calculate string similarity (simple Jaccard-like similarity)
function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  
  // Calculate character-level similarity
  let matches = 0;
  const minLength = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLength; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  return matches / longer.length;
}

interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  tlsOptions?: {
    rejectUnauthorized: boolean;
  };
}

interface FetchEmailOptions {
  email: string;
  password: string;
  markSeen?: boolean;
  fetchAll?: boolean; // If true, fetch all emails; if false, only unread
  folder?: string; // Default: 'INBOX'
}

/**
 * Fetch emails from IMAP server
 * @param options Email account and fetch options
 * @returns Promise with array of fetched emails
 */
export async function fetchEmailsFromImap(options: FetchEmailOptions): Promise<any[]> {
  const {
    email,
    password,
    markSeen = true,
    fetchAll = true,
    folder = 'INBOX'
  } = options;

  return new Promise((resolve, reject) => {
    const config: ImapConfig = {
      user: email,
      password: password,
      host: 'mail.servicepanda.com.au',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    };

    const imap = new Imap(config);
    const fetchedEmails: any[] = [];

    imap.once('ready', () => {
      console.log(`IMAP connection ready for ${email}`);
      
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        console.log(`Opened ${folder} box. Total messages: ${box.messages.total}`);

        // Fetch all emails or only unread
        const searchCriteria = fetchAll 
          ? ['ALL'] // Fetch all emails
          : ['UNSEEN']; // Fetch only unread emails

        imap.search(searchCriteria, (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          if (!results || results.length === 0) {
            console.log(`No emails found for ${email}`);
            imap.end();
            return resolve([]);
          }

          console.log(`Found ${results.length} emails to fetch`);

          // Fetch email data
          const fetch = imap.fetch(results, {
            bodies: '',
            struct: true
          });

          fetch.on('message', (msg, seqno) => {
            console.log(`Fetching message ${seqno}...`);

            msg.on('body', (stream, info) => {
              let buffer = '';

              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.once('end', () => {
                simpleParser(buffer, (err, parsed) => {
                  if (err) {
                    console.error(`Error parsing email ${seqno}:`, err);
                    return;
                  }

                  // Helper function to extract email address from AddressObject
                  const getEmailAddress = (addr: any): string => {
                    if (!addr) return '';
                    if (typeof addr === 'string') return addr;
                    if (Array.isArray(addr)) {
                      return addr.map((a: any) => a.address || a.text || '').filter(Boolean).join(', ');
                    }
                    return addr.address || addr.text || '';
                  };

                  const emailData = {
                    from: getEmailAddress(parsed.from) || '',
                    to: getEmailAddress(parsed.to) || '',
                    cc: parsed.cc ? getEmailAddress(parsed.cc) : null,
                    bcc: parsed.bcc ? getEmailAddress(parsed.bcc) : null,
                    subject: parsed.subject || '',
                    body: parsed.text || '',
                    bodyHtml: parsed.html || null,
                    date: parsed.date || new Date(),
                    messageId: parsed.messageId || null,
                    inReplyTo: parsed.inReplyTo || null,
                    references: Array.isArray(parsed.references) ? parsed.references.join(' ') : (parsed.references || null),
                    attachments: parsed.attachments?.map((att: any) => ({
                      filename: att.filename,
                      contentType: att.contentType,
                      size: att.size
                    })) || []
                  };

                  fetchedEmails.push(emailData);
                  console.log(`Parsed email ${seqno}: ${emailData.subject}`);
                });
              });
            });

            msg.once('attributes', (attrs) => {
              // Mark as seen if requested
              if (markSeen && attrs.uid) {
                imap.addFlags(attrs.uid, '\\Seen', (err) => {
                  if (err) {
                    console.error(`Error marking email ${attrs.uid} as seen:`, err);
                  }
                });
              }
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(err);
          });

          fetch.once('end', () => {
            console.log(`Finished fetching ${fetchedEmails.length} emails`);
            imap.end();
            resolve(fetchedEmails);
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP error:', err);
      reject(err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
    });

    imap.connect();
  });
}

/**
 * Fetch and store emails from IMAP for a specific email account
 * @param email Email address
 * @param password Email password
 * @param userId User ID to associate emails with
 * @param fetchAll Whether to fetch all emails or only unread
 */
export async function fetchAndStoreEmails(
  email: string,
  password: string,
  userId: string,
  fetchAll: boolean = true
): Promise<{ success: boolean; count: number; error?: string }> {
  // Check if a fetch is already in progress for this email account
  const lockKey = `${email}-${userId}`;
  if (fetchLocks.get(lockKey)) {
    console.log(`⚠️ Fetch already in progress for ${email}, skipping...`);
    return { 
      success: false, 
      count: 0, 
      error: 'A fetch operation is already in progress for this email account. Please wait.' 
    };
  }

  // Set lock
  fetchLocks.set(lockKey, true);
  console.log(`🔒 Acquired fetch lock for ${email}`);
  
  try {
    console.log(`Fetching emails from IMAP for ${email}...`);
    
    const fetchedEmails = await fetchEmailsFromImap({
      email,
      password,
      markSeen: true,
      fetchAll,
      folder: 'INBOX'
    });

    console.log(`Fetched ${fetchedEmails.length} emails from ${email}`);

    // Store emails in database
    let storedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const emailData of fetchedEmails) {
      try {
        let existingEmail = null;
        
        // Normalize email addresses for comparison
        const normalizedFrom = emailData.from.trim().toLowerCase();
        const normalizedTo = emailData.to.trim().toLowerCase();
        const normalizedSubject = emailData.subject.trim();
        
        // Create a content hash for more reliable duplicate detection
        const contentHash = createHash('md5')
          .update(`${normalizedFrom}|${normalizedTo}|${normalizedSubject}|${emailData.body.substring(0, 100)}|${userId}`)
          .digest('hex');
        
        // First, check by messageId if available (most reliable)
        if (emailData.messageId && emailData.messageId.trim()) {
          existingEmail = await storage.getEmailByMessageId(emailData.messageId.trim());
          if (existingEmail) {
            skippedCount++;
            console.log(`⊘ Skipped duplicate (by messageId): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        
        // Second, check by unique fields (from, to, subject, sentAt, userId)
        existingEmail = await storage.getEmailByUniqueFields(
          normalizedFrom,
          normalizedTo,
          normalizedSubject,
          emailData.date,
          userId
        );
        
        if (existingEmail) {
          skippedCount++;
          console.log(`⊘ Skipped duplicate (by unique fields): ${normalizedSubject.substring(0, 50)}`);
          continue;
        }
        
        // Third, check by subject + userId only (very aggressive - catches same email thread)
        // This is important because reply emails might have different from/to but same subject
        const existingBySubject = await storage.getEmailBySubjectAndUser(normalizedSubject, userId);
        if (existingBySubject) {
          // Double-check: compare body content to ensure it's really the same email
          const existingBodyStart = existingBySubject.body?.substring(0, 100).trim() || '';
          const currentBodyStart = emailData.body.substring(0, 100).trim();
          
          // If body starts match (at least 80% similarity), it's a duplicate
          if (existingBodyStart.length >= 20 && currentBodyStart.length >= 20) {
            const similarity = calculateStringSimilarity(existingBodyStart, currentBodyStart);
            if (similarity > 0.8) {
              skippedCount++;
              console.log(`⊘ Skipped duplicate (by subject + body similarity ${Math.round(similarity * 100)}%): ${normalizedSubject.substring(0, 50)}`);
              continue;
            }
          }
        }
        
        // Fourth, check by body content similarity (fallback for emails without messageId)
        // Check if same from+to+subject+first 100 chars of body exists
        const bodyStart = emailData.body.substring(0, 100).trim();
        if (bodyStart.length >= 20) {
          existingEmail = await storage.getEmailByContentSimilarity(
            normalizedFrom,
            normalizedTo,
            normalizedSubject,
            bodyStart,
            userId
          );
          
          if (existingEmail) {
            skippedCount++;
            console.log(`⊘ Skipped duplicate (by content similarity): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        
        // Final check right before insertion to prevent race conditions
        // Re-check by messageId one more time (in case another process just inserted it)
        if (emailData.messageId && emailData.messageId.trim()) {
          const finalCheck = await storage.getEmailByMessageId(emailData.messageId.trim());
          if (finalCheck) {
            skippedCount++;
            console.log(`⊘ Skipped duplicate (final messageId check): ${normalizedSubject.substring(0, 50)}`);
            continue;
          }
        }
        
        // Re-check by unique fields one more time
        const finalUniqueCheck = await storage.getEmailByUniqueFields(
          normalizedFrom,
          normalizedTo,
          normalizedSubject,
          emailData.date,
          userId
        );
        if (finalUniqueCheck) {
          skippedCount++;
          console.log(`⊘ Skipped duplicate (final unique fields check): ${normalizedSubject.substring(0, 50)}`);
          continue;
        }
        
        // Only store if email doesn't exist after all checks (including final checks)
        try {
          await storage.createEmail({
            from: emailData.from.trim(),
            to: emailData.to.trim(),
            cc: emailData.cc?.trim() || null,
            bcc: emailData.bcc?.trim() || null,
            subject: emailData.subject.trim(),
            body: emailData.body,
            bodyHtml: emailData.bodyHtml,
            status: 'inbox',
            folder: 'inbox',
            isRead: true, // Already marked as seen
            userId: userId,
            userType: 'admin',
            sentAt: emailData.date,
            threadId: emailData.messageId || emailData.inReplyTo || null,
          });
          storedCount++;
          console.log(`✓ Stored new email: ${normalizedSubject.substring(0, 50)} [hash: ${contentHash.substring(0, 8)}]`);
        } catch (insertError: any) {
          // If insert fails due to duplicate (e.g., unique constraint), skip it
          if (insertError?.message?.includes('duplicate') || insertError?.code === '23505') {
            skippedCount++;
            console.log(`⊘ Skipped duplicate (caught during insert): ${normalizedSubject.substring(0, 50)}`);
          } else {
            throw insertError; // Re-throw if it's a different error
          }
        }
      } catch (error: any) {
        errorCount++;
        console.error(`✗ Error storing email:`, error?.message || error);
        // Continue with next email
      }
    }
    
    console.log(`\n📧 Email storage summary for ${email}:`);
    console.log(`   ✓ New emails stored: ${storedCount}`);
    console.log(`   ⊘ Duplicates skipped: ${skippedCount}`);
    console.log(`   ✗ Errors: ${errorCount}`);
    console.log(`   Total processed: ${fetchedEmails.length}\n`);

    console.log(`Stored ${storedCount} new emails from ${email}`);
    return { success: true, count: storedCount };
  } catch (error: any) {
    console.error(`Error fetching emails from IMAP:`, error);
    return { 
      success: false, 
      count: 0, 
      error: error.message || 'Failed to fetch emails from IMAP' 
    };
  } finally {
    // Release lock
    fetchLocks.delete(lockKey);
    console.log(`🔓 Released fetch lock for ${email}`);
  }
}

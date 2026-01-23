import { fetchAndStoreEmails } from './imapService';
import { storage } from './storage';

/**
 * Email accounts configuration for cron job
 * In production, these should be stored securely in the database or environment variables
 */
interface EmailAccount {
  email: string;
  password: string;
  username?: string; // Admin username to look up user ID
  enabled: boolean;
}

// Email accounts for cron job
const EMAIL_ACCOUNTS: EmailAccount[] = [
  {
    email: 'rohan@servicepanda.com.au',
    password: 'v*Ev1}IjAKVM',
    username: 'Rohan Kanaujia', // Admin username - will be used to find user ID
    enabled: true,
  },
  {
    email: 'shubham@servicepanda.com.au',
    password: 'v*Ev1}IjAKVM',
    username: 'Shubham Chauhan', // Admin username - will be used to find user ID
    enabled: true,
  },
];

/**
 * Fetch emails for all configured email accounts
 */
export async function fetchAllEmails(): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`\n📧 [Email Cron] ========================================`);
  console.log(`📧 [Email Cron] Starting scheduled email fetch...`);
  console.log(`📧 [Email Cron] Timestamp: ${timestamp}`);
  console.log(`📧 [Email Cron] Accounts to process: ${EMAIL_ACCOUNTS.filter(a => a.enabled).length}`);
  console.log(`📧 [Email Cron] ========================================\n`);
  
  const results = await Promise.allSettled(
    EMAIL_ACCOUNTS
      .filter(account => account.enabled)
      .map(async (account, index) => {
        const accountStartTime = Date.now();
        console.log(`\n📬 [Email Cron] [${index + 1}/${EMAIL_ACCOUNTS.filter(a => a.enabled).length}] Processing: ${account.email}`);
        console.log(`📬 [Email Cron] ───────────────────────────────────────`);
        
        try {
          // Get admin user ID from email or username
          let userId = '2'; // Default fallback
          console.log(`🔍 [Email Cron] Looking up admin user for: ${account.email}...`);
          
          // First try to find by email
          const allAdminUsers = await storage.getAllAdminUsers();
          const adminUser = allAdminUsers.find(u => 
            u.email?.toLowerCase() === account.email.toLowerCase() ||
            (account.username && u.username?.toLowerCase() === account.username.toLowerCase())
          );
          
          if (adminUser) {
            userId = adminUser.id.toString();
            console.log(`✅ [Email Cron] Found admin user: ID=${userId}, Username=${adminUser.username || 'N/A'}, Email=${adminUser.email || 'N/A'}`);
          } else {
            console.warn(`⚠️ [Email Cron] Admin user not found for ${account.email}, using default userId: ${userId}`);
          }
          
          console.log(`📥 [Email Cron] Connecting to IMAP server for ${account.email}...`);
          const result = await fetchAndStoreEmails(
            account.email,
            account.password,
            userId,
            true // fetchAll = true
          );
          
          const accountDuration = Date.now() - accountStartTime;
          
          if (result.success) {
            console.log(`✅ [Email Cron] Successfully fetched ${result.count} emails from ${account.email}`);
            console.log(`⏱️  [Email Cron] Account processing time: ${accountDuration}ms`);
            console.log(`📬 [Email Cron] ───────────────────────────────────────`);
            return { email: account.email, success: true, count: result.count, duration: accountDuration };
          } else {
            console.error(`❌ [Email Cron] Failed to fetch emails from ${account.email}: ${result.error}`);
            console.log(`⏱️  [Email Cron] Account processing time: ${accountDuration}ms`);
            console.log(`📬 [Email Cron] ───────────────────────────────────────`);
            return { email: account.email, success: false, error: result.error, duration: accountDuration };
          }
        } catch (error: any) {
          const accountDuration = Date.now() - accountStartTime;
          console.error(`❌ [Email Cron] Error fetching emails from ${account.email}:`, error?.message || error);
          console.log(`⏱️  [Email Cron] Account processing time: ${accountDuration}ms`);
          console.log(`📬 [Email Cron] ───────────────────────────────────────`);
          return { email: account.email, success: false, error: error?.message || 'Unknown error', duration: accountDuration };
        }
      })
  );
  
  const duration = Date.now() - startTime;
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
  
  let totalEmails = 0;
  let totalDuration = 0;
  results.forEach(r => {
    if (r.status === 'fulfilled') {
      if (r.value.success && r.value.count) {
        totalEmails += r.value.count;
      }
      if (r.value.duration) {
        totalDuration += r.value.duration;
      }
    }
  });
  
  console.log(`\n📊 [Email Cron] ========================================`);
  console.log(`📊 [Email Cron] FETCH SUMMARY`);
  console.log(`📊 [Email Cron] ========================================`);
  console.log(`   ✅ Successful: ${successful}/${EMAIL_ACCOUNTS.filter(a => a.enabled).length}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📧 Total emails fetched: ${totalEmails}`);
  console.log(`   ⏱️  Total duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
  console.log(`   ⏱️  Average per account: ${totalDuration > 0 ? Math.round(totalDuration / EMAIL_ACCOUNTS.filter(a => a.enabled).length) : 0}ms`);
  console.log(`📊 [Email Cron] ========================================`);
  
  // Log individual results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const value = result.value;
      if (value.success) {
        console.log(`   ✅ [${index + 1}] ${value.email}: ${value.count || 0} emails (${value.duration || 0}ms)`);
      } else {
        console.log(`   ❌ [${index + 1}] ${value.email}: Failed - ${value.error || 'Unknown error'} (${value.duration || 0}ms)`);
      }
    } else {
      console.log(`   ❌ [${index + 1}] Account ${index + 1}: Rejected - ${result.reason}`);
    }
  });
  
  console.log(`📧 [Email Cron] Scheduled email fetch completed`);
  console.log(`📧 [Email Cron] ========================================\n`);
}

/**
 * Initialize email cron job
 * @param intervalMinutes - Interval in minutes (default: 15)
 */
export function initializeEmailCron(intervalMinutes: number = 15): void {
  const intervalMs = intervalMinutes * 60 * 1000;
  const intervalSeconds = Math.round(intervalMs / 1000);
  
  console.log(`\n🕐 [Email Cron] ========================================`);
  console.log(`🕐 [Email Cron] Initializing email fetch cron job...`);
  console.log(`🕐 [Email Cron] ========================================`);
  console.log(`   ⏱️  Interval: Every ${intervalSeconds} seconds (${intervalMinutes} minutes)`);
  console.log(`   📧 Accounts: ${EMAIL_ACCOUNTS.filter(a => a.enabled).length} enabled`);
  EMAIL_ACCOUNTS.filter(a => a.enabled).forEach((account, index) => {
    console.log(`   ${index + 1}. ${account.email} ${account.username ? `(${account.username})` : ''}`);
  });
  console.log(`🕐 [Email Cron] ========================================\n`);
  
  // Run immediately on startup for testing
  console.log(`🚀 [Email Cron] Running initial fetch on startup...`);
  fetchAllEmails().catch(error => {
    console.error('❌ [Email Cron] Error in initial email fetch:', error);
  });
  
  // Schedule periodic fetches
  console.log(`⏰ [Email Cron] Scheduling periodic fetches every ${intervalSeconds} seconds...`);
  setInterval(async () => {
    const timestamp = new Date().toISOString();
    console.log(`\n⏰ [Email Cron] ========================================`);
    console.log(`⏰ [Email Cron] Scheduled fetch triggered at ${timestamp}`);
    console.log(`⏰ [Email Cron] ========================================`);
    try {
      await fetchAllEmails();
    } catch (error) {
      console.error('❌ [Email Cron] Error in scheduled email fetch:', error);
    }
  }, intervalMs);
  
  console.log(`✅ [Email Cron] Email cron job initialized and running\n`);
}

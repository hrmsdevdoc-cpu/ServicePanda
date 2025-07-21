import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { ServiceProvider } from "@shared/schema";
import path from "path";
import { sendEmail } from "./emailService";

declare global {
  namespace Express {
    interface User extends ServiceProvider {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupProviderAuth(app: Express) {
  // Provider registration endpoint  
  app.post("/api/provider/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, mobileNumber, address, businessName, businessAbn } = req.body;

      if (!email || !password || !firstName || !lastName || !mobileNumber || !address) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Check for existing provider - enforce unique emails
      const existingProvider = await storage.getServiceProviderByEmail(email);
      if (existingProvider) {
        return res.status(400).json({ message: "An account with this email already exists. Please use a different email or try logging in." });
      }

      // Create new provider
      const hashedPassword = await hashPassword(password);
      const provider = await storage.createServiceProvider({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        mobileNumber,
        address,
        businessName: businessName || null,
        businessAbn: businessAbn || null,
      });

      res.status(201).json({
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
      });
    } catch (error) {
      console.error("Provider registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Provider login endpoint
  app.post("/api/provider/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const provider = await storage.getServiceProviderByEmail(email);
      if (!provider || !provider.password || !(await comparePasswords(password, provider.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
      });
    } catch (error) {
      console.error("Provider login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Provider logout endpoint
  app.post("/api/provider/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // Provider forgot password endpoint
  app.post("/api/provider/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      // Check if provider exists (but don't reveal if they don't for security)
      const provider = await storage.getServiceProviderByEmail(email);
      
      if (provider) {
        // Generate secure token
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        // Store token in database
        await storage.createProviderPasswordResetToken({
          providerId: provider.id,
          token,
          expiresAt,
        });

        // Send password reset email with correct domain
        const host = req.get('host');
        const baseUrl = host?.includes('localhost') 
          ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
          : `${req.protocol}://${host}`;
        const resetUrl = `${baseUrl}/provider-reset-password?token=${token}`;
        
        const emailSent = await sendEmail({
          to: email,
          subject: 'ServicePanda Partners - Reset Your Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>Hi ${provider.firstName},</p>
              <p>You requested a password reset for your ServicePanda Partners account. Click the link below to reset your password:</p>
              <p><a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p>Thanks,<br>ServicePanda Team</p>
            </div>
          `
        });

        if (!emailSent) {
          console.error('Failed to send password reset email for provider:', email);
          return res.status(500).json({ message: "Failed to send reset email" });
        }
      }

      // Always send success response to prevent email enumeration
      res.json({ message: "If an account with that email exists, we've sent a password reset link." });
    } catch (error) {
      console.error("Provider forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Provider reset password endpoint
  app.post("/api/provider/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Get token from database
      const resetToken = await storage.getProviderPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Check if token has expired
      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      // Check if token has already been used
      if (resetToken.usedAt) {
        return res.status(400).json({ message: "Reset token has already been used" });
      }

      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update provider password
      await storage.updateProviderPassword(resetToken.providerId, hashedPassword);
      
      // Mark token as used
      await storage.markProviderTokenAsUsed(token);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Provider reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Provider profile endpoint
  app.get('/api/provider/profile', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = req.provider.id;
      const provider = await storage.getServiceProviderById(providerId);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Return provider profile without password
      const { password, ...providerProfile } = provider;
      res.json(providerProfile);
    } catch (error) {
      console.error("Error fetching provider profile:", error);
      res.status(500).json({ message: "Failed to fetch provider profile" });
    }
  });

  // Update provider profile endpoint
  app.put('/api/provider/:id/profile', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { firstName, lastName, mobileNumber, address, businessName, businessAbn } = req.body;
      
      // Verify provider can only update their own profile
      if (providerId !== req.provider.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Validation
      if (!firstName || !lastName || !mobileNumber || !address) {
        return res.status(400).json({ message: "Required fields: firstName, lastName, mobileNumber, address" });
      }

      // Update provider
      const updatedProvider = await storage.updateServiceProvider(providerId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.trim(),
        address: address.trim(),
        businessName: businessName ? businessName.trim() : null,
        businessAbn: businessAbn ? businessAbn.trim() : null,
      });

      // Return updated profile without password
      const { password, ...profileData } = updatedProvider;
      res.json(profileData);
    } catch (error) {
      console.error("Error updating provider profile:", error);
      res.status(500).json({ message: "Failed to update provider profile" });
    }
  });



  // Provider services endpoint
  app.get('/api/provider/services', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = req.provider.id;
      const services = await storage.getProviderServices(providerId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching provider services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Provider service areas endpoint
  app.get('/api/provider/:id/service-areas', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Ensure provider can only access their own data
      if (providerId !== req.provider.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const areas = await storage.getProviderServiceAreas(providerId);
      res.json(areas);
    } catch (error) {
      console.error("Error fetching provider service areas:", error);
      res.status(500).json({ message: "Failed to fetch service areas" });
    }
  });

  // Provider document viewing endpoint with token-based auth
  app.get('/api/provider/documents/view/:filename/:providerId', async (req: any, res) => {
    try {
      const filename = req.params.filename;
      const providerId = parseInt(req.params.providerId);
      
      console.log(`Document view request: ${filename} for provider ${providerId}`);
      
      // Verify provider exists
      const provider = await storage.getServiceProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      // Get document from database to verify ownership
      const documents = await storage.getProviderDocuments(providerId);
      console.log('Available documents:', documents.map((doc: any) => ({ fileName: doc.fileName, filePath: doc.filePath })));
      
      // Try to find document by fileName or filePath
      const document = documents.find((doc: any) => 
        doc.fileName === filename || 
        doc.filePath.includes(filename) ||
        doc.filePath.endsWith(filename)
      );
      
      if (!document) {
        console.log(`Document not found: ${filename} for provider ${providerId}`);
        return res.status(404).json({ message: "Document not found or access denied" });
      }
      
      console.log(`Serving document: ${document.fileName}, MIME: ${document.mimeType}`);

      // Log document viewing activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'document_access',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: `Viewed document: ${document.fileName} (${document.documentType})`,
        oldValue: null,
        newValue: `${document.documentType}: ${document.fileName}`,
      });
      
      // Set proper headers for inline viewing in iframe
      const mimeType = document.mimeType || 'application/pdf';
      
      // Always force inline display
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Serve the file
      res.sendFile(path.resolve(document.filePath));
    } catch (error) {
      console.error("Error serving document:", error);
      res.status(500).json({ message: "Failed to serve document" });
    }
  });
}

// Middleware to check if provider is authenticated
export async function isProviderAuthenticated(req: any, res: any, next: any) {
  // Check for provider ID in headers (set by frontend after login)
  const providerId = req.headers['x-provider-id'];
  
  if (!providerId) {
    return res.status(401).json({ message: "Provider authentication required. Please log in again." });
  }

  try {
    const provider = await storage.getServiceProviderById(parseInt(providerId));
    if (!provider) {
      return res.status(401).json({ message: "Invalid provider credentials" });
    }
    
    req.provider = provider;
    next();
  } catch (error) {
    console.error("Provider authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}
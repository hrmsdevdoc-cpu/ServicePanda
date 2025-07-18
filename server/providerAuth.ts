import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { ServiceProvider } from "@shared/schema";

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
      const { email, password, firstName, lastName, mobileNumber, address } = req.body;

      if (!email || !password || !firstName || !lastName || !mobileNumber || !address) {
        return res.status(400).json({ message: "All fields are required" });
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

  // Provider leads endpoint
  app.get('/api/provider/leads', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = req.provider.id;
      // For now return empty array - will implement lead matching later
      const leads: any[] = [];
      res.json(leads);
    } catch (error) {
      console.error("Error fetching provider leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
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
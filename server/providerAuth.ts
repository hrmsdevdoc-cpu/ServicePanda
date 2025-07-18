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
}

// Middleware to check if provider is authenticated
export async function isProviderAuthenticated(req: any, res: any, next: any) {
  const providerId = req.headers['x-provider-id'];
  
  if (!providerId) {
    return res.status(401).json({ message: "Provider authentication required" });
  }

  try {
    const provider = await storage.getServiceProvider(parseInt(providerId));
    if (!provider) {
      return res.status(401).json({ message: "Invalid provider" });
    }
    
    req.provider = provider;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}
import { Express, RequestHandler } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const scryptAsync = promisify(scrypt);

// Admin credentials - in production, these should be environment variables
const ADMIN_CREDENTIALS = {
  username: "admin",
  passwordHash: "admin123", // This will be hashed
};

// JWT secret for admin tokens
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-jwt-secret-key";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    // If stored password doesn't contain a dot, treat it as plaintext (legacy)  
    if (!stored.includes('.')) {
      return supplied === stored;
    }
    
    // Handle hashed password
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

function generateAdminToken(username: string): string {
  return jwt.sign(
    { username, role: "admin", type: "admin" },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function verifyAdminToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setupAdminAuth(app: Express) {
  // Setup admin user endpoint (no auth required for initial setup)
  app.post("/api/setup/admin-user", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Import storage here to avoid circular dependency
      const { storage } = await import("./storage");
      
      // Check if admin user already exists
      const existingAdmin = await storage.getAdminUserByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin user already exists" });
      }

      // Hash password and create admin user
      const hashedPassword = await hashPassword(password);
      const adminUser = await storage.createAdminUser({
        username,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.json({
        message: "Admin user created successfully",
        user: {
          username: adminUser.username,
          role: adminUser.role
        }
      });
    } catch (error) {
      console.error("Admin user setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Import storage here to avoid circular dependency
      const { storage } = await import("./storage");
      
      // Get admin user from database
      const adminUser = await storage.getAdminUserByUsername(username);
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password against database hash
      const isPasswordValid = await comparePasswords(password, adminUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = generateAdminToken(username);

      res.json({
        message: "Login successful",
        token,
        user: {
          username,
          role: "admin",
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    // For JWT, logout is handled client-side by removing the token
    res.json({ message: "Logged out successfully" });
  });
}

export const isAdminAuthenticated: RequestHandler = (req, res, next) => {
  try {
    // Check both x-admin-token header and Authorization Bearer token
    let token = req.headers["x-admin-token"] as string;
    
    if (!token) {
      // Check Authorization header for Bearer token
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    console.log("Admin auth check - token:", token ? `Present (${token.substring(0, 20)}...)` : "Missing");

    if (!token) {
      console.log("Admin auth failed - no token");
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const decoded = verifyAdminToken(token);
    console.log("Admin auth - decoded token:", decoded);
    
    if (!decoded || decoded.role !== "admin") {
      console.log("Admin auth failed - invalid token or role");
      return res.status(401).json({ message: "Invalid admin token" });
    }

    // Add admin info to request object
    (req as any).admin = decoded;
    console.log("Admin auth successful");
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Admin authentication failed" });
  }
};
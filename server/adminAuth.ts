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
const JWT_SECRET = process.env.JWT_SECRET || "admin-jwt-secret-key";

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  // For demo purposes, use direct comparison with the stored plaintext password
  return supplied === stored;
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
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Check credentials
      if (username !== ADMIN_CREDENTIALS.username) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await comparePasswords(password, ADMIN_CREDENTIALS.passwordHash);
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
    const token = req.headers["x-admin-token"] as string;
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
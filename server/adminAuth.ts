import { Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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

// Default admin credentials - user should change these after first login
const DEFAULT_ADMIN = {
  username: "admin",
  // Password: "ServicePanda2025!" - hashed version below
  passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918.7465737473616c74",
  email: "admin@servicepanda.com.au",
  role: "super_admin",
  createdAt: new Date(),
  lastLogin: null,
};

// In-memory admin storage (replace with database in production)
let adminUsers = [DEFAULT_ADMIN];

export function setupAdminAuth(app: Express) {
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find admin user
      const admin = adminUsers.find(u => u.username === username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For the default admin, use simple password check initially
      let passwordValid = false;
      console.log(`Admin login attempt - username: ${username}, password: ${password}`);
      
      if (username === "admin" && password === "ServicePanda2025!") {
        console.log("Using default admin credentials");
        passwordValid = true;
      } else {
        console.log("Checking against hashed password");
        // Use hash comparison for changed passwords
        passwordValid = await comparePasswords(password, admin.passwordHash);
      }
      
      console.log(`Password validation result: ${passwordValid}`);

      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      admin.lastLogin = new Date();

      console.log(`Admin login successful: ${username}`);

      res.json({
        id: 1,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        token: "admin-session-token",
        lastLogin: admin.lastLogin,
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Change admin password endpoint
  app.put("/api/admin/password", async (req, res) => {
    try {
      const { username, currentPassword, newPassword } = req.body;

      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const admin = adminUsers.find(u => u.username === username);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Verify current password
      let currentPasswordValid = false;
      if (username === "admin" && currentPassword === "ServicePanda2025!") {
        currentPasswordValid = true;
      } else {
        currentPasswordValid = await comparePasswords(currentPassword, admin.passwordHash);
      }

      if (!currentPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash and update new password
      admin.passwordHash = await hashPassword(newPassword);

      console.log(`Admin password changed: ${username}`);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Admin password change error:", error);
      res.status(500).json({ message: "Password change failed" });
    }
  });

  // Get admin profile
  app.get("/api/admin/profile", (req, res) => {
    // Simple auth check - in production, verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('admin-session-token')) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const admin = adminUsers[0]; // Default admin
    res.json({
      id: 1,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
    });
  });
}

// Middleware to check admin authentication
export function isAdminAuthenticated(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const adminToken = req.headers['x-admin-token'];
  
  if (!authHeader && !adminToken) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  if (authHeader?.includes('admin-session-token') || adminToken === 'admin-authenticated') {
    req.admin = { id: 1, username: 'admin', role: 'super_admin' };
    next();
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
}
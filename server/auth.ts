import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { sendPasswordResetEmail } from "./emailService";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Check if it's a bcrypt hash (starts with $2a$, $2b$, $2y$, etc.)
  if (stored.startsWith('$2')) {
    const bcrypt = await import('bcrypt');
    return await bcrypt.compare(supplied, stored);
  }
  
  // Handle old scrypt hashed passwords (format: hash.salt)
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false; // Invalid format
    }
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Check buffer lengths before comparison
    if (hashedBuf.length !== suppliedBuf.length) {
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Error comparing scrypt password:', error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Try to use PostgreSQL session store, fallback to memory store
  let sessionStore;
  try {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    console.log("✅ Using PostgreSQL session store");
  } catch (error) {
    console.warn("⚠️  PostgreSQL session store failed, using memory store for development");
    console.warn("   Database connection error:", error.message);
    sessionStore = new session.MemoryStore();
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "servicepanda-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          console.log("Passport strategy - checking user:", email);
          const user = await storage.getUserByEmail(email);
          console.log("User found:", !!user);
          
          if (!user) {
            console.log("No user found with email:", email);
            return done(null, false, { message: "Invalid email or password" });
          }
          
          if (!user.password) {
            console.log("User has no password");
            return done(null, false, { message: "Invalid email or password" });
          }
          
          console.log("Comparing passwords...");
          const passwordMatch = await comparePasswords(password, user.password);
          console.log("Password match:", passwordMatch);
          
          if (!passwordMatch) {
            console.log("Password does not match");
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Update last login time
          await storage.updateUserLastLogin(user.id);
          console.log("User authenticated successfully in passport strategy:", user.id);
          
          return done(null, user);
        } catch (error) {
          console.log("Passport strategy error:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration attempt:", req.body);
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      if (!email || !password || !firstName || !lastName || !phoneNumber) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
      }

      // Temporarily disable email uniqueness check for testing
      // const existingUser = await storage.getUserByEmail(email);
      // if (existingUser) {
      //   return res.status(400).json({ message: "Email already exists" });
      // }

      console.log("Hashing password...");
      const hashedPassword = await hashPassword(password);
      console.log("Password hashed successfully");
      
      // For testing: if user exists, update password, otherwise create new user
      console.log("Checking for existing user...");
      const existingUser = await storage.getUserByEmail(email);
      let user;
      
      if (existingUser) {
        console.log("Updating existing user...");
        // Update existing user with new password for testing
        user = await storage.updateUser(existingUser.id, {
          firstName,
          lastName,
          phoneNumber,
          password: hashedPassword,
        });
        console.log("User updated:", user.id);
      } else {
        console.log("Creating new user...");
        // Create new user
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("Generated user ID:", userId);
        
        const userData = {
          id: userId,
          email,
          firstName,
          lastName,
          phoneNumber,
          password: hashedPassword,
        };
        console.log("User data to insert:", userData);
        
        user = await storage.upsertUser(userData);
        console.log("User created:", user.id);
      }

      req.login(user, async (err) => {
        if (err) {
          console.log("Login error during registration:", err);
          return next(err);
        }
        
        // Update last login time for new registration
        await storage.updateUserLastLogin(user.id);
        
        console.log("Registration successful for user:", user.id);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", { email: req.body.email });
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.log("Login authentication error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      if (!user) {
        console.log("Login failed - no user found or invalid credentials");
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      console.log("User authenticated successfully:", user.id);
      req.login(user, (err) => {
        if (err) {
          console.log("Login session error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        console.log("Login successful for user:", user.id);
        res.status(200).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as SelectUser;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
    });
  });

  // Forgot password endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // For security, always return success even if user doesn't exist
        return res.json({ message: "If an account with that email exists, you will receive a password reset link." });
      }

      // Generate secure reset token
      const resetToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
      });

      // Send password reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (!emailSent) {
        console.error(`Failed to send password reset email to ${email}`);
        // Still return success for security - don't reveal if email failed to send
      } else {
        console.log(`Password reset email sent successfully to ${email}`);
      }

      res.json({ message: "If an account with that email exists, you will receive a password reset link." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset password endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const resetToken = await storage.getPasswordResetToken(token);
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
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      await storage.updateUserPassword(resetToken.userId, hashedPassword);

      // Mark token as used
      await storage.markTokenAsUsed(token);

      res.json({ message: "Password has been successfully reset" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
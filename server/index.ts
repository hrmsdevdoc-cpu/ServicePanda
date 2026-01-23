import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import path from 'path';
// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

const app = express();

// Set environment explicitly if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CORS middleware for development and production
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://staging.servicepanda.com.au',
    'https://servicepanda.com.au',
    'https://www.servicepanda.com.au',
    'https://api.servicepanda.com.au',
    'http://localhost:4000',
    'http://localhost:3000',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:3000',
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:5173'
  ];

  const origin = req.headers.origin;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Helper function to check if origin is a servicepanda.com.au domain
  const isServicePandaDomain = (origin: string | undefined): boolean => {
    if (!origin) return false;
    try {
      const url = new URL(origin);
      return url.hostname === 'servicepanda.com.au' || 
             url.hostname === 'www.servicepanda.com.au' ||
             url.hostname === 'staging.servicepanda.com.au' ||
             url.hostname === 'api.servicepanda.com.au' ||
             url.hostname.endsWith('.servicepanda.com.au');
    } catch {
      return origin.includes('servicepanda.com.au');
    }
  };
  
  console.log('CORS request from origin:', origin, '| NODE_ENV:', process.env.NODE_ENV, '| Method:', req.method);
  
  // Handle preflight OPTIONS requests first
  if (req.method === 'OPTIONS') {
    // Allow servicepanda.com.au domains
    if (origin && isServicePandaDomain(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
      res.header('Access-Control-Allow-Credentials', 'true');
      console.log('CORS: Preflight allowed for servicepanda domain:', origin);
      return res.sendStatus(200);
    }
    // Allow localhost in development
    if (isDevelopment && origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
      res.header('Access-Control-Allow-Credentials', 'true');
      console.log('CORS: Preflight allowed for localhost in development:', origin);
      return res.sendStatus(200);
    }
    // Check allowed origins list
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
      res.header('Access-Control-Allow-Credentials', 'true');
      console.log('CORS: Preflight allowed from list:', origin);
      return res.sendStatus(200);
    }
  }
  
  // Handle actual requests (non-OPTIONS)
  // Priority 1: Allow servicepanda.com.au domains (production)
  if (origin && isServicePandaDomain(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log('CORS: Allowed servicepanda domain:', origin);
    return next();
  }
  
  // Priority 2: In development, allow any localhost origin (any port)
  if (isDevelopment && origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log('CORS: Allowed localhost origin in development:', origin);
    return next();
  }
  
  // Priority 3: Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log('CORS: Allowed origin from list:', origin);
    return next();
  }
  
  // Priority 4: In development, allow any origin (fallback)
  if (isDevelopment && origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.log('CORS: Allowed origin in development mode:', origin);
    return next();
  }
  
  // Priority 5: No origin header - allow in development only
  if (isDevelopment && !origin) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-provider-id, x-admin-token');
    console.log('CORS: No origin header - allowing all in development');
    return next();
  }
  
  // Block in production if not allowed
  console.log('CORS: Blocked origin:', origin);
  res.status(403).json({ message: 'CORS: Origin not allowed', origin });
});

// Health check endpoint for mobile app connectivity testing - must be before Vite setup
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'ServicePanda API is running'
  });
});



app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

       // log(logLine); // Disabled to reduce console noise
    }
  });

  next();
});

(async () => {
  // Import storage for the expiration checker
  const { storage } = await import("./storage");

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
 
  // Start expired lead and offer checker - runs every 5 minutes instead of every minute
  setInterval(async () => {
    try {
      // Check if 1-minute cron is enabled in admin settings
      const settings = await storage.getLeadSettings();
      if (settings.oneMinuteCronActive) {
        console.log('Processing expired leads...');
        await storage.processExpiredLeads();
        console.log('Expired leads processing completed');
      } else {
        console.log('1-minute cron disabled in admin settings - skipping expired lead processing');
      }
    } catch (error) {
      console.error('Error in expired lead checker:', error);
      // Don't let errors crash the interval
    }
  }, 60000); // Check every 1 minute for faster updates

  // Initialize email fetch cron job - runs every 2 minutes
  const { initializeEmailCron } = await import('./emailCronService');
  initializeEmailCron(2); // Fetch emails every 2 minutes

  // Windows-compatible server configuration
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    // On Windows, use localhost instead of 0.0.0.0 and remove reusePort
    server.listen(port, 'localhost', () => {
      log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      log('Lead and offer expiration checker started - checking every 5 minutes');
    });
  } else {
    // On Unix systems, use the original configuration
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      log('Lead and offer expiration checker started - checking every 5 minutes');
    });
  }
})();

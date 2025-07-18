import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { setupProviderAuth, isProviderAuthenticated } from "./providerAuth";
import { setupAdminAuth, isAdminAuthenticated } from "./adminAuth";
import { z } from "zod";
import { insertServiceProviderSchema, insertServiceRequestSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware for customers
  setupAuth(app);
  
  // Auth middleware for providers
  setupProviderAuth(app);
  
  // Auth middleware for admins
  setupAdminAuth(app);

  // Configure multer for file uploads
  const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only .png, .jpg, .jpeg and .pdf files are allowed"));
      }
    },
  });



  // Service categories
  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  // Service provider registration
  app.post('/api/service-providers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const providerData = insertServiceProviderSchema.parse({
        ...req.body,
        userId,
      });
      
      const provider = await storage.createServiceProvider(providerData);
      
      // Log user activity
      await storage.logUserActivity({
        userId,
        userType: "provider",
        action: "signup_started",
        details: { providerId: provider.id },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json(provider);
    } catch (error) {
      console.error("Error creating service provider:", error);
      res.status(500).json({ message: "Failed to create service provider" });
    }
  });

  // Get service provider by user ID
  app.get('/api/service-providers/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const provider = await storage.getServiceProviderByUserId(userId);
      
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  // Update service provider
  app.put('/api/service-providers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Verify ownership
      const provider = await storage.getServiceProvider(id);
      if (!provider || provider.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedProvider = await storage.updateServiceProvider(id, req.body);
      res.json(updatedProvider);
    } catch (error) {
      console.error("Error updating service provider:", error);
      res.status(500).json({ message: "Failed to update service provider" });
    }
  });

  // Add provider services (during signup - no auth required)
  app.post('/api/service-providers/:id/services', async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { categoryIds } = req.body;
      
      console.log(`Adding services for provider ${providerId}:`, categoryIds);
      
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ message: "Category IDs are required" });
      }
      
      // Verify provider exists
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      // Add services
      for (const categoryId of categoryIds) {
        await storage.addProviderService({ providerId, categoryId });
      }
      
      res.json({ message: "Services added successfully" });
    } catch (error) {
      console.error("Error adding provider services:", error);
      res.status(500).json({ message: "Failed to add provider services" });
    }
  });

  // Get Australian states
  app.get('/api/australian-states', async (req, res) => {
    try {
      const states = await storage.getAustralianStates();
      res.json(states);
    } catch (error) {
      console.error("Error fetching Australian states:", error);
      res.status(500).json({ message: "Failed to fetch Australian states" });
    }
  });

  // Get suburbs by postcode
  app.get('/api/suburbs/:postcode', async (req, res) => {
    try {
      const { postcode } = req.params;
      const suburbs = await storage.getSuburbsByPostcode(postcode);
      res.json(suburbs);
    } catch (error) {
      console.error("Error fetching suburbs:", error);
      res.status(500).json({ message: "Failed to fetch suburbs" });
    }
  });

  // Add provider service areas
  app.post('/api/service-providers/:id/service-areas', isAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      const { suburbIds } = req.body;
      
      // Verify ownership
      const provider = await storage.getServiceProvider(providerId);
      if (!provider || provider.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Add service areas
      for (const suburbId of suburbIds) {
        await storage.addProviderServiceArea({ providerId, suburbId });
      }
      
      res.json({ message: "Service areas added successfully" });
    } catch (error) {
      console.error("Error adding provider service areas:", error);
      res.status(500).json({ message: "Failed to add provider service areas" });
    }
  });

  // Upload provider documents
  app.post('/api/service-providers/:id/documents', isAuthenticated, upload.array('documents', 3), async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      const files = req.files as Express.Multer.File[];
      
      // Verify ownership
      const provider = await storage.getServiceProvider(providerId);
      if (!provider || provider.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const uploadedDocs = [];
      
      for (const file of files) {
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: req.body.documentType || 'general',
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
        uploadedDocs.push(doc);
      }
      
      // Update provider status
      await storage.updateServiceProvider(providerId, { documentsUploaded: true });
      
      res.json({ 
        message: "Documents uploaded successfully",
        documents: uploadedDocs 
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  // Get provider documents
  app.get('/api/service-providers/:id/documents', isAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Verify ownership
      const provider = await storage.getServiceProvider(providerId);
      if (!provider || provider.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const documents = await storage.getProviderDocuments(providerId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching provider documents:", error);
      res.status(500).json({ message: "Failed to fetch provider documents" });
    }
  });

  // Address verification endpoints
  app.get('/api/address/autocomplete', async (req, res) => {
    try {
      const { input, types = 'address', components = 'country:AU' } = req.query;
      
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Input parameter is required' });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
      }

      const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
      url.searchParams.append('input', input);
      url.searchParams.append('types', types as string);
      url.searchParams.append('components', components as string);
      url.searchParams.append('key', apiKey);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status === 'OK') {
        res.json(data);
      } else {
        console.error('Google Places API error:', data);
        res.status(500).json({ error: 'Failed to fetch address suggestions' });
      }
    } catch (error) {
      console.error('Address autocomplete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/address/details', async (req, res) => {
    try {
      const { place_id } = req.query;
      
      if (!place_id || typeof place_id !== 'string') {
        return res.status(400).json({ error: 'place_id parameter is required' });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
      }

      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      url.searchParams.append('place_id', place_id);
      url.searchParams.append('fields', 'formatted_address,address_components,geometry');
      url.searchParams.append('key', apiKey);

      console.log('Fetching place details for:', place_id);
      const response = await fetch(url.toString());
      const data = await response.json();

      console.log('Google Places Details API response:', JSON.stringify(data, null, 2));

      if (data.status === 'OK') {
        res.json(data);
      } else {
        console.error('Google Places Details API error:', data.status, data.error_message);
        res.status(500).json({ error: 'Failed to fetch address details', details: data.error_message });
      }
    } catch (error) {
      console.error('Address details error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create service request
  app.post('/api/service-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requestData = insertServiceRequestSchema.parse({
        ...req.body,
        customerId: userId,
      });
      
      const request = await storage.createServiceRequest(requestData);
      
      // Log user activity
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "service_request_created",
        details: { 
          requestId: request.id,
          postcode: request.postcode,
          categoryId: request.categoryId
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json({ 
        request,
        message: "Service request created successfully! We'll be in touch soon."
      });
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Failed to create service request" });
    }
  });

  // Get service requests for customer
  app.get('/api/service-requests/my-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requests = await storage.getServiceRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  // Get new leads for provider
  app.get('/api/leads/new', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const provider = await storage.getServiceProviderByUserId(userId);
      
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      const leads = await storage.getProviderLeads(provider.id, "pending");
      res.json(leads);
    } catch (error) {
      console.error("Error fetching new leads:", error);
      res.status(500).json({ message: "Failed to fetch new leads" });
    }
  });

  // Accept lead
  app.post('/api/leads/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Verify ownership
      const provider = await storage.getServiceProviderByUserId(userId);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      await storage.updateLeadStatus(leadId, "accepted");
      
      // Log user activity
      await storage.logUserActivity({
        userId,
        userType: "provider",
        action: "lead_accepted",
        details: { leadId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json({ message: "Lead accepted successfully" });
    } catch (error) {
      console.error("Error accepting lead:", error);
      res.status(500).json({ message: "Failed to accept lead" });
    }
  });

  // Admin routes
  app.get('/api/admin/providers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // TODO: Add admin role check
      const providers = await storage.getServiceProvidersByStatus("pending");
      res.json(providers);
    } catch (error) {
      console.error("Error fetching pending providers:", error);
      res.status(500).json({ message: "Failed to fetch pending providers" });
    }
  });

  // Approve service provider
  app.post('/api/admin/providers/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // TODO: Add admin role check
      await storage.updateServiceProvider(providerId, { status: "approved" });
      
      // Log admin activity
      await storage.logUserActivity({
        userId,
        userType: "admin",
        action: "provider_approved",
        details: { providerId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json({ message: "Service provider approved successfully" });
    } catch (error) {
      console.error("Error approving service provider:", error);
      res.status(500).json({ message: "Failed to approve service provider" });
    }
  });

  // Update user profile
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName } = req.body;
      
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required" });
      }
      
      const updatedUser = await storage.updateUser(userId, { firstName, lastName });
      
      // Log user activity
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "profile_updated",
        details: { firstName, lastName },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Log user activity endpoint
  app.post('/api/user-activity', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { action, details, userType } = req.body;
      
      await storage.logUserActivity({
        userId,
        userType,
        action,
        details,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json({ message: "Activity logged successfully" });
    } catch (error) {
      console.error("Error logging user activity:", error);
      res.status(500).json({ message: "Failed to log user activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

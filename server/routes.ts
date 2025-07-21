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
      const provider = await storage.getServiceProviderByEmail(req.user.email);
      
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
      if (!provider || provider.email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedProvider = await storage.updateServiceProvider(id, req.body);
      res.json(updatedProvider);
    } catch (error) {
      console.error("Error updating service provider:", error);
      res.status(500).json({ message: "Failed to update service provider" });
    }
  });

  // Update provider services (replace all existing services)
  app.post('/api/service-providers/:id/services', async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { categoryIds } = req.body;
      
      // Remove duplicates from category IDs for safety
      const uniqueCategoryIds = Array.from(new Set(categoryIds as number[]));
      
      console.log(`Replacing services for provider ${providerId}:`);
      console.log(`Original categoryIds:`, categoryIds);
      console.log(`Deduplicated categoryIds:`, uniqueCategoryIds);
      
      if (!Array.isArray(categoryIds) || uniqueCategoryIds.length === 0) {
        return res.status(400).json({ message: "Category IDs are required" });
      }
      
      // Verify provider exists
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Get current services for activity logging
      const currentServices = await storage.getProviderServices(providerId);
      const currentServiceNames = currentServices.map(s => s.name).sort().join(', ');
      
      // Get new service names for logging
      const allCategories = await storage.getServiceCategories();
      const newServiceNames = allCategories
        .filter(cat => uniqueCategoryIds.includes(cat.id))
        .map(cat => cat.name)
        .sort()
        .join(', ');
      
      // Replace all services for this provider
      await storage.replaceProviderServices(providerId, uniqueCategoryIds);

      // Log service update activity (only if services actually changed)
      if (currentServiceNames !== newServiceNames) {
        await storage.logProviderActivity({
          providerId,
          activityType: 'services_update',
          actorType: 'provider',
          actorId: providerId.toString(),
          actorName: `${provider.firstName} ${provider.lastName}`,
          description: 'Service categories updated',
          oldValue: currentServiceNames || 'No services selected',
          newValue: newServiceNames,
        });
      }
      
      res.json({ message: "Services updated successfully" });
    } catch (error) {
      console.error("Error updating provider services:", error);
      res.status(500).json({ message: "Failed to update provider services" });
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

  // Get Google Maps API configuration
  app.get('/api/config/google-maps', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY || '' });
  });

  // Add provider location-based service areas (new approach)
  app.post('/api/provider/:id/location-service-areas', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { centerAddress, centerLat, centerLng, radiusKm, areaName } = req.body;

      console.log('Adding location-based service area for provider:', providerId, 'address:', centerAddress, 'radius:', radiusKm);

      const serviceArea = await storage.addProviderLocationServiceArea({
        providerId,
        centerAddress,
        centerLat,
        centerLng,
        radiusKm,
        areaName,
      });

      res.status(201).json(serviceArea);
    } catch (error: any) {
      console.error('Error adding location-based service area:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get provider location-based service areas
  app.get('/api/provider/:id/location-service-areas', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const serviceAreas = await storage.getProviderLocationServiceAreas(providerId);
      res.json(serviceAreas);
    } catch (error: any) {
      console.error('Error fetching location-based service areas:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete provider location-based service area
  app.delete('/api/provider/:id/location-service-areas/:areaId', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const areaId = parseInt(req.params.areaId);
      
      await storage.deleteProviderLocationServiceArea(providerId, areaId);
      res.json({ message: 'Service area deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting location-based service area:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Legacy: Add provider service areas
  app.post('/api/service-providers/:id/service-areas', isAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const userId = req.user.id;
      const { suburbIds } = req.body;
      
      // Verify ownership
      const provider = await storage.getServiceProvider(providerId);
      if (!provider || provider.email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Add service areas (legacy approach - need to provide centerAddress)
      for (const suburbId of suburbIds) {
        await storage.addProviderServiceArea({ 
          providerId, 
          suburbId,
          centerAddress: "Legacy suburb-based area" // Temporary workaround
        });
      }
      
      res.json({ message: "Service areas added successfully" });
    } catch (error) {
      console.error("Error adding provider service areas:", error);
      res.status(500).json({ message: "Failed to add provider service areas" });
    }
  });

  // Upload provider documents
  app.post('/api/service-providers/:id/documents', isProviderAuthenticated, upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'policeCheck', maxCount: 1 },
    { name: 'insuranceCertificate', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Verify provider exists
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      const uploadedDocs = [];
      
      // Process each document type
      if (files.license && files.license[0]) {
        const file = files.license[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: 'license',
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
        uploadedDocs.push(doc);
      }
      
      if (files.policeCheck && files.policeCheck[0]) {
        const file = files.policeCheck[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: 'police_check',
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
        uploadedDocs.push(doc);
      }
      
      if (files.insuranceCertificate && files.insuranceCertificate[0]) {
        const file = files.insuranceCertificate[0];
        const doc = await storage.uploadProviderDocument({
          providerId,
          documentType: 'insurance',
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
  app.get('/api/service-providers/:id/documents', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
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
      const provider = await storage.getServiceProviderByEmail(req.user.email);
      
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
      const provider = await storage.getServiceProviderByEmail(req.user.email);
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

  // Admin routes (duplicates removed - proper admin routes are defined below with isAdminAuthenticated)

  // Update user profile
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phoneNumber } = req.body;
      
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required" });
      }
      
      const updatedUser = await storage.updateUser(userId, { firstName, lastName, phoneNumber });
      
      // Log user activity
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "profile_updated",
        details: { firstName, lastName, phoneNumber },
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

  // Regional API endpoints
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  app.get("/api/regions/state/:stateId", async (req, res) => {
    try {
      const { stateId } = req.params;
      const regions = await storage.getRegionsByStateId(parseInt(stateId));
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions by state:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Get all suburbs in a region
  app.get("/api/regions/:regionId/suburbs", async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const suburbs = await storage.getSuburbsByRegion(regionId);
      res.json(suburbs);
    } catch (error) {
      console.error("Error fetching region suburbs:", error);
      res.status(500).json({ error: "Failed to fetch region suburbs" });
    }
  });



  // Admin Dashboard API Endpoints
  app.get('/api/admin/stats', isAdminAuthenticated, async (req, res) => {
    try {
      const totalProviders = await storage.getServiceProviderCount();
      const activeProviders = await storage.getServiceProviderCount('approved');
      const pendingProviders = await storage.getServiceProviderCount('pending');
      const totalCustomers = await storage.getUserCount();
      const totalRequests = await storage.getServiceRequestCount();
      const pendingRequests = await storage.getServiceRequestCount('pending');

      res.json({
        totalProviders,
        activeProviders,
        pendingProviders,
        totalCustomers,
        totalRequests,
        pendingRequests,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  app.get('/api/admin/providers', isAdminAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string;
      const providers = await storage.getServiceProvidersForAdmin(status);
      res.json(providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({ message: 'Failed to fetch providers' });
    }
  });

  app.post('/api/admin/providers/:id/approve', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Get current status for activity logging
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldStatus = currentProvider?.status || 'pending';
      const oldProviderStatus = currentProvider?.providerStatus || 'deactivated';
      
      await storage.updateServiceProviderStatus(providerId, 'approved');

      // Automatically activate provider when approved (if currently pending)
      if (oldStatus === 'pending' && oldProviderStatus === 'deactivated') {
        await storage.updateProviderStatus(providerId, 'activated');
        
        // Log provider activation activity
        await storage.logProviderActivity({
          providerId,
          activityType: 'status_change',
          actorType: 'admin',
          actorId: 'admin',
          actorName: 'Administrator',
          description: 'Provider automatically activated upon approval',
          oldValue: 'deactivated',
          newValue: 'activated',
        });
      }

      // Log approval activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'status_change',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: 'Provider application approved',
        oldValue: oldStatus,
        newValue: 'approved',
      });

      res.json({ message: 'Provider approved successfully' });
    } catch (error) {
      console.error('Error approving provider:', error);
      res.status(500).json({ message: 'Failed to approve provider' });
    }
  });

  app.post('/api/admin/providers/:id/reject', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Get current status for activity logging
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldStatus = currentProvider?.status || 'pending';
      
      await storage.updateServiceProviderStatus(providerId, 'rejected');

      // Log rejection activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'status_change',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: 'Provider application rejected',
        oldValue: oldStatus,
        newValue: 'rejected',
      });

      res.json({ message: 'Provider rejected successfully' });
    } catch (error) {
      console.error('Error rejecting provider:', error);
      res.status(500).json({ message: 'Failed to reject provider' });
    }
  });

  // Get detailed provider information for admin review
  app.get('/api/admin/providers/:id/details', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const providerDetails = await storage.getProviderDetailsForAdmin(providerId);
      res.json(providerDetails);
    } catch (error) {
      console.error('Error fetching provider details:', error);
      res.status(500).json({ message: 'Failed to fetch provider details' });
    }
  });

  // Add service area for provider (admin function)
  app.post('/api/admin/providers/:id/service-areas', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { centerAddress, radiusKm } = req.body;
      
      const serviceArea = await storage.addProviderLocationServiceArea({
        providerId,
        centerAddress,
        radiusKm,
        areaName: null, // Let admin optionally specify this later
      });

      // Log service area addition activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'service_area_update',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: `Service area added: ${centerAddress} (${radiusKm}km radius)`,
        oldValue: null,
        newValue: `${centerAddress} - ${radiusKm}km radius`,
      });
      
      res.json(serviceArea);
    } catch (error) {
      console.error('Error adding service area:', error);
      res.status(500).json({ message: 'Failed to add service area' });
    }
  });

  // Remove service area (admin function)
  app.delete('/api/admin/service-areas/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const areaId = parseInt(req.params.id);
      
      // Get service area details before deletion for activity logging
      const serviceAreaDetails = await storage.getServiceAreaById(areaId);
      
      await storage.removeProviderServiceArea(areaId);

      // Log service area removal activity
      if (serviceAreaDetails) {
        await storage.logProviderActivity({
          providerId: serviceAreaDetails.providerId,
          activityType: 'service_area_update',
          actorType: 'admin',
          actorId: 'admin',
          actorName: 'Administrator',
          description: `Service area removed: ${serviceAreaDetails.centerAddress} (${serviceAreaDetails.radiusKm}km radius)`,
          oldValue: `${serviceAreaDetails.centerAddress} - ${serviceAreaDetails.radiusKm}km radius`,
          newValue: null,
        });
      }
      
      res.json({ message: 'Service area removed successfully' });
    } catch (error) {
      console.error('Error removing service area:', error);
      res.status(500).json({ message: 'Failed to remove service area' });
    }
  });

  // Update provider admin notes and insurance expiry
  app.put('/api/admin/providers/:id/notes', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { adminNotes, insuranceExpiryDate } = req.body;
      
      // Get current provider data for activity logging
      const currentProvider = await storage.getServiceProviderById(providerId);
      const oldNotes = currentProvider?.adminNotes || '';
      const oldInsuranceDate = currentProvider?.insuranceExpiryDate;
      
      await storage.updateProviderAdminFields(providerId, {
        adminNotes,
        insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
      });

      // Log admin notes activity if changed
      if (adminNotes !== oldNotes) {
        await storage.logProviderActivity({
          providerId,
          activityType: 'details_update',
          actorType: 'admin',
          actorId: 'admin',
          actorName: 'Administrator',
          description: `Admin notes ${adminNotes ? 'updated' : 'cleared'}`,
          oldValue: oldNotes,
          newValue: adminNotes,
        });
      }

      // Log insurance expiry activity if changed
      const newInsuranceDate = insuranceExpiryDate ? new Date(insuranceExpiryDate) : null;
      
      // More robust date comparison that handles both Date objects and strings
      const oldDateString = oldInsuranceDate ? new Date(oldInsuranceDate).toISOString().split('T')[0] : null;
      const newDateString = newInsuranceDate ? newInsuranceDate.toISOString().split('T')[0] : null;
      
      if (oldDateString !== newDateString) {
        await storage.logProviderActivity({
          providerId,
          activityType: 'details_update',
          actorType: 'admin',
          actorId: 'admin',
          actorName: 'Administrator',
          description: `Insurance expiry date ${newInsuranceDate ? 'updated to ' + newInsuranceDate.toLocaleDateString('en-AU') : 'cleared'}`,
          oldValue: oldDateString,
          newValue: newDateString,
        });
      }
      
      res.json({ message: 'Provider admin fields updated successfully' });
    } catch (error) {
      console.error('Error updating provider admin fields:', error);
      res.status(500).json({ message: 'Failed to update provider admin fields' });
    }
  });

  // Toggle document approval status
  app.put('/api/admin/providers/:providerId/documents/:documentId/status', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const documentId = parseInt(req.params.documentId);
      const { status } = req.body;
      
      if (!['pending', 'approved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be pending or approved.' });
      }

      // Get current document for activity logging
      const currentDocument = await storage.getProviderDocument(documentId);
      if (!currentDocument || currentDocument.providerId !== providerId) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Update document status
      await storage.updateDocumentStatus(documentId, status);

      // Log activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'document_update',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: `${currentDocument.documentType.replace('_', ' ')} document ${status === 'approved' ? 'approved' : 'marked as pending'}`,
        oldValue: currentDocument.status,
        newValue: status,
      });
      
      res.json({ message: 'Document status updated successfully' });
    } catch (error) {
      console.error('Error updating document status:', error);
      res.status(500).json({ message: 'Failed to update document status' });
    }
  });



  app.get('/api/admin/service-requests', isAdminAuthenticated, async (req, res) => {
    try {
      const serviceRequests = await storage.getAllServiceRequestsForAdmin();
      res.json(serviceRequests);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      res.status(500).json({ message: 'Failed to fetch service requests' });
    }
  });

  // Admin endpoint to update provider services
  app.post('/api/admin/providers/:id/services', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { categoryIds } = req.body;
      
      // Remove duplicates from category IDs for safety
      const uniqueCategoryIds = Array.from(new Set(categoryIds as number[]));
      
      if (!Array.isArray(categoryIds) || uniqueCategoryIds.length === 0) {
        return res.status(400).json({ message: "Category IDs are required" });
      }
      
      // Verify provider exists
      const provider = await storage.getServiceProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Get current services for activity logging with deduplication
      const currentServices = await storage.getProviderServices(providerId);
      const currentServiceNames = Array.from(new Set(currentServices.map(s => s.name))).sort().join(', ');
      
      // Get new service names for logging with deduplication
      const allCategories = await storage.getServiceCategories();
      const newServiceNames = Array.from(new Set(
        allCategories
          .filter(cat => uniqueCategoryIds.includes(cat.id))
          .map(cat => cat.name)
      )).sort().join(', ');
      
      // Replace all services for this provider
      await storage.replaceProviderServices(providerId, uniqueCategoryIds);

      // Log service update activity (only if services actually changed)
      if (currentServiceNames !== newServiceNames) {
        await storage.logProviderActivity({
          providerId,
          activityType: 'services_update',
          actorType: 'admin',
          actorId: 'admin',
          actorName: 'Administrator',
          description: 'Service categories updated by admin',
          oldValue: currentServiceNames || 'No services selected',
          newValue: newServiceNames,
        });
      }
      
      res.json({ message: "Services updated successfully" });
    } catch (error) {
      console.error("Error updating provider services:", error);
      res.status(500).json({ message: "Failed to update provider services" });
    }
  });

  // Admin endpoint to update provider status (activated/deactivated)
  app.put('/api/admin/providers/:id/provider-status', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const { providerStatus } = req.body;
      
      if (!providerStatus || !['activated', 'deactivated'].includes(providerStatus)) {
        return res.status(400).json({ message: "Valid provider status is required (activated or deactivated)" });
      }
      
      // Get current provider for activity logging
      const currentProvider = await storage.getServiceProviderById(providerId);
      if (!currentProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      const oldStatus = currentProvider.providerStatus || 'deactivated';
      
      // Update provider status
      await storage.updateProviderStatus(providerId, providerStatus);

      // Log provider status change activity
      await storage.logProviderActivity({
        providerId,
        activityType: 'status_change',
        actorType: 'admin',
        actorId: 'admin',
        actorName: 'Administrator',
        description: `Provider status changed from ${oldStatus} to ${providerStatus}`,
        oldValue: oldStatus,
        newValue: providerStatus,
      });
      
      res.json({ message: 'Provider status updated successfully' });
    } catch (error) {
      console.error('Error updating provider status:', error);
      res.status(500).json({ message: 'Failed to update provider status' });
    }
  });

  // Get provider activity logs
  app.get('/api/admin/providers/:id/activity', isAdminAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const actorType = req.query.actorType as 'admin' | 'provider' | undefined;
      
      const activities = await storage.getProviderActivityLogs(providerId, actorType);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching provider activities:', error);
      res.status(500).json({ message: 'Failed to fetch provider activities' });
    }
  });

  // Get all users for admin management
  app.get('/api/admin/users', isAdminAuthenticated, async (req, res) => {
    try {
      const users = await storage.getUsersWithStats();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Get all leads for admin management
  app.get('/api/admin/leads', isAdminAuthenticated, async (req, res) => {
    try {
      const leads = await storage.getLeadsWithMetrics();
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  // Add note to a lead
  app.post('/api/admin/leads/:id/notes', isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { note } = req.body;
      
      if (!note || !note.trim()) {
        return res.status(400).json({ message: 'Note content is required' });
      }
      
      const newNote = await storage.addLeadNote(leadId, note.trim(), 'admin');
      res.json(newNote);
    } catch (error) {
      console.error('Error adding lead note:', error);
      res.status(500).json({ message: 'Failed to add lead note' });
    }
  });

  // Lead management settings routes
  app.get('/api/admin/lead-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getLeadSettings();
      const categoryPricing = await storage.getCategoryLeadPricing();
      res.json({
        ...settings,
        categoryPricing,
      });
    } catch (error) {
      console.error('Error fetching lead settings:', error);
      res.status(500).json({ message: 'Failed to fetch lead settings' });
    }
  });

  app.put('/api/admin/lead-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const settings = await storage.upsertLeadSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error('Error updating lead settings:', error);
      res.status(500).json({ message: 'Failed to update lead settings' });
    }
  });

  // Admin settings endpoints - bypass route for initial setup
  app.get('/api/admin/settings', async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      res.status(500).json({ message: 'Failed to fetch admin settings' });
    }
  });



  // Public Stripe config endpoint for frontend (no auth required)
  app.get('/api/config/stripe', async (req, res) => {
    try {
      const stripeKeys = await storage.getDecryptedStripeKeys();
      
      if (stripeKeys && stripeKeys.publicKey) {
        res.json({
          publicKey: stripeKeys.publicKey,
          configured: true
        });
      } else {
        res.json({
          publicKey: null,
          configured: false
        });
      }
    } catch (error) {
      console.error('Error fetching Stripe config:', error);
      res.status(500).json({ message: 'Failed to fetch Stripe config' });
    }
  });

  // Get Stripe settings
  app.get('/api/admin/stripe-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const stripeKeys = await storage.getDecryptedStripeKeys();
      
      if (stripeKeys) {
        res.json({
          secretKey: '****' + stripeKeys.secretKey.slice(-4),
          publicKey: stripeKeys.publicKey,
          isConfigured: true
        });
      } else {
        res.json({
          secretKey: '',
          publicKey: '',
          isConfigured: false
        });
      }
    } catch (error) {
      console.error('Error fetching Stripe settings:', error);
      res.status(500).json({ message: 'Failed to fetch Stripe settings' });
    }
  });

  // Get Mailgun settings  
  app.get('/api/admin/mailgun-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      
      if (mailgunKeys) {
        res.json({
          apiKey: '****' + mailgunKeys.apiKey.slice(-4),
          domain: mailgunKeys.domain,
          domainSendingKey: '****' + mailgunKeys.domainSendingKey.slice(-4),
          isConfigured: true
        });
      } else {
        res.json({
          apiKey: '',
          domain: '',
          domainSendingKey: '',
          isConfigured: false
        });
      }
    } catch (error) {
      console.error('Error fetching Mailgun settings:', error);
      res.status(500).json({ message: 'Failed to fetch Mailgun settings' });
    }
  });

  // Bypass route for Stripe configuration (no auth required for setup)
  app.post('/api/setup/stripe-settings', async (req, res) => {
    try {
      const { publicKey, secretKey } = req.body;

      if (!publicKey || !secretKey) {
        return res.status(400).json({ message: 'Both public key and secret key are required' });
      }

      if (!secretKey.startsWith('sk_')) {
        return res.status(400).json({ message: 'Invalid Stripe Secret Key format' });
      }

      if (!publicKey.startsWith('pk_')) {
        return res.status(400).json({ message: 'Invalid Stripe Public Key format' });
      }

      // Store encrypted keys in database
      await storage.updateAdminSetting('stripe_secret_key', secretKey);
      await storage.updateAdminSetting('stripe_public_key', publicKey);

      console.log('Stripe keys saved successfully via setup route - Secret key starts with:', secretKey.substring(0, 10) + '...');

      res.json({ 
        message: 'Stripe settings configured successfully',
        isConfigured: true
      });
    } catch (error) {
      console.error('Error configuring Stripe settings:', error);
      res.status(500).json({ message: 'Failed to configure Stripe settings' });
    }
  });

  // Update Stripe settings
  app.post('/api/admin/stripe-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const { publicKey, secretKey } = req.body;

      if (!publicKey || !secretKey) {
        return res.status(400).json({ message: 'Both public key and secret key are required' });
      }

      if (!secretKey.startsWith('sk_')) {
        return res.status(400).json({ message: 'Invalid Stripe Secret Key format' });
      }

      if (!publicKey.startsWith('pk_')) {
        return res.status(400).json({ message: 'Invalid Stripe Public Key format' });
      }

      // Store encrypted keys in database
      await storage.updateAdminSetting('stripe_secret_key', secretKey);
      await storage.updateAdminSetting('stripe_public_key', publicKey);

      console.log('Stripe keys saved successfully - Secret key starts with:', secretKey.substring(0, 10) + '...');

      res.json({ 
        message: 'Settings updated successfully',
        isConfigured: true
      });
    } catch (error) {
      console.error('Error updating Stripe settings:', error);
      res.status(500).json({ message: 'Failed to update Stripe settings' });
    }
  });

  // Bypass route for Mailgun configuration (no auth required for setup)
  app.post('/api/setup/mailgun-settings', async (req, res) => {
    try {
      const { apiKey, domain, domainSendingKey } = req.body;

      if (!apiKey || !domain || !domainSendingKey) {
        return res.status(400).json({ message: 'API key, domain, and domain sending key are all required' });
      }

      // Store encrypted keys in database
      await storage.updateAdminSetting('mailgun_api_key', apiKey);
      await storage.updateAdminSetting('mailgun_domain', domain);
      await storage.updateAdminSetting('mailgun_domain_sending_key', domainSendingKey);

      console.log('Mailgun keys saved successfully via setup route - API key starts with:', apiKey.substring(0, 10) + '...', 'Domain:', domain);

      res.json({ 
        message: 'Mailgun configuration updated successfully',
        isConfigured: true
      });
    } catch (error) {
      console.error('Error configuring Mailgun settings:', error);
      res.status(500).json({ message: 'Failed to configure Mailgun settings' });
    }
  });

  // Update Mailgun settings (renamed from mailgun-config)
  app.post('/api/admin/mailgun-settings', isAdminAuthenticated, async (req, res) => {
    try {
      const { apiKey, domain, domainSendingKey } = req.body;

      if (!apiKey || !domain || !domainSendingKey) {
        return res.status(400).json({ message: 'API key, domain, and domain sending key are all required' });
      }

      // Store encrypted keys in database
      await storage.updateAdminSetting('mailgun_api_key', apiKey);
      await storage.updateAdminSetting('mailgun_domain', domain);
      await storage.updateAdminSetting('mailgun_domain_sending_key', domainSendingKey);

      console.log('Mailgun keys saved successfully - API key starts with:', apiKey.substring(0, 10) + '...', 'Domain:', domain);

      res.json({ 
        message: 'Mailgun configuration updated successfully',
        isConfigured: true
      });
    } catch (error) {
      console.error('Error updating Mailgun settings:', error);
      res.status(500).json({ message: 'Failed to update Mailgun settings' });
    }
  });

  // Email testing endpoint - for development only
  app.post('/api/admin/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email address required' });
      }

      // Get Mailgun credentials to verify setup
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      
      if (!mailgunKeys) {
        return res.status(400).json({ message: 'Mailgun not configured' });
      }

      const { apiKey, domain, domainSendingKey } = mailgunKeys;
      
      // Test the Mailgun API connection without sending
      const testResponse = await fetch(`https://api.mailgun.net/v3/${domain}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
        }
      });

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        return res.status(400).json({ 
          message: 'Mailgun API connection failed', 
          error: errorText,
          domain: domain
        });
      }

      // Try to send a test email
      const formData = new FormData();
      formData.append('from', `ServicePanda Test <noreply@${domain}>`);
      formData.append('to', email);
      formData.append('subject', 'ServicePanda Email Test');
      formData.append('text', 'This is a test email from ServicePanda. If you received this, email integration is working correctly.');
      formData.append('html', '<p>This is a test email from ServicePanda. If you received this, email integration is working correctly.</p>');

      const sendResponse = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
        },
        body: formData
      });

      if (!sendResponse.ok) {
        const errorText = await sendResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        // Check if it's the sandbox limitation
        if (errorData.message && errorData.message.includes('Sandbox subdomains are for test purposes only')) {
          return res.json({
            success: false,
            message: 'Mailgun API connection successful, but sandbox domain requires authorized recipients',
            details: 'Add your email to authorized recipients in Mailgun dashboard, or configure a custom domain',
            domain: domain,
            isConfigured: true,
            needsAuthorizedRecipients: true
          });
        }
        
        return res.status(400).json({ 
          message: 'Email send failed', 
          error: errorData,
          domain: domain 
        });
      }

      const result = await sendResponse.json();
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.id,
        domain: domain
      });

    } catch (error: any) {
      console.error('Email test error:', error);
      res.status(500).json({ message: error.message || 'Email test failed' });
    }
  });

  // Provider Payment Routes
  app.get('/api/provider/:id/payment-methods', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const paymentMethods = await storage.getProviderPaymentMethods(providerId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  // Secure Stripe Payment Methods - using Stripe Elements
  app.post('/api/provider/:id/stripe-payment-methods', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get Stripe keys
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (!stripeKeys) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      const stripe = new (await import('stripe')).default(stripeKeys.secretKey);

      const { paymentMethodId } = req.body;

      if (!paymentMethodId) {
        return res.status(400).json({ message: "Payment method ID is required" });
      }

      // Get provider details
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = provider.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: provider.email,
          name: `${provider.firstName} ${provider.lastName}`,
          metadata: {
            providerId: providerId.toString()
          }
        });
        stripeCustomerId = customer.id;
        
        // Update provider with Stripe customer ID
        await storage.updateProviderStripeCustomerId(providerId, stripeCustomerId);
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });

      // Retrieve the payment method details
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Check if this is the first payment method for this provider
      const existingMethods = await storage.getProviderPaymentMethods(providerId);
      const isFirstCard = existingMethods.length === 0;

      // Store payment method reference in our database
      const paymentMethodData = {
        providerId,
        stripeCustomerId,
        stripePaymentMethodId: paymentMethod.id,
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLastFour: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isPrimary: isFirstCard, // First card is automatically primary
        isActive: true
      };

      const newPaymentMethod = await storage.addProviderPaymentMethod(paymentMethodData);
      
      // If this was set as primary, update other methods
      if (isFirstCard) {
        await storage.updateProviderPaymentMethodPrimary(providerId, newPaymentMethod.id);
      }
      
      res.json(newPaymentMethod);
    } catch (error: any) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ message: error.message || "Failed to add payment method" });
    }
  });

  // Legacy endpoint (keep for backward compatibility but mark as deprecated)
  app.post('/api/provider/:id/payment-methods', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get Stripe keys
      const stripeKeys = await storage.getDecryptedStripeKeys();
      if (!stripeKeys) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      const stripe = new (await import('stripe')).default(stripeKeys.secretKey);

      // Extract payment method data from frontend
      const { 
        cardNumber, 
        cardholderName, 
        expiryMonth, 
        expiryYear,
        cvv,
        isPrimary = false
      } = req.body;

      // Validate required fields
      if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({ message: "Missing required card information" });
      }

      // Get provider details
      const provider = await storage.getServiceProvider(providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = provider.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: provider.email,
          name: `${provider.firstName} ${provider.lastName}`,
          metadata: {
            providerId: providerId.toString()
          }
        });
        stripeCustomerId = customer.id;
        
        // Update provider with Stripe customer ID
        await storage.updateProviderStripeCustomerId(providerId, stripeCustomerId);
      }

      // Create payment method in Stripe
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(expiryMonth),
          exp_year: parseInt(expiryYear),
          cvc: cvv,
        },
        billing_details: {
          name: cardholderName,
        },
      });

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: stripeCustomerId,
      });

      // Check if this is the first payment method for this provider
      const existingMethods = await storage.getProviderPaymentMethods(providerId);
      const isFirstCard = existingMethods.length === 0;

      // Store payment method reference in our database
      const paymentMethodData = {
        providerId,
        stripeCustomerId,
        stripePaymentMethodId: paymentMethod.id,
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLastFour: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isPrimary: isFirstCard || isPrimary, // First card is automatically primary
        isActive: true
      };

      const newPaymentMethod = await storage.addProviderPaymentMethod(paymentMethodData);
      
      // If this was set as primary, update other methods
      if (isFirstCard || isPrimary) {
        await storage.updateProviderPaymentMethodPrimary(providerId, newPaymentMethod.id);
      }
      
      res.json(newPaymentMethod);
    } catch (error: any) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ message: error.message || "Failed to add payment method" });
    }
  });

  app.put('/api/provider/:id/payment-methods/:paymentMethodId/primary', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const paymentMethodId = parseInt(req.params.paymentMethodId);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.updateProviderPaymentMethodPrimary(providerId, paymentMethodId);
      res.json({ message: "Primary payment method updated successfully" });
    } catch (error) {
      console.error("Error updating primary payment method:", error);
      res.status(500).json({ message: "Failed to update primary payment method" });
    }
  });

  app.delete('/api/provider/:id/payment-methods/:paymentMethodId', isProviderAuthenticated, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const paymentMethodId = parseInt(req.params.paymentMethodId);
      
      // Verify provider ownership
      if (req.provider.id !== providerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProviderPaymentMethod(paymentMethodId);
      res.json({ message: "Payment method removed successfully" });
    } catch (error) {
      console.error("Error removing payment method:", error);
      res.status(500).json({ message: "Failed to remove payment method" });
    }
  });

  // Lead Sharing System endpoints
  app.post('/api/service-requests', async (req, res) => {
    try {
      const serviceRequestData = insertServiceRequestSchema.parse(req.body);
      const newRequest = await storage.createServiceRequest(serviceRequestData);
      
      // Initialize lead distribution automatically
      await storage.initializeLeadDistribution(newRequest.id);
      
      res.status(201).json(newRequest);
    } catch (error: any) {
      console.error('Error creating service request:', error);
      res.status(500).json({ message: error.message || 'Failed to create service request' });
    }
  });

  app.get('/api/admin/leads/:requestId/offer-details', isAdminAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const offerDetails = await storage.getLeadOfferDetails(requestId);
      res.json(offerDetails);
    } catch (error: any) {
      console.error('Error fetching lead offer details:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch lead offer details' });
    }
  });

  app.post('/api/admin/leads/:requestId/initialize', isAdminAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      await storage.initializeLeadDistribution(requestId);
      res.json({ success: true, message: 'Lead distribution initialized' });
    } catch (error: any) {
      console.error('Error initializing lead distribution:', error);
      res.status(500).json({ message: error.message || 'Failed to initialize lead distribution' });
    }
  });

  app.get('/api/provider/leads', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }
      
      const activeLeads = await storage.getProviderActiveLeads(providerId);
      res.json(activeLeads);
    } catch (error: any) {
      console.error('Error fetching provider leads:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch provider leads' });
    }
  });

  app.get('/api/provider/activity', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = req.provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }
      
      const activities = await storage.getProviderActivityHistory(providerId);
      res.json(activities);
    } catch (error: any) {
      console.error('Error fetching provider activity:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch activity history' });
    }
  });

  app.post('/api/provider/leads/:requestId/purchase', isProviderAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const providerId = req.provider?.id;
      
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }
      
      const result = await storage.purchaseLead(requestId, providerId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('Error purchasing lead:', error);
      res.status(500).json({ message: error.message || 'Failed to purchase lead' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

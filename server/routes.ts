import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { setupProviderAuth, isProviderAuthenticated } from "./providerAuth";
import { setupAdminAuth, isAdminAuthenticated, hashPassword, comparePasswords } from "./adminAuth";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { insertServiceProviderSchema, insertServiceRequestSchema, leadOffers, potentialCustomers, smsMessages } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { sendProviderApplicationSubmittedEmail, sendProviderApprovalEmail, sendEmail } from "./emailService";
import { smsService } from "./smsService";
import { notificationRoutes } from "./notificationBridge";

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

  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

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

  // Trending service categories
  app.get('/api/service-categories/trending', async (req, res) => {

    try {
      const trendingCategories = await storage.getTrendingServiceCategories();
      res.json(trendingCategories);
    } catch (error) {
      console.error("Error fetching trending service categories:", error);
      res.status(500).json({ message: "Failed to fetch trending service categories" });
    }
  });

  // Admin endpoint to get all service categories (including inactive)
  app.get('/api/admin/service-categories', async (req, res) => {
    try {
      console.log('Admin service categories endpoint called');

      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      console.log('Admin token provided:', !!adminToken);

      if (!adminToken) {
        console.log('No admin token provided');
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      console.log('Fetching all service categories...');
      const categories = await storage.getAllServiceCategories();
      console.log('Found categories:', categories.length);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching all service categories:", error);
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

  // Get all service providers (public endpoint for lead distribution)
  app.get('/api/service-providers', async (req: any, res) => {
    try {
      const providers = await storage.getServiceProvidersByStatus('approved');
      res.json(providers);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
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

      // Generate postcode coverage for lead distribution
      await storage.calculateServiceAreaCoverage(serviceArea.id);

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
          centerAddress: "Legacy suburb-based area", // Temporary workaround
          radiusKm: 10 // Default radius for legacy areas
        });
      }

      res.json({ message: "Service areas added successfully" });
    } catch (error) {
      console.error("Error adding provider service areas:", error);
      res.status(500).json({ message: "Failed to add provider service areas" });
    }
  });

  // Upload provider documents during registration (no auth required)
  app.post('/api/provider/:id/registration-documents', upload.fields([
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

      // Send application submitted email after document upload completion
      try {
        await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
        console.log(`Application submitted email sent to provider: ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
        // Don't fail document upload if email fails
      }

      res.json({
        message: "Documents uploaded successfully",
        documents: uploadedDocs
      });
    } catch (error) {
      console.error("Error uploading registration documents:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  // Upload provider documents (authenticated) - TEMPORARILY COMMENTED OUT FOR BOTH REGISTRATION AND APP USE
  app.post('/api/service-providers/:id/documents', /* isProviderAuthenticated, */ upload.fields([
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

      // Send application submitted email after document upload completion
      try {
        await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
        console.log(`Application submitted email sent to provider: ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
        // Don't fail document upload if email fails
      }

      res.json({
        message: "Documents uploaded successfully",
        documents: uploadedDocs
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  // NEW: Registration documents upload (NO AUTHENTICATION REQUIRED)
  app.post('/api/provider/:id/registration-documents', upload.fields([
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

      // Send application submitted email after document upload completion
      try {
        await sendProviderApplicationSubmittedEmail(provider.email, provider.firstName);
        console.log(`Application submitted email sent to provider: ${provider.email}`);
      } catch (emailError) {
        console.error(`Failed to send application submitted email to ${provider.email}:`, emailError);
        // Don't fail document upload if email fails
      }

      res.json({
        message: "Registration documents uploaded successfully",
        documents: uploadedDocs
      });
    } catch (error) {
      console.error("Error uploading registration documents:", error);
      res.status(500).json({ message: "Failed to upload registration documents" });
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

      // 🎯 Check if customer is in potential_customers and update to "Won"
      try {
        const customer = await storage.getUser(userId);
        if (customer && customer.phoneNumber) {
          console.log(`[Won Status] Checking if customer ${customer.email} is in potential customers...`);
          const potentialCustomer = await storage.findPotentialCustomerByPhone(customer.phoneNumber);
          
          if (potentialCustomer && potentialCustomer.campaignStatus !== 'Won') {
            console.log(`[Won Status] Customer found! Updating ${potentialCustomer.name} (ID: ${potentialCustomer.id}) to Won`);
            await storage.updatePotentialCustomerStatus(potentialCustomer.id, 'Won');
            console.log(`✅ [Won Status] Customer ${potentialCustomer.name} marked as Won!`);
          } else if (potentialCustomer) {
            console.log(`[Won Status] Customer ${potentialCustomer.name} already has status: ${potentialCustomer.campaignStatus}`);
          } else {
            console.log(`[Won Status] Customer not found in potential customers`);
          }
        }
      } catch (wonError) {
        console.error('[Won Status] Error updating potential customer to Won:', wonError);
        // Don't fail the service request if this fails
      }

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
      const requests = await storage.getCustomerServiceRequestsWithOffers(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  // Get detailed service request info for customer
  app.get('/api/service-requests/:id/details', isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;

      // Verify the request belongs to this user
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }

      const details = await storage.getServiceRequestDetails(requestId);
      res.json(details);
    } catch (error) {
      console.error("Error fetching service request details:", error);
      res.status(500).json({ message: "Failed to fetch service request details" });
    }
  });

  // Get professionals who received customer's service request
  app.get('/api/service-requests/:id/professionals', isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;

      // Verify the request belongs to this user
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }

      const professionals = await storage.getServiceRequestProfessionals(requestId);
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching service request professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  // Get professionals who accepted customer's service request quotes
  app.get('/api/service-requests/:id/accepted-professionals', isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const userId = req.user.id;

      // Verify the request belongs to this user
      const request = await storage.getServiceRequest(requestId);
      if (!request || request.customerId !== userId) {
        return res.status(404).json({ message: "Service request not found" });
      }

      const acceptedProfessionals = await storage.getServiceRequestAcceptedProfessionals(requestId);
      res.json(acceptedProfessionals);
    } catch (error) {
      console.error("Error fetching accepted professionals:", error);
      res.status(500).json({ message: "Failed to fetch accepted professionals" });
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

  // Customer change password endpoint
  app.post('/api/change-password', isAuthenticated, async (req: any, res) => {
    try {
      console.log('🔐 Password change request received:', { userId: req.user.id, email: req.user.email });
      
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        console.log('❌ Missing password fields');
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 6) {
        console.log('❌ New password too short');
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      if (currentPassword === newPassword) {
        console.log('❌ Same password provided');
        return res.status(400).json({ message: "New password must be different from current password" });
      }

      // Get user from database
      console.log('📝 Getting user from database...');
      const user = await storage.getUser(userId);
      if (!user) {
        console.log('❌ User not found in database');
        return res.status(404).json({ message: "User not found" });
      }
      console.log('✅ User found:', { id: user.id, email: user.email });

      // Verify current password
      console.log('🔍 Verifying current password...');
      const bcrypt = await import('bcrypt');
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        console.log('❌ Current password is incorrect');
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      console.log('✅ Current password verified');

      // Hash new password
      console.log('🔐 Hashing new password...');
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      console.log('✅ New password hashed');

      // Update password in database
      console.log('💾 Updating password in database...');
      await storage.updateUserPassword(userId, hashedNewPassword);
      console.log('✅ Password updated in database');

      // Log user activity
      console.log('📝 Logging user activity...');
      await storage.logUserActivity({
        userId,
        userType: "customer",
        action: "password_changed",
        details: { passwordChanged: true },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      console.log('✅ Activity logged');

      console.log('🎉 Password change successful');
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("💥 Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
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
      const pendingApprovals = await storage.getServiceProviderCount('pending');
      const totalCustomers = await storage.getUserCount();
      const totalRequests = await storage.getServiceRequestCount();
      const activeRequests = await storage.getActiveServiceRequestCount();
      const completedJobs = await storage.getServiceRequestCount('completed');
      const monthlyRevenue = await storage.getMonthlyRevenue();

      res.json({
        totalProviders,
        activeProviders,
        pendingApprovals,
        totalCustomers,
        totalRequests,
        activeRequests,
        monthlyRevenue,
        completedJobs,
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

  // Provider Report API endpoint with ratings and status data
  app.get('/api/admin/providers/report', isAdminAuthenticated, async (req, res) => {
    console.log('🚀 API route /api/admin/providers/report called');
    try {
      const status = req.query.status as string;
      const rating = req.query.rating as string;
      console.log('📊 Calling getServiceProvidersForReport with:', { status, rating });
      const providers = await storage.getServiceProvidersForReport(status, rating);
      console.log('✅ Got providers:', providers.length);
      res.json(providers);
    } catch (error) {
      console.error('❌ Error fetching provider report data:', error);
      res.status(500).json({ message: 'Failed to fetch provider report data' });
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

      // Send approval congratulations email
      try {
        await sendProviderApprovalEmail(currentProvider.email, currentProvider.firstName);
        console.log(`Approval congratulations email sent to provider: ${currentProvider.email}`);
      } catch (emailError) {
        console.error(`Failed to send approval email to ${currentProvider.email}:`, emailError);
        // Don't fail approval if email fails
      }

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
        areaName: undefined, // Let admin optionally specify this later
      });

      // Generate postcode coverage for lead distribution
      await storage.calculateServiceAreaCoverage(serviceArea.id);

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
      
      // Get customer and category details for each request
      const requestsWithDetails = await Promise.all(
        serviceRequests.map(async (request) => {
          // Get customer details
          const customer = await storage.getUser(request.customerId);
          
          // Get category details
          const category = await storage.getServiceCategory(request.categoryId);
          
          return {
            id: request.id,
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer',
            customerEmail: customer?.email || 'No email',
            serviceCategory: category?.name || 'Unknown Category',
            location: request.suburb || request.postcode || 'Unknown Location',
            status: request.status,
            createdAt: request.createdAt,
            budget: request.budget,
            description: request.description
          };
        })
      );
      
      res.json(requestsWithDetails);
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

  // Get all customer users for admin management (renamed to avoid conflict)
  app.get('/api/admin/customer-users', isAdminAuthenticated, async (req, res) => {
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

  // Get provider interactions for a lead (admin only)
  app.get('/api/admin/leads/:id/interactions', isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const interactions = await storage.getProviderLeadInteractions(leadId);
      res.json(interactions);
    } catch (error) {
      console.error('Error fetching lead interactions:', error);
      res.status(500).json({ message: 'Failed to fetch lead interactions' });
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

  // Setup route to run database migrations
  app.post('/api/setup/run-migration', async (req, res) => {
    try {
      const { sql } = req.body;

      if (!sql) {
        return res.status(400).json({ message: 'SQL migration is required' });
      }

      // Execute the migration SQL
      await storage.executeMigration(sql);

      res.json({ message: 'Migration executed successfully' });
    } catch (error) {
      console.error('Error running migration:', error);
      res.status(500).json({ message: 'Failed to execute migration', error: error.message });
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
      const providerId = (req as any).provider?.id;
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

  app.get('/api/provider/leads/closed', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const closedLeads = await storage.getProviderClosedLeads(providerId);
      res.json(closedLeads);
    } catch (error: any) {
      console.error('Error fetching provider closed leads:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch provider closed leads' });
    }
  });

  app.get('/api/provider/activity', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
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

  // 🔔 REAL-TIME NOTIFICATION ROUTES
  // Provider app polls these endpoints for notifications
  app.get('/api/provider/notifications/poll', notificationRoutes.poll);
  app.get('/api/provider/notifications/long-poll', notificationRoutes.longPoll);
  app.get('/api/provider/notifications/stats', notificationRoutes.stats);

  app.post('/api/provider/leads/:requestId/purchase', isProviderAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const providerId = (req as any).provider?.id;

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      // Find the active offer for this request and provider directly from database
      const [activeOffer] = await db
        .select()
        .from(leadOffers)
        .where(
          and(
            eq(leadOffers.requestId, requestId),
            eq(leadOffers.providerId, providerId),
            eq(leadOffers.status, 'pending'),
            or(
              eq(leadOffers.isCurrentOffer, true),
              eq(leadOffers.offerType, 'shared')
            )
          )
        )
        .limit(1);

      if (!activeOffer) {
        return res.status(400).json({ success: false, message: 'No active offer found for this provider' });
      }

      const result = await storage.purchaseLeadWithCredit(providerId, activeOffer.id);

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

  // Provider credit system routes
  app.get('/api/provider/credit/balance', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const balance = await storage.getProviderCreditBalance(providerId);
      res.json({ balance });
    } catch (error) {
      console.error('Error getting credit balance:', error);
      res.status(500).json({ message: 'Failed to get credit balance' });
    }
  });

  app.get('/api/provider/credit/transactions', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const transactions = await storage.getProviderCreditTransactions(providerId);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting credit transactions:', error);
      res.status(500).json({ message: 'Failed to get credit transactions' });
    }
  });

  // Provider lead interaction tracking endpoint
  app.post('/api/provider/leads/:leadId/interaction', isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = (req as any).provider?.id;
      const { interactionType } = req.body;

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      if (!['call', 'sms', 'email'].includes(interactionType)) {
        return res.status(400).json({ message: 'Invalid interaction type' });
      }

      await storage.logProviderLeadInteraction({
        providerId,
        leadId,
        interactionType,
      });

      res.json({ success: true, message: 'Interaction logged successfully' });
    } catch (error) {
      console.error('Error logging provider interaction:', error);
      res.status(500).json({ message: 'Failed to log interaction' });
    }
  });

  // Provider lead status management endpoints
  app.get('/api/provider/leads/:leadId/status', isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = (req as any).provider?.id;

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const status = await storage.getProviderLeadStatus(providerId, leadId);
      res.json(status || { status: 'new', wasJobBooked: null });
    } catch (error) {
      console.error('Error getting provider lead status:', error);
      res.status(500).json({ message: 'Failed to get lead status' });
    }
  });

  app.put('/api/provider/leads/:leadId/status', isProviderAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const providerId = (req as any).provider?.id;
      const { status, wasJobBooked } = req.body;

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      if (!['new', 'open', 'closed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be new, open, or closed' });
      }

      // If closing a lead, wasJobBooked must be provided
      if (status === 'closed' && typeof wasJobBooked !== 'boolean') {
        return res.status(400).json({ message: 'wasJobBooked must be true or false when closing a lead' });
      }

      const updatedStatus = await storage.upsertProviderLeadStatus({
        providerId,
        leadId,
        status,
        wasJobBooked: status === 'closed' ? wasJobBooked : undefined,
      });

      // Send customer feedback email if job was completed successfully
      if (status === 'closed' && wasJobBooked === true) {
        try {
          const { sendCustomerFeedbackEmail } = await import('./emailService');

          // Get lead and provider details for the email
          const leadDetails = await storage.getServiceRequest(leadId);
          const providerDetails = await storage.getServiceProvider(providerId);
          const categoryDetails = await storage.getServiceCategory(leadDetails?.categoryId);

          if (leadDetails && providerDetails && categoryDetails) {
            // Get customer details including email
            const customerDetails = await storage.getUser(leadDetails.customerId);

            if (customerDetails) {
              const customerName = `${customerDetails.firstName || ''} ${customerDetails.lastName || ''}`.trim();
              const providerName = `${providerDetails.firstName || ''} ${providerDetails.lastName || ''}`.trim();

              // Create secure review token
              const reviewToken = await storage.createReviewToken(
                leadDetails.customerId,
                providerId,
                leadId
              );

              await sendCustomerFeedbackEmail(
                customerDetails.email,
                customerName,
                providerName,
                categoryDetails.name,
                leadDetails.suburb,
                reviewToken
              );

              console.log(`Feedback email sent to ${customerDetails.email} for completed ${categoryDetails.name} job`);
            } else {
              console.error(`Customer not found for customerId: ${leadDetails.customerId}`);
            }
          }
        } catch (emailError) {
          console.error('Error sending customer feedback email:', emailError);
          // Don't fail the API request if email fails
        }
      }

      res.json(updatedStatus);
    } catch (error) {
      console.error('Error updating provider lead status:', error);
      res.status(500).json({ message: 'Failed to update lead status' });
    }
  });

  app.get('/api/provider/lead-statuses', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const statuses = await storage.getProviderLeadStatuses(providerId);
      res.json(statuses);
    } catch (error) {
      console.error('Error getting provider lead statuses:', error);
      res.status(500).json({ message: 'Failed to get lead statuses' });
    }
  });

  app.post('/api/provider/credit/redeem-voucher', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const { voucherCode } = req.body;
      if (!voucherCode) {
        return res.status(400).json({ message: 'Voucher code is required' });
      }

      const result = await storage.redeemVoucher(providerId, voucherCode);
      res.json(result);
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      res.status(500).json({ message: 'Failed to redeem voucher' });
    }
  });

  app.get('/api/provider/vouchers/available', isProviderAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAvailableVouchers();
      res.json(vouchers);
    } catch (error) {
      console.error('Error getting available vouchers:', error);
      res.status(500).json({ message: 'Failed to get available vouchers' });
    }
  });

  // Provider billing data endpoint
  app.get('/api/provider/billing', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const billingData = await storage.getProviderBillingData(providerId);
      res.json(billingData);
    } catch (error) {
      console.error('Error getting provider billing data:', error);
      res.status(500).json({ message: 'Failed to get billing data' });
    }
  });

  // Provider billing information endpoint
  app.get('/api/provider/billing', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const billingData = await storage.getProviderBillingData(providerId);
      res.json(billingData);
    } catch (error) {
      console.error('Error getting provider billing data:', error);
      res.status(500).json({ message: 'Failed to get billing data' });
    }
  });

  // Admin voucher management endpoints
  app.get('/api/admin/vouchers', isAdminAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAllVouchersAdmin();
      res.json(vouchers);
    } catch (error) {
      console.error('Error getting vouchers for admin:', error);
      res.status(500).json({ message: 'Failed to get vouchers' });
    }
  });

  // Bulk create vouchers
  app.post('/api/admin/vouchers/bulk', isAdminAuthenticated, async (req, res) => {
    try {
      const { vouchers } = req.body;

      if (!vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
        return res.status(400).json({ message: 'Vouchers array is required' });
      }

      // Validate each voucher
      for (const voucher of vouchers) {
        if (!voucher.code || !voucher.value || !voucher.description) {
          return res.status(400).json({ message: 'Each voucher must have code, value, and description' });
        }
      }

      // Add default fields including 30-day expiry
      const vouchersWithDefaults = vouchers.map((voucher: any) => {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

        return {
          ...voucher,
          code: voucher.code.toUpperCase(),
          value: voucher.value.toString(),
          status: 'active',
          createdBy: 'admin',
          expiryDate,
        };
      });

      const result = await storage.createBulkVouchersAdmin(vouchersWithDefaults);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating bulk vouchers:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: 'One or more voucher codes already exist' });
      }
      res.status(500).json({ message: 'Failed to create vouchers' });
    }
  });

  app.post('/api/admin/vouchers', isAdminAuthenticated, async (req, res) => {
    try {
      const { code, value, description } = req.body;

      // Validate required fields
      if (!code || !value || !description) {
        return res.status(400).json({ message: 'Code, value, and description are required' });
      }

      // Add 30-day expiry to single voucher creation
      const now = new Date();
      const expiryDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

      const voucher = await storage.createVoucherAdmin({
        code: code.toUpperCase(),
        value: value.toString(),
        description,
        status: 'active',
        createdBy: 'admin',
        expiryDate,
      });

      res.status(201).json(voucher);
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: 'Voucher code already exists' });
      }
      res.status(500).json({ message: 'Failed to create voucher' });
    }
  });

  app.put('/api/admin/vouchers/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { code, value, description, usageLimit, expiresAt, isActive } = req.body;

      const updates: any = {};
      if (code !== undefined) updates.code = code.toUpperCase();
      if (value !== undefined) updates.value = value.toString();
      if (description !== undefined) updates.description = description;
      if (usageLimit !== undefined) updates.usageLimit = usageLimit;
      if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (isActive !== undefined) updates.isActive = isActive;

      const updatedVoucher = await storage.updateVoucherAdmin(parseInt(id), updates);

      if (!updatedVoucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }

      res.json(updatedVoucher);
    } catch (error: any) {
      console.error('Error updating voucher:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: 'Voucher code already exists' });
      }
      res.status(500).json({ message: 'Failed to update voucher' });
    }
  });

  // Reset voucher to active status
  app.put('/api/admin/vouchers/:id/reset', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const resetVoucher = await storage.resetVoucherAdmin(parseInt(id));

      if (!resetVoucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }

      res.json(resetVoucher);
    } catch (error) {
      console.error('Error resetting voucher:', error);
      res.status(500).json({ message: 'Failed to reset voucher' });
    }
  });

  app.delete('/api/admin/vouchers/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteVoucherAdmin(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: 'Voucher not found' });
      }

      res.json({ message: 'Voucher deleted successfully' });
    } catch (error) {
      console.error('Error deleting voucher:', error);
      res.status(500).json({ message: 'Failed to delete voucher' });
    }
  });

  // Admin test endpoint for manual lead processing (development only)
  app.post("/api/admin/test-lead-processing", async (req: any, res) => {
    try {
      // Simple admin auth check
      const token = req.headers['x-admin-token'];
      if (!token) {
        return res.status(401).json({ message: "Admin token required" });
      }

      const { leadId } = req.body;

      if (!leadId) {
        return res.status(400).json({ message: "Lead ID required" });
      }

      // Get the lead
      const lead = await storage.getServiceRequest(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      console.log(`Admin test: Processing lead ${leadId} for postcode ${lead.postcode}, category ${lead.categoryId}`);

      // Initialize lead distribution manually (bypassing 24-hour restriction)
      await storage.initializeLeadDistribution(leadId);

      // Get results to show what happened  
      const distributionLogs = await db.select()
        .from(leadDistributionLog)
        .where(eq(leadDistributionLog.requestId, leadId));

      const offers = await db.select()
        .from(leadOffers)
        .where(eq(leadOffers.requestId, leadId));

      res.json({
        message: `Lead ${leadId} processed successfully`,
        leadDetails: {
          id: lead.id,
          postcode: lead.postcode,
          categoryId: lead.categoryId,
          status: lead.status
        },
        results: {
          offersCreated: offers.length,
          distributionPhases: distributionLogs.length,
          providers: offers.map((o: any) => ({ providerId: o.providerId, status: o.status, offerType: o.offerType }))
        }
      });
    } catch (error: any) {
      console.error("Admin test lead processing error:", error);
      res.status(500).json({ message: "Failed to process lead", error: error.message });
    }
  });

  // Admin test endpoint for push notifications
  app.post("/api/admin/test-push-notification", async (req: any, res) => {
    try {
      const token = req.headers['x-admin-token'];
      if (!token) {
        return res.status(401).json({ message: "Admin token required" });
      }

      const { providerId, title, message } = req.body;

      if (!providerId) {
        return res.status(400).json({ message: "Provider ID required" });
      }

      console.log(`🧪 Admin test: Sending push notification to provider ${providerId}`);

      // Import and use the notification service
      const { providerNotificationService } = await import('./providerNotificationService');
      
      const result = await providerNotificationService.sendNotificationToProvider(parseInt(providerId), {
        title: title || "Test Notification from Admin",
        message: message || `Test push notification sent at ${new Date().toLocaleTimeString()}`,
        type: 'system',
        data: {
          test: true,
          timestamp: new Date().toISOString(),
          adminTriggered: true
        }
      });

      if (result) {
        res.json({ 
          message: `Push notification sent to provider ${providerId}`,
          success: true 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send push notification",
          success: false 
        });
      }

    } catch (error) {
      console.error("Error in test push notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });

  // Admin department management endpoints
  app.get('/api/admin/departments', isAdminAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      console.error('Error getting departments:', error);
      res.status(500).json({ message: 'Failed to get departments' });
    }
  });

  app.post('/api/admin/departments', isAdminAuthenticated, async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Department name is required' });
      }

      const departmentData = {
        name: name.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ message: 'Failed to create department' });
    }
  });

  app.put('/api/admin/departments/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Department name is required' });
      }

      const updatedDepartment = await storage.updateDepartment(parseInt(id), {
        name: name.trim(),
      });

      res.json(updatedDepartment);
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ message: 'Failed to update department' });
    }
  });

  app.delete('/api/admin/departments/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDepartment(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: 'Department not found' });
      }

      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ message: 'Failed to delete department' });
    }
  });

  // Get current admin user endpoint
  app.get('/api/admin/current-user', isAdminAuthenticated, async (req: any, res) => {
    try {
      // The admin info is already available from the middleware
      const adminInfo = req.admin;
      const username = adminInfo.username;

      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      // Return user info without password
      const { password, ...userInfo } = user;
      res.json(userInfo);
    } catch (error) {
      console.error("Error fetching current admin user:", error);
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });

  // Admin user management endpoints  
  app.get('/api/admin/users', isAdminAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();

      // Get departments for each user
      const usersWithDepartments = await Promise.all(
        users.map(async (user) => {
          const departments = await storage.getUserDepartments(user.id);
          return { ...user, departments };
        })
      );

      res.json(usersWithDepartments);
    } catch (error) {
      console.error('Error getting admin users:', error);
      res.status(500).json({ message: 'Failed to get admin users' });
    }
  });

  app.get('/api/admin/users/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getAdminUser(parseInt(id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const departments = await storage.getUserDepartments(user.id);
      res.json({ ...user, departments });
    } catch (error) {
      console.error('Error getting admin user:', error);
      res.status(500).json({ message: 'Failed to get admin user' });
    }
  });

  app.post('/api/admin/users', isAdminAuthenticated, async (req, res) => {
    try {
      const { username, firstName, lastName, email, password, role, departmentIds = [] } = req.body;

      // Validate required fields
      if (!username || !firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          message: 'Username, first name, last name, email, password, and role are required'
        });
      }

      // Validate role
      const validRoles = ['Administrator', 'Manager', 'Team Member'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: 'Role must be Administrator, Manager, or Team Member'
        });
      }

      // Check if username already exists
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      const userData = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: hashedPassword,
        role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = await storage.createAdminUser(userData);

      // Assign to departments if provided
      if (departmentIds.length > 0) {
        await storage.updateUserDepartments(user.id, departmentIds);
      }

      // Get user with departments for response
      const departments = await storage.getUserDepartments(user.id);
      res.status(201).json({ ...user, departments });
    } catch (error) {
      console.error('Error creating admin user:', error);
      res.status(500).json({ message: 'Failed to create admin user' });
    }
  });

  app.put('/api/admin/users/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { username, firstName, lastName, email, role, status, departmentIds = [] } = req.body;

      // Validate required fields
      if (!username || !firstName || !lastName || !email || !role || !status) {
        return res.status(400).json({
          message: 'Username, first name, last name, email, role, and status are required'
        });
      }

      // Validate role
      const validRoles = ['Administrator', 'Manager', 'Team Member'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: 'Role must be Administrator, Manager, or Team Member'
        });
      }

      // Validate status
      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Status must be active or inactive'
        });
      }

      // Check if username already exists (excluding current user)
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const updates = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        status,
      };

      const updatedUser = await storage.updateAdminUser(parseInt(id), updates);

      // Update department assignments
      await storage.updateUserDepartments(parseInt(id), departmentIds);

      // Get user with departments for response
      const departments = await storage.getUserDepartments(parseInt(id));
      res.json({ ...updatedUser, departments });
    } catch (error) {
      console.error('Error updating admin user:', error);
      res.status(500).json({ message: 'Failed to update admin user' });
    }
  });

  app.delete('/api/admin/users/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent deletion of main admin user (id: 1 or username: 'admin')
      const user = await storage.getAdminUser(parseInt(id));
      if (user && (user.id === 1 || user.username === 'admin')) {
        return res.status(403).json({ message: 'Cannot delete main admin user' });
      }

      const success = await storage.deleteAdminUser(parseInt(id));

      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin user:', error);
      res.status(500).json({ message: 'Failed to delete admin user' });
    }
  });

  // Change password endpoint
  app.post('/api/admin/change-password', isAdminAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.headers['x-admin-token'] as string;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
      }

      // Decode token to get admin username
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin-jwt-secret-key') as any;
      const username = decoded.username;

      // Get current admin user
      const adminUser = await storage.getAdminUserByUsername(username);
      if (!adminUser) {
        return res.status(404).json({ message: 'Admin user not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePasswords(currentPassword, adminUser.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await storage.updateAdminUser(adminUser.id, { password: hashedNewPassword });
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  });

  // Provider change password endpoint
  app.post('/api/provider/change-password', isProviderAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const providerId = (req as any).provider?.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
      }

      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      // Get current provider
      const provider = await storage.getProviderById(providerId);
      if (!provider) {
        return res.status(404).json({ message: 'Provider not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePasswords(currentPassword, provider.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await storage.updateProvider(providerId, { password: hashedNewPassword });
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing provider password:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  });

  // Review System API endpoints

  // Get review details by token (for review submission page)
  app.get('/api/review/:token', async (req, res) => {
    try {
      const { token } = req.params;

      const reviewData = await storage.getReviewToken(token);

      if (!reviewData) {
        return res.status(404).json({ message: 'Review token not found or expired' });
      }

      // Check if token is already used
      if (reviewData.isUsed) {
        return res.status(400).json({ message: 'Review has already been submitted' });
      }

      // Check if token is expired
      const now = new Date();
      if (new Date(reviewData.expiresAt) < now) {
        return res.status(400).json({ message: 'Review token has expired' });
      }

      res.json(reviewData);
    } catch (error) {
      console.error('Error getting review token:', error);
      res.status(500).json({ message: 'Failed to get review details' });
    }
  });

  // Submit customer review
  app.post('/api/review/submit', async (req, res) => {
    try {
      const reviewData = req.body;

      // Validate required fields
      if (!reviewData.token || !reviewData.overallRating || !reviewData.qualityRating ||
        !reviewData.professionalismRating || !reviewData.timelinessRating || !reviewData.valueRating) {
        return res.status(400).json({ message: 'All rating fields are required' });
      }

      // Validate rating values (1-5)
      const ratings = [
        reviewData.overallRating, reviewData.qualityRating, reviewData.professionalismRating,
        reviewData.timelinessRating, reviewData.valueRating
      ];

      for (const rating of ratings) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Ratings must be integers between 1 and 5' });
        }
      }

      // Get token details first
      const tokenData = await storage.getReviewToken(reviewData.token);
      if (!tokenData) {
        return res.status(404).json({ message: 'Invalid review token' });
      }

      if (tokenData.isUsed) {
        return res.status(400).json({ message: 'Review has already been submitted' });
      }

      if (new Date(tokenData.expiresAt) < new Date()) {
        return res.status(400).json({ message: 'Review token has expired' });
      }

      // Add token data to review
      reviewData.customerId = tokenData.customerId;
      reviewData.providerId = tokenData.providerId;
      reviewData.requestId = tokenData.requestId;

      const review = await storage.submitCustomerReview(reviewData);

      res.json({
        success: true,
        message: 'Thank you for your review! Your feedback helps improve our service quality.',
        review
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({
        message: error.message.includes('already submitted') ? error.message : 'Failed to submit review'
      });
    }
  });

  // Get provider reviews (public endpoint)
  app.get('/api/provider/:id/reviews', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const reviews = await storage.getProviderReviews(providerId);
      res.json(reviews);
    } catch (error) {
      console.error('Error getting provider reviews:', error);
      res.status(500).json({ message: 'Failed to get provider reviews' });
    }
  });

  // Get customer reviews (authenticated endpoint)
  app.get('/api/customer/reviews', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: 'Customer authentication required' });
      }

      const reviews = await storage.getCustomerReviews(customerId);
      res.json(reviews);
    } catch (error) {
      console.error('Error getting customer reviews:', error);
      res.status(500).json({ message: 'Failed to get customer reviews' });
    }
  });

  // Get customer lead settings (authenticated endpoint)
  app.get('/api/customer/lead-settings', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: 'Customer authentication required' });
      }

      const settings = await storage.getLeadSettings();
      res.json({
        providersCanRedeemCredits: settings.providersCanRedeemCredits
      });
    } catch (error) {
      console.error('Error getting customer lead settings:', error);
      res.status(500).json({ message: 'Failed to get customer lead settings' });
    }
  });

  // Customer credit system endpoints
  app.get('/api/customer/credit-balance', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: 'Customer authentication required' });
      }

      const balance = await storage.getCustomerCreditBalance(customerId);
      res.json({ balance });
    } catch (error) {
      console.error('Error getting customer credit balance:', error);
      res.status(500).json({ message: 'Failed to get credit balance' });
    }
  });

  app.get('/api/customer/credit-transactions', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: 'Customer authentication required' });
      }

      const transactions = await storage.getCustomerCreditTransactions(customerId);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting customer credit transactions:', error);
      res.status(500).json({ message: 'Failed to get credit transactions' });
    }
  });

  app.post('/api/customer/redeem-voucher', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ message: 'Customer authentication required' });
      }

      const { voucherCode } = req.body;
      if (!voucherCode) {
        return res.status(400).json({ message: 'Voucher code is required' });
      }

      const result = await storage.redeemCustomerVoucher(customerId, voucherCode);
      res.json(result);
    } catch (error) {
      console.error('Error redeeming customer voucher:', error);
      res.status(500).json({ message: 'Failed to redeem voucher' });
    }
  });

  // Customer available vouchers endpoint
  app.get('/api/customer/available-vouchers', isAuthenticated, async (req, res) => {
    try {
      const vouchers = await storage.getAvailableCustomerVouchers();
      res.json(vouchers);
    } catch (error) {
      console.error('Error getting available customer vouchers:', error);
      res.status(500).json({ message: 'Failed to get available vouchers' });
    }
  });

  // Potential Customers endpoints
  app.get('/api/admin/potential-customers', isAdminAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getAllPotentialCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error getting potential customers:', error);
      res.status(500).json({ message: 'Failed to get potential customers' });
    }
  });

  app.get('/api/admin/potential-customers/import-groups', isAdminAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getPotentialCustomerImportGroups();
      res.json(groups);
    } catch (error) {
      console.error('Error getting potential customer import groups:', error);
      res.status(500).json({ message: 'Failed to get import groups' });
    }
  });

  app.put('/api/admin/potential-customers/:id/status', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Customer ID and status are required' });
      }

      await storage.updatePotentialCustomerCampaignStatus(parseInt(id), status);
      res.json({ success: true, message: 'Customer status updated successfully' });
    } catch (error) {
      console.error('Error updating customer status:', error);
      res.status(500).json({ error: 'Failed to update customer status' });
    }
  });

  app.post('/api/admin/potential-customers/import', isAdminAuthenticated, async (req, res) => {
    try {
      console.log('Import request received:');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files ? Object.keys(req.files) : 'No files');

      // Get importName from FormData fields
      let importName = null;

      // With parseNested: true, FormData fields should be available in req.files
      if (req.files && req.files.importName) {
        // For text fields in FormData, the data is in the data property
        if (req.files.importName.data) {
          importName = req.files.importName.data.toString();
          console.log('Found importName in req.files.data:', importName);
        } else {
          // If it's not a file, it might be directly available
          importName = req.files.importName.toString();
          console.log('Found importName in req.files (direct):', importName);
        }
      } else if (req.body && req.body.importName) {
        // Fallback to req.body if not in FormData
        importName = req.body.importName;
        console.log('Found importName in req.body:', importName);
      } else {
        console.log('No importName found in any location');
        console.log('Available in req.files:', req.files ? Object.keys(req.files) : 'No files');
        console.log('Available in req.body:', Object.keys(req.body));
      }

      if (!importName) {
        console.log('Returning error: Import name is required');
        return res.status(400).json({ message: 'Import name is required' });
      }

      console.log('Processing import with name:', importName);

      // Check if this is a test import (no file)
      if (!req.files || !req.files.file) {
        console.log('No file provided, using sample data');
        // Use sample data for test imports
        const result = await storage.importPotentialCustomers(null, importName);
        res.json(result);
        return;
      }

      // Handle file upload
      const uploadedFile = req.files.file;

      if (!uploadedFile) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      console.log('Processing file upload:', uploadedFile.name);
      console.log('File object details:', {
        name: uploadedFile.name,
        size: uploadedFile.size,
        tempFilePath: uploadedFile.tempFilePath,
        mimetype: uploadedFile.mimetype
      });

      const result = await storage.importPotentialCustomers(uploadedFile, importName);
      res.json(result);
    } catch (error) {
      console.error('Error importing potential customers:', error);
      res.status(500).json({ message: 'Failed to import customers' });
    }
  });

  app.post(
    '/api/admin/potential-customers/send-sms',
    isAdminAuthenticated,
    async (req, res) => {
      try {
        const { customerIds } = req.body;

        console.log("📩 Incoming SMS Request - Customer IDs:", customerIds); // 👈 log request body

        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
          console.warn("⚠️ No customer IDs provided in SMS request"); // 👈 log warning
          return res.status(400).json({ message: 'No customer IDs provided' });
        }

        const result = await storage.sendSmsToPotentialCustomers(customerIds);
        console.log("✅ SMS Sending Result (summary):", { count: result.count });
        console.table(result.details || []);
        res.json(result);
      } catch (error) {
        console.error("❌ Error sending SMS to potential customers:", error); // 👈 log error
        res.status(500).json({ message: 'Failed to send SMS' });
      }
    }
  );


  // Execute campaign with unique vouchers
  app.post(
    '/api/admin/campaigns/execute',
    isAdminAuthenticated,
    async (req, res) => {
      try {
        const { 
          campaignId, 
          messageTemplate, 
          voucherAmount, 
          customerIds, 
          adminName 
        } = req.body;

        console.log("🎯 Executing campaign with unique vouchers:", { 
          campaignId, 
          voucherAmount, 
          customerCount: customerIds?.length 
        });

        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
          return res.status(400).json({ message: 'No customer IDs provided' });
        }

        if (!messageTemplate || !voucherAmount) {
          return res.status(400).json({ message: 'Message template and voucher amount are required' });
        }

        const results = [];
        let successCount = 0;
        let failureCount = 0;

        // Process each customer individually to generate unique vouchers
        for (const customerId of customerIds) {
          try {
            // Get customer details
            const [customer] = await db
              .select()
              .from(potentialCustomers)
              .where(eq(potentialCustomers.id, customerId));

            if (!customer) {
              console.warn(`[Campaign] Customer not found: id=${customerId}`);
              results.push({
                customerId,
                name: '',
                phone: '',
                status: 'skipped',
                sent: false,
                reason: 'not_found',
                voucherCode: null
              });
              failureCount++;
              continue;
            }

            // Normalize phone number
            const raw = (customer.phone || '').toString();
            const digits = raw.replace(/[^0-9+]/g, '');
            const normalizedPhone = digits.startsWith('+61') ? digits : 
                                  digits.startsWith('61') ? `+${digits}` : 
                                  digits.startsWith('0') ? `+61${digits.slice(1)}` : null;

            if (!normalizedPhone) {
              console.warn(`[Campaign] Invalid phone format: id=${customer.id} phone=${customer.phone}`);
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: 'skipped',
                sent: false,
                reason: 'invalid_phone',
                voucherCode: null
              });
              failureCount++;
              continue;
            }

            // Send SMS with unique voucher
            const voucherResult = await smsService.sendSmsWithVoucher(
              normalizedPhone,
              customer.name,
              messageTemplate,
              voucherAmount,
              {
                customerId: customer.id,
                adminName: adminName || 'admin',
                smsType: 'campaign'
              }
            );

            if (voucherResult.success) {
              // Update customer SMS status
              await storage.updatePotentialCustomerSmsStatus(customer.id, '1st_sent');
              
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: 'sent',
                sent: true,
                voucherCode: voucherResult.voucherCode,
                message: voucherResult.message
              });
              successCount++;
              
              console.log(`[Campaign] ✅ Sent to ${customer.name} with voucher ${voucherResult.voucherCode}`);
            } else {
              results.push({
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                status: 'failed',
                sent: false,
                reason: voucherResult.message || 'SMS send failed',
                voucherCode: null
              });
              failureCount++;
              
              console.log(`[Campaign] ❌ Failed to send to ${customer.name}: ${voucherResult.message}`);
            }

          } catch (error) {
            console.error(`[Campaign] Error processing customer ${customerId}:`, error);
            results.push({
              customerId,
              name: '',
              phone: '',
              status: 'failed',
              sent: false,
              reason: 'processing_error',
              voucherCode: null
            });
            failureCount++;
          }
        }

        console.log(`[Campaign] Execution complete: ${successCount} sent, ${failureCount} failed`);

        res.json({
          success: true,
          campaignId,
          totalCustomers: customerIds.length,
          sent: successCount,
          failed: failureCount,
          results
        });

      } catch (error) {
        console.error("❌ Error executing campaign:", error);
        res.status(500).json({ message: 'Failed to execute campaign' });
      }
    }
  );


  // Admin User Reports endpoint
  app.post('/api/admin/reports/users', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      // Verify admin token (you can implement proper admin auth here)
      // For now, we'll assume any token is valid for demo purposes

      const { fromDate, toDate } = req.body;

      if (!fromDate || !toDate) {
        return res.status(400).json({ message: 'Date range is required' });
      }

      const from = new Date(fromDate);
      const to = new Date(toDate);

      // Get user reports data for the specified date range
      const userReports = await storage.getUserReports(from, to);

      res.json(userReports);
    } catch (error) {
      console.error('Error getting user reports:', error);
      res.status(500).json({ message: 'Failed to get user reports' });
    }
  });

  // Terms and Conditions endpoints
  app.get('/api/admin/terms-conditions', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const terms = await storage.getTermsAndConditions();
      res.json(terms);
    } catch (error) {
      console.error('Error getting terms and conditions:', error);
      res.status(500).json({ message: 'Failed to get terms and conditions' });
    }
  });

  app.put('/api/admin/terms-conditions', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const { providersTerms, customersTerms, websiteTerms } = req.body;

      const updatedTerms = await storage.updateTermsAndConditions({
        providersTerms,
        customersTerms,
        websiteTerms,
      });

      res.json(updatedTerms);
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      res.status(500).json({ message: 'Failed to update terms and conditions' });
    }
  });

  // Provider lead settings endpoint (read-only for providers)
  app.get('/api/provider/lead-settings', isProviderAuthenticated, async (req, res) => {
    try {
      const providerId = (req as any).provider?.id;
      if (!providerId) {
        return res.status(401).json({ message: 'Provider authentication required' });
      }

      const settings = await storage.getLeadSettings();
      // Return settings that providers need to know about
      res.json({
        freeLeadsEnabled: settings.freeLeadsEnabled,
        providersCanRedeemCredits: settings.providersCanRedeemCredits
      });
    } catch (error) {
      console.error('Error getting lead settings:', error);
      res.status(500).json({ message: 'Failed to get lead settings' });
    }
  });



  // Lead Management Settings endpoints
  app.get('/api/admin/lead-management-settings', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const settings = await storage.getLeadManagementSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error getting lead management settings:', error);
      res.status(500).json({ message: 'Failed to get lead management settings' });
    }
  });

  app.put('/api/admin/lead-management-settings', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const updatedSettings = await storage.updateLeadManagementSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating lead management settings:', error);
      res.status(500).json({ message: 'Failed to update lead management settings' });
    }
  });

  // Service Categories management endpoints
  app.post('/api/admin/service-categories', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const newCategory = await storage.createServiceCategory(req.body);
      res.json(newCategory);
    } catch (error) {
      console.error('Error creating service category:', error);
      res.status(500).json({ message: 'Failed to create service category' });
    }
  });

  app.put('/api/admin/service-categories/:id', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const categoryId = parseInt(req.params.id);
      const updatedCategory = await storage.updateServiceCategory(categoryId, req.body);
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating service category:', error);
      res.status(500).json({ message: 'Failed to update service category' });
    }
  });

  app.delete('/api/admin/service-categories/:id', async (req, res) => {
    try {
      // Check admin authentication
      const adminToken = req.headers['x-admin-token'] as string;
      if (!adminToken) {
        return res.status(401).json({ message: 'Admin authentication required' });
      }

      const categoryId = parseInt(req.params.id);
      const deleted = await storage.deleteServiceCategory(categoryId);

      if (deleted) {
        res.json({ message: 'Service category deleted successfully' });
      } else {
        res.status(404).json({ message: 'Service category not found' });
      }
    } catch (error) {
      console.error('Error deleting service category:', error);
      res.status(500).json({ message: error.message || 'Failed to delete service category' });
    }
  });

  // Service category image upload endpoint
  app.post('/api/admin/service-categories/:id/image', isAdminAuthenticated, upload.single('image'), async (req, res) => {
    try {
      console.log('Image upload endpoint called');
      console.log('Headers:', req.headers);
      console.log('File:', req.file);
      console.log('Body:', req.body);

      if (!req.file) {
        console.log('No file provided');
        return res.status(400).json({ message: 'No image file provided' });
      }

      const categoryId = parseInt(req.params.id);
      console.log('Category ID:', categoryId);
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image URL:', imageUrl);

      // Update the service category with the image URL
      const updatedCategory = await storage.updateServiceCategoryImage(categoryId, imageUrl);
      console.log('Updated category:', updatedCategory);

      if (updatedCategory) {
        res.json({ 
          message: 'Image uploaded successfully', 
          imageUrl: imageUrl,
          category: updatedCategory 
        });
      } else {
        res.status(404).json({ message: 'Service category not found' });
      }
    } catch (error) {
      console.error('Error uploading service category image:', error);
      res.status(500).json({ message: error.message || 'Failed to upload image' });
    }
  });

  // Potential Customers endpoints
  app.get('/api/admin/potential-customers', isAdminAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getAllPotentialCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error getting potential customers:', error);
      res.status(500).json({ message: 'Failed to get potential customers' });
    }
  });

  app.get('/api/admin/potential-customers/import-groups', isAdminAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getPotentialCustomerImportGroups();
      res.json(groups);
    } catch (error) {
      console.error('Error getting import groups:', error);
      res.status(500).json({ message: 'Failed to get import groups' });
    }
  });

  app.post('/api/admin/potential-customers/import', isAdminAuthenticated, async (req, res) => {
    try {
      const { importName } = req.body;
      const file = req.files?.file;

      if (!file || !importName) {
        return res.status(400).json({ message: 'File and import name are required' });
      }

      const result = await storage.importPotentialCustomers(file, importName);
      res.json(result);
    } catch (error) {
      console.error('Error importing potential customers:', error);
      res.status(500).json({ message: error.message || 'Failed to import potential customers' });
    }
  });



  // Send individual SMS to a potential customer
  app.post('/api/admin/potential-customers/:id/send-sms', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { message, customMessage } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Customer ID is required' });
      }

      // Get customer details
      const [customer] = await db
        .select()
        .from(potentialCustomers)
        .where(eq(potentialCustomers.id, parseInt(id)));

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Determine SMS type based on current status (treat empty as not_sent)
      let smsType: '1st_sent' | '2nd_sent';
      if (customer.smsDeliveryStatus === 'not_sent' || !customer.smsDeliveryStatus) {
        smsType = '1st_sent';
      } else if (customer.smsDeliveryStatus === '1st_sent') {
        smsType = '2nd_sent';
      } else {
        return res.status(400).json({ message: 'Maximum SMS limit reached for this customer' });
      }

      // Send SMS
      let smsSent: boolean;
      if (customMessage) {
        // Send custom message
        smsSent = await smsService.sendSms(customer.phone, customMessage, {
          customerId: customer.id,
          smsType,
        });
        // record for UI
        smsService.recordOutbound({
          recipientType: 'potential_customer',
          recipientId: customer.id,
          recipientPhone: customer.phone,
          recipientName: customer.name,
          message: customMessage,
          smsType: 'custom',
          sentBy: (req as any).admin?.username || 'admin',
          status: 'sent',
        });
      } else {
        // Send template message (normalize phone same as bulk path)
        const raw = (customer.phone || '').toString();
        const digits = raw.replace(/[^0-9+]/g, '');
        const normalizedPhone = digits.startsWith('+61') ? digits : digits.startsWith('61') ? `+${digits}` : digits.startsWith('0') ? `+61${digits.slice(1)}` : null;
        if (!normalizedPhone) {
          return res.status(400).json({ message: 'Invalid phone format for this customer' });
        }
        const templateMessage = smsType === '1st_sent'
          ? `Hi ${customer.name}! 👋 \n\nServicePanda here! We noticed you might be looking for reliable service providers in your area.\n\nWe have pre-screened, verified professionals ready to help with your needs. Would you like to learn more about our services?\n\nReply YES to get started, or visit our website for more info.\n\nBest regards,\nServicePanda Team`
          : `Hi ${customer.name}! \n\nJust following up on our previous message about ServicePanda's verified service providers.\n\nWe're here to connect you with trusted professionals in your area. No obligation, just quality service connections.\n\nReply YES to learn more, or call us directly.\n\nServicePanda Team`;
        smsSent = await smsService.sendSms(normalizedPhone, templateMessage, { customerId: customer.id, smsType });
        smsService.recordOutbound({
          recipientType: 'potential_customer',
          recipientId: customer.id,
          recipientPhone: customer.phone,
          recipientName: customer.name,
          message: templateMessage,
          smsType,
          sentBy: (req as any).admin?.username || 'admin',
          status: 'sent',
        });
      }

      if (smsSent) {
        // Update SMS status
        await storage.updatePotentialCustomerSmsStatus(parseInt(id), smsType);

        res.json({
          success: true,
          message: `SMS ${smsType} sent successfully to ${customer.name}`,
          smsType,
          customerId: customer.id,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send SMS',
        });
      }
    } catch (error) {
      console.error('Error sending individual SMS:', error);
      res.status(500).json({ message: error.message || 'Failed to send SMS' });
    }
  });

  // SMS service status endpoint
  app.get('/api/admin/sms/status', isAdminAuthenticated, async (req, res) => {
    try {
      const status = smsService.getStatus();
      res.json(status);
    } catch (error) {
      console.error('Error getting SMS service status:', error);
      res.status(500).json({ message: 'Failed to get SMS service status' });
    }
  });

  // Get all SMS messages from DB (fallback to logs if DB not available)
  app.get('/api/admin/sms/messages', isAdminAuthenticated, async (req, res) => {
    try {
      // Disable caching so we don't get 304 responses that the frontend treats as errors
      res.set('Cache-Control', 'no-store');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      // Force a unique ETag every request to bypass conditional GETs (avoids 304)
      res.set('ETag', `${Date.now()}`);

      // Try DB read; ensure table exists first
      try {
        await db.execute(sql`CREATE TABLE IF NOT EXISTS sms_messages (
          id SERIAL PRIMARY KEY,
          recipient_type VARCHAR(20) NOT NULL,
          recipient_id INTEGER,
          recipient_phone VARCHAR NOT NULL,
          recipient_name VARCHAR,
          message TEXT NOT NULL,
          direction VARCHAR(20) NOT NULL,
          status VARCHAR(20) DEFAULT 'sent',
          sms_type VARCHAR(20),
          sent_by VARCHAR,
          sent_at TIMESTAMP DEFAULT NOW(),
          delivered_at TIMESTAMP,
          read_at TIMESTAMP,
          api_response TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`);

        const rows = await db
          .select()
          .from(smsMessages)
          .orderBy(desc(smsMessages.sentAt));

        // If DB is empty, fall back to in-memory logs so UI shows recent activity
        if (!rows || rows.length === 0) {
          const logs = smsService.getLogs();
          return res.status(200).json(logs);
        }

        return res.status(200).json(rows);
      } catch (e) {
        console.warn('DB fetch for sms_messages failed, falling back to in-memory logs');
        const logs = smsService.getLogs();
        return res.status(200).json(logs);
      }
    } catch (error) {
      console.error('Error getting SMS messages:', error);
      res.status(500).json({ message: 'Failed to get SMS messages' });
    }
  });

  // Admin-only: Insert a test SMS row to verify UI wiring quickly
  app.post('/api/admin/sms/messages/debug-add', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { recipientPhone = '+61400000000', recipientName = 'Debug User', message = 'Test SMS from debug endpoint' } = req.body || {};

      // Ensure table exists
      await db.execute(sql`CREATE TABLE IF NOT EXISTS sms_messages (
        id SERIAL PRIMARY KEY,
        recipient_type VARCHAR(20) NOT NULL,
        recipient_id INTEGER,
        recipient_phone VARCHAR NOT NULL,
        recipient_name VARCHAR,
        message TEXT NOT NULL,
        direction VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'sent',
        sms_type VARCHAR(20),
        sent_by VARCHAR,
        sent_at TIMESTAMP DEFAULT NOW(),
        delivered_at TIMESTAMP,
        read_at TIMESTAMP,
        api_response TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`);

      await db.insert(smsMessages).values({
        recipientType: 'potential_customer',
        recipientPhone,
        recipientName,
        message,
        direction: 'outbound',
        status: 'sent',
        sentBy: (req as any).admin?.username || 'admin',
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.json({ success: true });
    } catch (error) {
      console.error('debug-add sms failed:', error);
      res.status(500).json({ success: false, message: 'Failed to insert debug sms' });
    }
  });

  // Potential Providers endpoints
  app.get('/api/admin/potential-providers', isAdminAuthenticated, async (req, res) => {
    try {
      // Get the admin username and role from the authenticated user
      const adminUsername = (req as any).admin?.username;
      const adminRole = (req as any).admin?.role;
      const isSuperAdmin = adminRole === 'administrator' || adminRole === 'super_admin';
      
      console.log('Admin username from request:', adminUsername);
      console.log('Admin role:', adminRole);
      console.log('Is super admin:', isSuperAdmin);
      
      const providers = await storage.getAllPotentialProviders(adminUsername, isSuperAdmin);
      res.json(providers);
    } catch (error) {
      console.error('Error getting potential providers:', error);
      res.status(500).json({ message: 'Failed to get potential providers' });
    }
  });

  app.post('/api/admin/potential-providers', isAdminAuthenticated, async (req, res) => {
    try {
      const providerData = req.body;
      const result = await storage.createPotentialProvider(providerData);
      res.json(result);
    } catch (error) {
      console.error('Error creating potential provider:', error);
      res.status(500).json({ message: 'Failed to create potential provider' });
    }
  });

  app.post('/api/admin/potential-providers/import', isAdminAuthenticated, async (req, res) => {
    try {
      const { importName, csvData } = req.body;

      if (!importName) {
        return res.status(400).json({ message: 'Import name is required' });
      }


      const result = await storage.importPotentialProviders(csvData, importName);
      res.json(result);
    } catch (error) {
      console.error('Error importing potential providers:', error);
      res.status(500).json({ message: 'Failed to import potential providers' });
    }
  });

  app.post('/api/admin/potential-providers/confirm-import', isAdminAuthenticated, async (req, res) => {
    try {
      const { importId, providers } = req.body;

      if (!providers || !Array.isArray(providers)) {
        return res.status(400).json({ message: 'Providers data is required' });
      }

      const result = await storage.confirmPotentialProvidersImport(providers);
      res.json(result);
    } catch (error) {
      console.error('Error confirming potential providers import:', error);
      res.status(500).json({ message: 'Failed to confirm import' });
    }
  });

  app.patch('/api/admin/potential-providers/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await storage.updatePotentialProvider(parseInt(id), updateData);
      res.json(result);
    } catch (error) {
      console.error('Error updating potential provider:', error);
      res.status(500).json({ message: 'Failed to update potential provider' });
    }
  });

  app.post('/api/admin/potential-providers/tasks', isAdminAuthenticated, async (req, res) => {
    try {
      const taskData = req.body;
      const result = await storage.createPotentialProviderTask(taskData);
      res.json(result);
    } catch (error) {
      console.error('Error creating potential provider task:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  });

  app.post('/api/admin/potential-providers/email', isAdminAuthenticated, async (req, res) => {
    try {
      const { potentialProviderId, subject, content } = req.body;
      const result = await storage.sendEmailToPotentialProvider(potentialProviderId, subject, content);
      res.json(result);
    } catch (error) {
      console.error('Error sending email to potential provider:', error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  });

  app.post('/api/admin/potential-providers/sms', isAdminAuthenticated, async (req, res) => {
    try {
      const { potentialProviderId, content } = req.body;
      const result = await storage.sendSmsToPotentialProvider(potentialProviderId, content);
      res.json(result);
    } catch (error) {
      console.error('Error sending SMS to potential provider:', error);
      res.status(500).json({ message: 'Failed to send SMS' });
    }
  });

  app.post('/api/admin/potential-providers/:id/convert', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.convertPotentialProviderToProvider(parseInt(id));
      res.json(result);
    } catch (error) {
      console.error('Error converting potential provider:', error);
      res.status(500).json({ message: 'Failed to convert provider' });
    }
  });

  // Provider Reports endpoint
  app.get('/api/admin/reports/providers', isAdminAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getProviderReports();
      res.json(reports);
    } catch (error) {
      console.error('Error getting provider reports:', error);
      res.status(500).json({ message: 'Failed to get provider reports' });
    }
  });

  // Email Management Routes
  app.get('/api/admin/emails', isAdminAuthenticated, async (req, res) => {
    try {
      const { tab, user, search, fromDate, toDate } = req.query;

      // Get emails based on filters
      const emails = await storage.getEmails({
        tab: tab as string || 'inbox',
        userId: user as string || 'all',
        search: search as string || '',
        fromDate: fromDate as string || '',
        toDate: toDate as string || '',
        isAdmin: true
      });

      res.json(emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      res.status(500).json({ message: 'Failed to fetch emails' });
    }
  });

  // Test email service endpoint (no auth required for testing)
  app.post('/api/test/email', async (req, res) => {
    try {
      const { to, subject, body } = req.body;

      if (!to || !subject || !body) {
        return res.status(400).json({ message: 'To, subject, and body are required' });
      }

      // Check Mailgun configuration
      const mailgunKeys = await storage.getDecryptedMailgunKeys();
      if (!mailgunKeys) {
        return res.status(500).json({
          message: 'Email service not configured. Please configure Mailgun settings first.',
          mailgunConfigured: false
        });
      }

      // Test email sending
      const emailSent = await sendEmail({
        to,
        subject,
        text: body,
        html: body
      });

      if (emailSent) {
        res.json({
          success: true,
          message: 'Test email sent successfully',
          mailgunConfigured: true
        });
      } else {
        res.status(500).json({
          message: 'Test email failed to send',
          mailgunConfigured: true
        });
      }
    } catch (error) {
      console.error('Error in test email:', error);
      res.status(500).json({
        message: 'Test email error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        mailgunConfigured: false
      });
    }
  });

  // Update email status (archive, trash, spam, etc.)
  app.patch('/api/admin/emails/:id/status', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, folder } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      // Update email status in database
      const updatedEmail = await storage.updateEmailStatus(parseInt(id), status);

      res.json({
        message: 'Email status updated successfully',
        email: updatedEmail
      });
    } catch (error) {
      console.error('Error updating email status:', error);
      res.status(500).json({ message: 'Failed to update email status', error: error.message });
    }
  });

  app.post('/api/admin/emails/send', isAdminAuthenticated, async (req, res) => {

    console.log("Hello");
    try {
      const { to, cc, bcc, subject, body, template, status } = req.body;

      if (!to || !subject || !body) {
        return res.status(400).json({ message: 'To, subject, and body are required' });
      }

      // Get the admin user's ID from the database
      const adminUser = await storage.getAdminUserByUsername((req as any).admin?.username);
      const adminUserId = adminUser?.id?.toString() || (req as any).admin?.username || "admin";
      console.log('Admin user lookup:', { username: (req as any).admin?.username, adminUser, adminUserId });

      // Check if this is a draft (don't send via email service)
      if (status === 'draft') {
        // Store draft in database
        const emailData = {
          from: 'hrms.devdoc@gmail.com',
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
          status: 'draft',
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: 'normal',
          folder: 'draft',
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: 'admin',
          sentAt: null,
        };

        await storage.createEmail(emailData);

        res.json({
          success: true,
          message: 'Draft saved successfully'
        });
        return;
      }


      // Send email using existing email service
      const emailSent = await sendEmail({
        to,
        cc,
        bcc,
        subject,
        text: body,
        html: body
      });

      if (emailSent) {
        // Store email in database
        const emailData = {
          from: 'hrms.devdoc@gmail.com',
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
          status: 'sent',
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: 'normal',
          folder: 'sent',
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: 'admin',
          sentAt: new Date(),
        };

        await storage.createEmail(emailData);

        res.json({
          success: true,
          message: 'Email sent successfully',
          debug: { adminUserId, adminUsername: (req as any).admin?.username }
        });
      } else {
        // Ensure the composed message is still visible in Sent even if delivery fails
        const emailData = {
          from: 'hrms.devdoc@gmail.com',
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
          status: 'sent',
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: 'normal',
          folder: 'sent',
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: 'admin',
          sentAt: new Date(),
        };

        await storage.createEmail(emailData);

        res.json({
          success: false,
          message: 'Email could not be delivered via Mailgun, but has been saved in Sent. dddd'
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);

      // Try to save the email as failed for debugging
      try {
        // Get the admin user's ID from the database for error case
        const adminUser = await storage.getAdminUserByUsername((req as any).admin?.username);
        const adminUserId = adminUser?.id?.toString() || (req as any).admin?.username || "admin";
        
        const { to, cc, bcc, subject, body } = req.body;
        const emailData = {
          from: 'hrms.devdoc@gmail.com',
          to,
          cc,
          bcc,
          subject,
          body,
          bodyHtml: body,
          status: 'sent',
          isRead: false,
          isStarred: false,
          hasAttachments: false,
          priority: 'normal',
          folder: 'sent',
          // Scope email to the logged-in admin user
          userId: adminUserId,
          userType: 'admin',
          sentAt: new Date(),
        };

        await storage.createEmail(emailData);
      } catch (saveError) {
        console.error('Failed to save failed email:', saveError);
      }

      res.json({
        success: false,
        message: 'Email delivery failed, but the message has been saved in Sent.'
      });
    }
  });

  // Bulk update email status (archive, trash, spam, draft, etc.)
  app.patch('/api/admin/emails/bulk-status', isAdminAuthenticated, async (req, res) => {
    try {
      const { ids, status } = req.body as { ids: number[]; status: string };
      if (!Array.isArray(ids) || ids.length === 0 || !status) {
        return res.status(400).json({ message: 'ids (number[]) and status are required' });
      }

      const count = await storage.bulkUpdateEmailStatus(ids, status);
      // Return updated emails so the UI can refresh without re-fetching all tabs if desired
      const updated = await Promise.all(ids.map((id) => storage.getEmail(id)));
      res.json({ message: 'Email statuses updated', count, updated });
    } catch (error) {
      console.error('Error in bulk status update:', error);
      res.status(500).json({ message: 'Failed to update email statuses' });
    }
  });

  // Bulk delete emails permanently
  app.post('/api/admin/emails/bulk-delete', isAdminAuthenticated, async (req, res) => {
    try {
      const { ids } = req.body as { ids: number[] };
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'ids (number[]) are required' });
      }

      const count = await storage.deleteEmails(ids);
      res.json({ message: 'Emails deleted', count });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      res.status(500).json({ message: 'Failed to delete emails' });
    }
  });

  app.patch('/api/admin/emails/:id/status', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const result = await storage.updateEmailStatus(parseInt(id), status);
      res.json(result);
    } catch (error) {
      console.error('Error updating email status:', error);
      res.status(500).json({ message: 'Failed to update email status' });
    }
  });

  app.get('/api/admin/emails/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const email = await storage.getEmail(parseInt(id));

      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }

      res.json(email);
    } catch (error) {
      console.error('Error fetching email:', error);
      res.status(500).json({ message: 'Failed to fetch email' });
    }
  });

  // Mark email as read
  app.patch('/api/admin/emails/:id/read', isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const email = await storage.markEmailAsRead(parseInt(id));

      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }

      res.json({ message: 'Email marked as read', email });
    } catch (error) {
      console.error('Error marking email as read:', error);
      res.status(500).json({ message: 'Failed to mark email as read' });
    }
  });

  // Set read/unread state (single or bulk)
  app.patch('/api/admin/emails/read-state', isAdminAuthenticated, async (req, res) => {
    try {
      const { ids, read } = req.body as { ids: number[]; read: boolean };
      if (!Array.isArray(ids) || typeof read !== 'boolean') {
        return res.status(400).json({ message: 'ids (number[]) and read (boolean) are required' });
      }

      const updated: any[] = [];
      for (const id of ids) {
        const email = await storage.setEmailReadState(id, read);
        updated.push(email);
      }
      res.json({ message: 'Read state updated', count: updated.length });
    } catch (error) {
      console.error('Error updating read state:', error);
      res.status(500).json({ message: 'Failed to update read state' });
    }
  });

  // ============================================================================
  // TEAM TASK MANAGEMENT API ROUTES
  // ============================================================================

  // Get all team tasks with optional filters
  app.get('/api/admin/team-tasks', isAdminAuthenticated, async (req, res) => {
    try {
      const { status, priority, customerType, assignedTo, adminId } = req.query;
      const filters = {
        status: status as string,
        priority: priority as string,
        customerType: customerType as string,
        assignedTo: assignedTo as string,
        adminId: adminId as string,
      };
      
      const tasks = await storage.getTeamTasks(filters);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching team tasks:', error);
      res.status(500).json({ message: 'Failed to fetch team tasks' });
    }
  });

  // Get team tasks for Kanban view
  app.get('/api/admin/team-tasks/kanban', isAdminAuthenticated, async (req, res) => {
    try {
      const showAll = req.query.all === 'true';
      const adminInfo = (req as any).admin;
      
      let filterBy = null;
      
      if (showAll && (adminInfo.role === 'administrator' || adminInfo.role === 'super_admin')) {
        // Super admin can see all tasks
        filterBy = null;
      } else {
        // For all other users (managers, team members, etc), filter by assignedTo field
        // This ensures they see tasks assigned to them, regardless of who created them
        filterBy = 'assignedTo:' + adminInfo.username;
      }
      
      console.log('Kanban tasks - User:', adminInfo.username, 'Role:', adminInfo.role, 'FilterBy:', filterBy);
      
      const kanbanData = await storage.getTeamTasksForKanban(filterBy);
      res.json(kanbanData);
    } catch (error) {
      console.error('Error fetching team tasks for kanban:', error);
      res.status(500).json({ message: 'Failed to fetch kanban data' });
    }
  });

  // Get single team task
  app.get('/api/admin/team-tasks/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTeamTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Error fetching team task:', error);
      res.status(500).json({ message: 'Failed to fetch team task' });
    }
  });

  // Create new team task
  app.post('/api/admin/team-tasks', isAdminAuthenticated, async (req, res) => {
    try {
      const taskData = req.body;
      console.log('Received task data:', taskData);
      
      // Validate required fields
      if (!taskData.title || !taskData.dueDate || !taskData.adminId) {
        console.log('Missing required fields:', {
          title: taskData.title,
          dueDate: taskData.dueDate,
          adminId: taskData.adminId
        });
        return res.status(400).json({ 
          message: 'Missing required fields: title, dueDate, adminId' 
        });
      }

      // Ensure only one customer type is set
      const customerTypes = [
        taskData.potentialProviderId,
        taskData.providerId,
        taskData.customerId
      ].filter(Boolean);
      
      if (customerTypes.length > 1) {
        return res.status(400).json({ 
          message: 'Only one customer type can be set per task' 
        });
      }

      // Convert dueDate to proper format for database
      const taskDataForDb = {
        ...taskData,
        dueDate: new Date(taskData.dueDate)
      };
      
      console.log('Task data for database:', taskDataForDb);
      const newTask = await storage.createTeamTask(taskDataForDb);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating team task:', error);
      res.status(500).json({ message: 'Failed to create team task' });
    }
  });

  // Update team task
  app.put('/api/admin/team-tasks/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const updates = req.body;
      
      // Remove fields that shouldn't be updated directly
      delete updates.id;
      delete updates.createdAt;
      delete updates.updatedAt;

      const updatedTask = await storage.updateTeamTask(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating team task:', error);
      res.status(500).json({ message: 'Failed to update team task' });
    }
  });

  // Delete team task
  app.delete('/api/admin/team-tasks/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      await storage.deleteTeamTask(taskId);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting team task:', error);
      res.status(500).json({ message: 'Failed to delete team task' });
    }
  });

  // SMS Campaigns API endpoints
  // Get all SMS campaigns
  app.get('/api/admin/sms/campaigns', isAdminAuthenticated, async (req, res) => {
    try {
      const campaigns = await storage.getSmsCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error('Error fetching SMS campaigns:', error);
      res.status(500).json({ message: 'Failed to fetch SMS campaigns' });
    }
  });

  // Create new SMS campaign
  app.post('/api/admin/sms/campaigns', isAdminAuthenticated, async (req, res) => {
    try {
      const campaignData = req.body;
      
      // Validate required fields
      if (!campaignData.name || !campaignData.name.trim()) {
        return res.status(400).json({ message: 'Campaign name is required' });
      }
      
      if (!campaignData.message || !campaignData.message.trim()) {
        return res.status(400).json({ message: 'Campaign message is required' });
      }
      
      // Ensure selectedStates and selectedStatuses are arrays
      if (!Array.isArray(campaignData.selectedStates)) {
        campaignData.selectedStates = [];
      }
      
      if (!Array.isArray(campaignData.selectedStatuses)) {
        campaignData.selectedStatuses = [];
      }
      
      console.log('[SMS Campaign] Creating campaign with data:', JSON.stringify(campaignData, null, 2));
      
      const campaign = await storage.createSmsCampaign(campaignData);
      
      console.log('[SMS Campaign] Campaign created successfully:', campaign.id);
      res.status(201).json(campaign);
    } catch (error: any) {
      console.error('[SMS Campaign] Error creating SMS campaign:', error);
      console.error('[SMS Campaign] Error details:', error.message);
      console.error('[SMS Campaign] Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Failed to create SMS campaign',
        error: error.message || 'Unknown error'
      });
    }
  });

  // Update SMS campaign
  app.put('/api/admin/sms/campaigns/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaignData = req.body;
      const campaign = await storage.updateSmsCampaign(campaignId, campaignData);
      res.json(campaign);
    } catch (error) {
      console.error('Error updating SMS campaign:', error);
      res.status(500).json({ message: 'Failed to update SMS campaign' });
    }
  });

  // Delete SMS campaign
  app.delete('/api/admin/sms/campaigns/:id', isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      await storage.deleteSmsCampaign(campaignId);
      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      console.error('Error deleting SMS campaign:', error);
      res.status(500).json({ message: 'Failed to delete SMS campaign' });
    }
  });

  // Send SMS campaign
  app.post('/api/admin/sms/campaigns/:id/send', isAdminAuthenticated, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { customerIds, adminName } = req.body;
      
      const result = await storage.sendSmsCampaign(campaignId, customerIds, adminName);
      res.json(result);
    } catch (error) {
      console.error('Error sending SMS campaign:', error);
      res.status(500).json({ message: 'Failed to send SMS campaign' });
    }
  });

  // SMS Messages API endpoints for chat functionality
  // Get all SMS messages
  app.get('/api/admin/sms/messages', isAdminAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getSmsMessages();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching SMS messages:', error);
      res.status(500).json({ message: 'Failed to fetch SMS messages' });
    }
  });

  // Send individual SMS message
  app.post('/api/admin/sms/send', isAdminAuthenticated, async (req, res) => {
    try {
      console.log('📱 [Route] SMS send request received:', req.body);
      const { customerId, message } = req.body;
      
      if (!customerId || !message) {
        console.error('📱 [Route] Missing required fields:', { customerId, message });
        return res.status(400).json({ message: 'Missing customerId or message' });
      }
      
      console.log('📱 [Route] Calling storage.sendIndividualSms...');
      const result = await storage.sendIndividualSms(customerId, message);
      console.log('📱 [Route] SMS send result:', result);
      res.json(result);
    } catch (error) {
      console.error('📱 [Route] Error sending SMS:', error);
      console.error('📱 [Route] Error stack:', error.stack);
      res.status(500).json({ message: 'Failed to send SMS' });
    }
  });

  // Webhook endpoint for incoming SMS replies (from Dialpad)
  app.post('/api/sms/webhook', async (req, res) => {
    try {
      console.log('📨 [Webhook] Received SMS webhook:', JSON.stringify(req.body, null, 2));
      
      // Handle different Dialpad payload formats
      const { from, to, body, messageId, text, sender, recipient } = req.body;
      
      // Extract phone numbers and message from different possible formats
      const fromPhone = from || sender;
      const toPhone = to || recipient;
      const messageText = body || text;
      
      if (!fromPhone || !messageText) {
        console.error('❌ [Webhook] Missing required fields:', { fromPhone, messageText });
        return res.status(400).json({ 
          message: 'Missing required fields: from/sender and body/text' 
        });
      }
      
      console.log(`📱 [Webhook] Processing SMS from ${fromPhone}: "${messageText}"`);
      
      // Check if customer replied with STOP (case-insensitive)
      const isStopRequest = messageText.trim().toUpperCase() === 'STOP';
      
      if (isStopRequest) {
        console.log('🛑 [Webhook] Customer requested to STOP - processing unsubscribe...');
        
        // Find customer and update status to Unsubscribe
        const customer = await storage.findPotentialCustomerByPhone(fromPhone);
        if (customer) {
          await storage.updatePotentialCustomerStatus(customer.id, 'Unsubscribe');
          console.log(`✅ [Webhook] Customer ${customer.name} (ID: ${customer.id}) unsubscribed successfully`);
        } else {
          console.warn(`⚠️ [Webhook] Customer not found for phone: ${fromPhone}`);
        }
      }
      
      // Store incoming message (with unsubscribe status if applicable)
      await storage.storeIncomingSms(fromPhone, toPhone, messageText, messageId, isStopRequest);
      
      console.log('✅ [Webhook] SMS stored successfully' + (isStopRequest ? ' - Customer unsubscribed' : ''));
      res.status(200).json({ 
        message: 'SMS received successfully',
        unsubscribed: isStopRequest 
      });
    } catch (error) {
      console.error('❌ [Webhook] Error processing incoming SMS:', error);
      res.status(500).json({ message: 'Failed to process SMS' });
    }
  });

  // Role and Permission Management API endpoints
  app.get("/api/admin/roles", isAdminAuthenticated, async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.get("/api/admin/permissions", isAdminAuthenticated, async (req, res) => {
    try {
      const permissions = await storage.getPermissions();
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });

  app.get("/api/admin/roles/:id/permissions", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      const permissions = await storage.getRolePermissions(roleId);
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      res.status(500).json({ message: "Failed to fetch role permissions" });
    }
  });

  app.post("/api/admin/roles", isAdminAuthenticated, async (req, res) => {
    try {
      const { name, description, permissions } = req.body;
      const role = await storage.createRole({ name, description, permissions });
      res.json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put("/api/admin/roles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      const { name, description, permissions } = req.body;
      const role = await storage.updateRole(roleId, { name, description, permissions });
      res.json(role);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete("/api/admin/roles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      await storage.deleteRole(roleId);
      res.json({ message: "Role deleted successfully" });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ message: "Failed to delete role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

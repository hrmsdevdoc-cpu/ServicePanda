# ServicePanda - Multi-Platform Service Provider Marketplace

## Overview

ServicePanda is a comprehensive service provider marketplace consisting of three main applications:
1. **ServicePanda** - Customer-facing application for requesting services
2. **ServicePandaPartners** - Service provider application for managing business operations
3. **Admin Dashboard** - Backend management system for approving providers and managing the platform

The platform connects customers with service providers across various categories including domestic cleaning, bond cleaning, carpet cleaning, pest control, gardening, removals, handyman services, and electrical work.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom ServicePanda theme colors
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon Database with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: express-session with PostgreSQL session store
- **File Uploads**: Multer middleware for document handling

### Database Design
The system uses a comprehensive PostgreSQL schema with the following key entities:
- **Users**: Core user authentication and profile data
- **Service Providers**: Extended provider information and verification status
- **Service Categories**: Predefined service types with icons
- **Service Requests**: Customer service inquiries and requirements
- **Lead Assignments**: Matching system between customers and providers
- **Australian Geography**: States and suburbs for location-based services
- **Document Management**: Provider license, insurance, and police check storage
- **Email System**: Template-based email management with tracking
- **Audit Logging**: User activity and system event tracking

## Key Components

### Authentication System
- **Provider**: Replit Auth with OAuth support (Gmail, Apple, Facebook)
- **Sessions**: Secure session management with PostgreSQL storage
- **Authorization**: Role-based access control for customers, providers, and admins

### Service Provider Onboarding
- **Multi-step Registration**: Personal details, service selection, service areas, document upload
- **Document Verification**: License, police check, and insurance validation
- **Approval Workflow**: Admin review and approval process
- **Geographic Coverage**: Australian state and suburb selection system

### Lead Management System
- **Quote Requests**: Customers submit service requirements
- **Provider Matching**: Automatic distribution to relevant providers in service areas
- **Lead Assignment**: Tracking system for quote responses and job assignments

### File Upload System
- **Document Types**: PDF, JPG, JPEG, PNG support
- **Storage**: Local filesystem with 10MB file size limits
- **Validation**: File type and size validation with error handling

## Data Flow

### Customer Journey
1. Customer visits landing page and views available services
2. Authentication via Replit Auth (optional for browsing)
3. Service selection and requirement specification
4. Quote request submission
5. Automatic provider matching and notification
6. Provider responses and job assignment

### Provider Journey
1. Multi-step registration with document upload
2. Admin review and approval process
3. Dashboard access for managing leads and profile
4. Lead acceptance and customer interaction
5. Job completion and payment processing

### Admin Operations
1. Provider application review and approval
2. Document verification and compliance checking
3. System monitoring and user management
4. Email template management and communication oversight

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@radix-ui/react-***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **express**: Web server framework
- **multer**: File upload handling
- **zod**: Runtime type validation

### Development Dependencies
- **typescript**: Type checking and compilation
- **vite**: Build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration tools

### Authentication Integration
- **openid-client**: OpenID Connect implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database with connection pooling
- **File Storage**: Local filesystem for development
- **Authentication**: Replit Auth integration

### Production Deployment
- **Build Process**: Vite production build with optimizations
- **Server**: Express.js with production middleware
- **Database**: PostgreSQL with connection pooling and migrations
- **Static Assets**: Served from dist/public directory
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, authentication credentials

### Database Management
- **Schema**: Centralized schema definition in shared/schema.ts
- **Migrations**: Drizzle migrations in dedicated migrations directory
- **Seeding**: Initial data population for service categories and geography

The system is designed for scalability with proper separation of concerns, comprehensive error handling, and production-ready authentication and session management.
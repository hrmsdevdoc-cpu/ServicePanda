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
- **Provider**: Custom email/password authentication with scrypt hashing and salt
- **Sessions**: Secure session management with PostgreSQL storage using connect-pg-simple
- **Authorization**: Role-based access control for customers, providers, and admins
- **Frontend**: React Query-based authentication hooks with login/register/logout mutations
- **Security**: Password hashing using Node.js crypto module with scrypt and salt
- **Auth Flow**: Custom auth page with login/register tabs, redirects to return URL after authentication

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

## Recent Changes (January 2025)

### Provider Dashboard Panel System Implementation (January 19, 2025)
- **Exact Provider Registration Step Replication**: Replicated provider registration Steps 2, 3, and 4 as dashboard panels under Settings menu
- **Services Panel**: Perfect replica of Step 2 with compact grid (grid-cols-4 md:grid-cols-6 lg:grid-cols-8), service icons, blue selection styling, and validation messaging - removes Previous/Next buttons for standalone editing
- **Service Area Panel**: Identical Step 3 implementation using LocationServiceAreaForm component with radius-based coverage management and Google Maps integration
- **Documents Panel**: Compact 3-column layout with "Uploaded Documents" section and "Update Documents" area - users can view existing files and update individual documents without re-uploading all three
- **Panel-Based Navigation**: Converted from page-based routing to persistent left sidebar with right panel content switching for better UX
- **Payment Panel**: Integrated existing payment methods display with Stripe card management and lead pricing information
- **Database Fix**: Resolved "NaN" error in service area functionality by correcting providerId prop passing from provider.id

### Provider Registration Compact Documents Layout (January 19, 2025)
- **Step 4 Improved Design**: Updated provider registration documents step to match dashboard's compact 3-column layout (grid-cols-3)
- **Consistent User Experience**: Both registration Step 4 and dashboard Documents panel now use identical compact styling
- **Space Efficient**: Reduced padding and font sizes while maintaining functionality and readability
- **User Preference Applied**: Implemented user's request for the same "3 documents in one line" layout across both registration and dashboard

### Document Viewer Implementation (January 19, 2025)
- **Smart Document Display**: Implemented intelligent viewer that detects file types and uses appropriate display methods
- **Image Support**: PNG, JPG, JPEG images display as native img elements with proper scaling and centering
- **PDF Support**: PDF documents use embed elements with built-in PDF viewer controls and navigation
- **Secure API Endpoint**: Created `/api/provider/documents/view/:filename/:providerId` with provider ownership validation
- **Inline Headers**: Fixed content-disposition headers to display documents inline rather than forcing downloads
- **Authentication Fix**: Resolved iframe authentication issues by including provider ID in URL path instead of headers
- **User Testing Validated**: Document viewing functionality confirmed working through direct user testing

### Stripe Payment Integration Completed (January 19, 2025)
- **Secure Stripe integration**: Replaced database card storage with Stripe Customer and PaymentMethod APIs for PCI compliance
- **Real payment processing**: Cards now securely stored with Stripe, only references and last 4 digits kept in database
- **JavaScript error fixes**: Resolved payment page errors with proper null checks for card display functions
- **Auto-primary functionality**: First payment method added automatically becomes primary card
- **Last 4 digits display**: Payment methods now show "Visa **** **** **** 4242" format from Stripe data
- **AES-256 encryption working**: Stripe keys successfully encrypted and stored in database with comprehensive debugging system
- **Authentication bypass route**: `/api/setup/stripe` endpoint bypasses admin auth for initial setup
- **User verification completed**: System tested and confirmed working with real Stripe API keys

### Provider Authentication & Navigation Fix (January 19, 2025)
- **Fixed "Complete Registration" authentication error**: Resolved 401 error during document upload by updating API client to properly send provider authentication headers
- **Enhanced API authentication**: Updated apiRequest function to handle both `/api/provider/` and `/api/service-providers/` endpoints with proper X-Provider-Id header
- **Fixed FormData handling**: Corrected file upload by properly handling FormData vs JSON content types in API requests
- **Improved navigation flow**: Step 3→Step 2 navigation now allowed while maintaining Step 2→Step 1 security restriction for existing providers
- **Provider signup completion**: Document upload process now works seamlessly with proper authentication and file handling
- **Enhanced success message**: Updated office hours display formatting with proper line breaks and bold text for better user experience

### Google Maps API Integration & Service Area Preview Fix (January 19, 2025)
- **Fixed Google Maps API authorization**: Resolved ApiTargetBlockedMapError and RefererNotAllowedMapError by enabling Maps JavaScript API and authorizing Replit domains
- **Service Area Preview working**: Step 3 now displays interactive map with business address auto-populated from Step 1
- **Address autocomplete fully functional**: Address suggestions now appear while typing with proper dropdown styling and z-index handling
- **Dual input methods**: Both Google Maps autocomplete suggestions and manual entry with "Locate" button working seamlessly
- **Places API integration confirmed**: Successfully tested with Brisbane location queries, autocomplete working with Australian address filtering
- **Enhanced error handling**: Added comprehensive debugging and fallback systems for Google API issues
- **Database schema completed**: All location-based columns (center_lat, center_lng, radius_km, area_name) properly implemented

### Comprehensive Region Coverage & Data Integrity Fix (January 19, 2025)
- **Fixed Gold Coast suburbs error**: Resolved "Failed to fetch" error in provider signup Step 3 by fixing hardcoded localhost URLs to relative paths
- **Complete region coverage**: Expanded from 5 regions with suburbs to all 67 regions across Australia with comprehensive suburb data
- **Extensive postcode coverage**: Added missing postcodes including 4212 (Hope Island), covering major metropolitan and regional areas
- **Data integrity fixes**: Corrected 244 state mismatches and assigned 3,285+ suburbs to proper regions using authentic Australian geographic data
- **Enhanced error handling**: Added proper HTTP status validation and user-friendly success/error notifications for suburb addition process
- **Major city coverage**: Comprehensive suburb data for Sydney (14 regions), Melbourne (9 regions), Brisbane (5 regions), Perth (5 regions), Adelaide regions, plus regional centers

## Previous Changes

### Regional Geographic Hierarchy Implementation (January 18, 2025)
- **Added SA4 regional structure**: Implemented middle layer between states and suburbs using ABS SA4 statistical areas
- **Database schema enhancement**: Added `australian_regions` table with 67 official SA4 regions covering major metropolitan and regional areas
- **Geographic hierarchy**: State → Region (SA4) → Suburb structure for better service provider area selection
- **Regional API endpoints**: Added `/api/regions`, `/api/regions/state/:stateId`, and `/api/regions/:regionId/suburbs` for frontend integration
- **Data seeding completed**: Successfully populated regions including Sydney areas (Blacktown, Parramatta, etc.), Melbourne areas, Brisbane areas, Perth areas, and major regional centers
- **Schema relations**: Established proper foreign key relationships linking regions to states and suburbs to regions
- **Enhanced Step 3 workflow**: Completed hierarchical location selection with "Add All Suburbs" functionality using new region-based suburb fetching API
- **Backend infrastructure**: Added `getSuburbsByRegion()` storage method and API endpoint for efficient bulk suburb selection
- **Professional UX**: Fixed React infinite loop warning and improved loading states for seamless provider signup experience

### Separate Provider Authentication System (January 18, 2025)
- **Complete separation of auth systems**: Customers use `/api/register`, Providers use `/api/provider/register`
- **No more confusion**: Clear distinction between customer journey (request services) and provider journey (get leads)
- **Database schema fixed**: Added password column to service_providers table, removed user_id dependency
- **Working provider registration**: Successfully tested Step 1 → creates provider account → proceeds to Step 2
- **Provider login system**: Created dedicated `/provider-login` page with `/api/provider/login` endpoint
- **Enhanced navigation**: Home page now shows "Book a Job" for customers and "Join Us" dropdown for providers
- **Hover dropdown menu**: "Join Us" reveals "Join us as a Partner" and "Partner Login" options with descriptions
- **Email uniqueness enabled**: Enforces unique email addresses for providers to ensure proper authentication flow
- **Progressive data persistence**: Provider data saves immediately after Step 1 completion
- **Enhanced user feedback**: Success messages confirm account creation and step progression

### Provider Signup Form Validation & Address Input Fix (January 18, 2025)
- **Complete form validation system**: Added comprehensive client-side validation for all required fields
- **Smart validation timing**: Validation only triggers after first submit attempt, providing clean initial user experience
- **Address selection bug fixed**: Resolved issue where clicking on Google Maps autocomplete suggestions wouldn't fill input field
- **Event handling optimization**: Used onMouseDown to prevent input blur conflicts with suggestion selection
- **Mobile number validation**: Enhanced to accept common Australian formats (spaces, dashes, parentheses)
- **Authentication flow improvement**: Form validation runs before authentication check to show errors instead of redirecting
- **Google Maps API integration**: Confirmed working autocomplete with proper Australian address filtering and IP restrictions
- **User experience enhancements**: Red border indicators, required field asterisks, and clear error messaging

### Professional Signup Resumption System (January 18, 2025)
- **Silent progress detection**: Added loading screen while checking provider completion status to prevent step flashing
- **Intelligent step resumption**: System now detects completed steps and resumes from correct point without showing Step 1
- **Professional loading state**: Displays "Checking your progress..." spinner during step detection
- **API-based progress tracking**: Uses provider profile, services, and service areas endpoints to determine current step
- **Seamless user experience**: Eliminates unprofessional step transitions and provides smooth resumption flow
- **Complete registration workflow**: Step 1 (basic info) → Step 2 (services) → Step 3 (service areas) → Step 4 (documents)

### Service Request System Enhancement
- **Fixed SQL GROUP BY error**: Resolved service request creation failure by properly specifying columns in provider matching query
- **Simplified request creation**: Removed provider matching during initial request creation for streamlined workflow
- **Enhanced dashboard navigation**: Service icons now navigate directly to step 2 with pre-selected service category
- **URL parameter handling**: Added support for direct navigation with category and step parameters

### Booking Management System (January 18, 2025)
- **Enhanced booking details**: Added comprehensive booking information fields including booking type, preferred date, and scheduled date
- **Booking type categorization**: One-time service, regular/recurring, emergency, and quote-only options
- **Improved dashboard display**: Shows booking type badges, request date, preferred date, and scheduled date in organized layout
- **Database schema updates**: Added preferred_date, booking_type, and scheduled_date columns to service_requests table
- **Form validation**: Required booking type selection for all new service requests
- **Cache invalidation fix**: Resolved issue where new requests weren't appearing in dashboard immediately

### Performance and Bug Fixes
- **Infinite request loop fix**: Resolved React Query infinite loop that was blocking sign-in functionality
- **Auto-dismiss notifications**: Toast notifications now automatically disappear after 3 seconds system-wide
- **Cache consistency**: Fixed cache invalidation keys to ensure dashboard shows latest service requests
- **Manual refresh option**: Added refresh button to My Bookings section for immediate data updates

### Profile Management System
- **Complete profile update functionality**: Added PUT /api/auth/user endpoint with validation
- **Real-time cache updates**: Profile changes immediately reflect in dashboard welcome message
- **Form state management**: Proper handling of controlled inputs with trimming and validation
- **Toast notifications**: Success/error feedback for profile updates

### Dashboard Improvements
- **Dynamic recent activity**: Latest service requests display with status indicators and service categories
- **Improved UX**: Service icons with hover effects and direct navigation
- **Better form controls**: Professional input components with proper labeling

## Data Flow

### Customer Journey
1. Customer visits landing page and views available services
2. Authentication via Replit Auth (optional for browsing)
3. Service selection via dashboard icons (direct to step 2) or service request flow
4. Service details and location specification with Australian postcode integration
5. Request submission with confirmation page
6. Request appears in dashboard Recent Activity area

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
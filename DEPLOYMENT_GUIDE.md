# 🚀 ServicePanda Server Deployment Guide

## Overview
This guide explains how to deploy your TypeScript-based ServicePanda server to cPanel, converting it to JavaScript for production use.

## 🏗️ Build Process

### 1. Build the Server (TypeScript → JavaScript)
```bash
# Install dependencies first
npm install

# Build the server (creates server-js directory)
npm run build:server-js
```

This command will:
- Compile your TypeScript server files to JavaScript
- Create a `server-js` directory with production-ready files
- Bundle all dependencies properly

### 2. What Gets Created
After building, you'll have:
```
server-js/
├── index.js          # Main server file (JavaScript)
├── routes.js         # Compiled routes
├── storage.js        # Compiled storage logic
├── vite.js           # Compiled static file serving
├── package.json      # Production dependencies
└── ... (other compiled files)
```

## 📤 Deploying to cPanel

### Step 1: Upload Files
1. Upload the entire `server-js` folder to your server
2. Place it in your `public_html/ServicePanda` directory (as configured in cPanel)

### Step 2: Configure cPanel
In your cPanel Node.js application settings:
- **Application root**: `public_html/ServicePanda`
- **Application startup file**: `server-js/index.js` ⚠️ **Important change**
- **Node.js version**: `20.19.3` (as you have configured)

### Step 3: Install Dependencies
1. In cPanel, click "Run NPM Install" 
2. This will install the production dependencies from `server-js/package.json`

### Step 4: Environment Variables
Make sure your `.env` file is uploaded to the server with:
- Database connection strings
- API keys
- Other configuration variables

## 🔧 Testing the Build

### Local Testing
```bash
# Test the compiled JavaScript server locally
npm run start:server

# Or test the production build
cd server-js
npm install
npm start
```

### Health Check
Once deployed, test the API:
```
https://staging.servicepanda.com.au/api/health
```

## 📋 Build Scripts

### Available Commands
- `npm run build` - Full build (client + server)
- `npm run build:server` - Build server only
- `npm run build:server-js` - Build server to JavaScript
- `npm run start:server` - Start compiled JavaScript server
- `npm run clean` - Clean build directories

### Windows Users
Use the provided batch file:
```bash
deploy-server.bat
```

## 🚨 Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all dependencies are in `server-js/package.json`
   - Run `npm install` in the server-js directory

2. **Port conflicts**
   - Check if port 3000 is available
   - Set `PORT` environment variable if needed

3. **Database connection issues**
   - Verify `.env` file is uploaded
   - Check database credentials and connection strings

4. **Static file serving issues**
   - Ensure the `dist` folder (client build) is uploaded
   - Check file permissions on the server

### Debug Mode
To enable debug logging, set in your `.env`:
```
NODE_ENV=development
DEBUG=*
```

## 🔄 Updating the Server

### Development Workflow
1. Make changes to TypeScript files in `server/`
2. Run `npm run build:server-js`
3. Upload the new `server-js` folder to your server
4. Restart the Node.js application in cPanel

### Hot Reload (Development Only)
```bash
npm run dev:server
```

## 📱 Mobile App Integration

The server includes a health check endpoint specifically for mobile app connectivity:
```
GET /api/health
```

This endpoint returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "ServicePanda API is running"
}
```

## 🎯 Production Checklist

- [ ] TypeScript server compiled to JavaScript
- [ ] `server-js` folder uploaded to server
- [ ] cPanel startup file set to `server-js/index.js`
- [ ] Dependencies installed via npm
- [ ] Environment variables configured
- [ ] Health check endpoint responding
- [ ] Mobile app can connect to API
- [ ] Static files being served correctly

## 📞 Support

If you encounter issues:
1. Check the server logs in cPanel
2. Verify all files are uploaded correctly
3. Test the health endpoint
4. Check database connectivity

---

**Remember**: Always test your build locally before deploying to production!

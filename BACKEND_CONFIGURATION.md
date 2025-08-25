# Backend Configuration Guide

## Overview
This guide explains how to configure the RentEasy frontend to work with different backend environments:
- **Development**: Java Spring backend running on `localhost:8080`
- **Production**: Render.com deployed backend

## Quick Setup

### Option 1: Automatic Environment Detection (Recommended)
The system automatically detects your environment:
- **Development**: `npm run dev` → Uses `localhost:8080`
- **Production**: `npm run build` → Uses production backend

### Option 2: Manual Environment Override
Create a `.env.local` file in your project root:

```bash
# For Development (Java Spring Backend)
NEXT_PUBLIC_ENV=development

# For Production (Render.com Backend)
NEXT_PUBLIC_ENV=production
```

### Option 3: Force Specific Backend URL
Override with a specific URL:

```bash
# Force localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Force production backend
NEXT_PUBLIC_BACKEND_URL=https://vehicle-rental-backend-deployment.onrender.com
```

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_ENV` | Environment mode | `development` (dev) / `production` (build) |
| `NEXT_PUBLIC_BACKEND_URL` | Force specific backend URL | Overrides environment detection |
| `NEXT_PUBLIC_DEV_BACKEND_URL` | Development backend URL | `http://localhost:8080` |
| `NEXT_PUBLIC_PROD_BACKEND_URL` | Production backend URL | `https://vehicle-rental-backend-deployment.onrender.com` |

## Configuration Examples

### Development Setup (Java Spring Backend)
```bash
# .env.local
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DEV_BACKEND_URL=http://localhost:8080
```

### Production Setup (Render.com Backend)
```bash
# .env.local
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_PROD_BACKEND_URL=https://vehicle-rental-backend-deployment.onrender.com
```

### Custom Backend Setup
```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://your-custom-backend.com
```

## Verification

### Check Current Backend URL
Open your browser's developer console. You'll see:
```
🚀 Backend URL: http://localhost:8080
🔧 Environment: Development (localhost:8080)
```

### Test API Endpoints
The frontend will automatically use the configured backend for all API calls:
- Authentication: `/login`, `/signup`, `/verify-token`
- Fleet: `/fleet`, `/fleet?page=0&size=10`
- Rentals: `/rent`, `/rentals/user`, `/rentals/return`
- Late Fees: `/late-fees/user`, `/late-fees/pay`
- Profile: `/profile`, `/profile/upload-image`

## Troubleshooting

### Backend Not Responding
1. **Check Backend Status**: Ensure your Java Spring backend is running on port 8080
2. **Verify URL**: Check console logs for the current backend URL
3. **CORS Issues**: Ensure your backend allows requests from `http://localhost:3000`

### Environment Not Switching
1. **Restart Dev Server**: Stop and restart `npm run dev`
2. **Check .env.local**: Ensure the file is in the project root
3. **Clear Cache**: Clear browser cache and restart

### Production Build Issues
1. **Environment Variables**: Ensure all variables are prefixed with `NEXT_PUBLIC_`
2. **Build Process**: Use `npm run build` for production builds
3. **Deployment**: Verify environment variables in your deployment platform

## Development Workflow

### 1. Start Java Spring Backend
```bash
# In your Java Spring project directory
./mvnw spring-boot:run
# or
java -jar your-app.jar
```

### 2. Start Frontend Development Server
```bash
# In your frontend project directory
npm run dev
```

### 3. Verify Connection
- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:8080`
- Check console for backend URL confirmation

## Production Deployment

### Render.com Backend
- Backend automatically deployed to: `https://vehicle-rental-backend-deployment.onrender.com`
- Frontend automatically uses production backend when built

### Custom Production Backend
```bash
# .env.local
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_PROD_BACKEND_URL=https://your-production-backend.com
```

## API Endpoints Reference

All endpoints automatically use the configured backend URL:

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /verify-token` - Token verification

### Fleet Management
- `GET /fleet` - Get all vehicles
- `GET /fleet?page={page}&size={size}` - Paginated fleet

### Rental Management
- `POST /rent` - Create rental
- `GET /rentals/user` - Get user rentals
- `POST /rentals/return` - Return vehicle

### Late Fees
- `GET /late-fees/user` - Get user late fees
- `POST /late-fees/pay` - Pay late fee

### Profile Management
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/upload-image` - Upload profile image

## Security Notes

- **Environment Variables**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- **JWT Tokens**: Authentication tokens are stored securely in cookies
- **CORS**: Ensure your backend properly configures CORS for security

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your backend is running and accessible
3. Check the environment configuration
4. Ensure all required environment variables are set

---

**Last Updated:** January 2024  
**Version:** 1.0

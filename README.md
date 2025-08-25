# Vehicle Rental Frontend

## 🚀 **Backend Deployment Update**

The frontend has been updated to use the deployed backend on Render.com instead of localhost.

### **✅ New Backend URL:**
```
https://vehicle-rental-backend-deployment.onrender.com
```

### **✅ Configuration Management:**
- **Centralized Configuration**: All backend URLs are now managed in `lib/config.ts`
- **Easy Updates**: Change the backend URL in one place (`BACKEND_URL` constant)
- **Type Safety**: All API endpoints are properly typed and accessible

### **✅ Updated Files:**
- `lib/config.ts` - New configuration file with all API endpoints
- `lib/auth.ts` - Authentication utilities
- `app/page.tsx` - Main page with chatbot integration
- `app/profile/page.tsx` - User profile management
- `app/fleet/page.tsx` - Vehicle fleet display
- `app/book-vehicle/page.tsx` - Vehicle booking
- `app/balance/page.tsx` - Balance management
- `app/api/auth/*/route.ts` - API route handlers

### **✅ API Endpoints Available:**
```typescript
// Authentication
verifyToken: '/verify-token'
login: '/login'
signup: '/signup'
logout: '/logout'

// User Management
profile: '/profile'
profileByUsername: (username) => '/profile/{username}'
profileUploadImage: '/profile/upload-image'
profileEditImage: '/profile/edit-image'
profileDeleteImage: '/profile/delete-image'

// Fleet Management
fleet: '/fleet'
fleetByPage: (page, size) => '/fleet?page={page}&size={size}'

// Rental Management
rent: '/rent'
rentalsUser: '/rentals/user'

// Balance Management
balance: '/balance'
balanceAdd: '/balance/add'
balanceDebit: '/balance/debit'

// Vehicle Management
vehicleById: (id) => '/vehicle/{id}'
fleetByCategory: (categoryId) => '/fleet/category/{categoryId}'
fleetAvailable: '/fleet/available'

// Return Vehicle (Future)
returnVehicle: '/rentals/return'
```

### **✅ Usage Example:**
```typescript
import { API_ENDPOINTS } from '@/lib/config'

// Instead of hardcoded URLs:
// fetch('http://localhost:8080/fleet')

// Use the configuration:
fetch(API_ENDPOINTS.fleet)
fetch(API_ENDPOINTS.fleetByPage(0, 10))
```

### **✅ Benefits:**
1. **Easy Maintenance**: Change backend URL in one place
2. **Type Safety**: All endpoints are properly typed
3. **Consistency**: All components use the same configuration
4. **Environment Support**: Easy to switch between development/staging/production
5. **Error Prevention**: No more hardcoded URLs scattered throughout the code

### **✅ Future Updates:**
To change the backend URL in the future:
1. Update `BACKEND_URL` in `lib/config.ts`
2. All components will automatically use the new URL
3. No need to search and replace throughout the codebase

---

## 🏃‍♂️ **Getting Started**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:3000`

## 🔧 **Environment Variables**

No environment variables are required for the backend URL as it's now centralized in the configuration file.

## 📱 **Features**

- ✅ User authentication and registration
- ✅ Vehicle fleet browsing with filtering
- ✅ Vehicle booking system
- ✅ User profile management
- ✅ Balance management
- ✅ AI-powered chatbot integration
- ✅ Responsive design for all devices
- ✅ Protected routes for authenticated users

## 🚗 **Backend Integration**

The frontend is now fully integrated with the deployed backend on Render.com, providing:
- Real-time vehicle availability
- Secure user authentication
- Persistent user data
- Scalable infrastructure 
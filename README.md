# 🚗 RentEasy - Vehicle Rental Frontend

A modern, responsive vehicle rental application built with Next.js 14, React, and TypeScript. RentEasy provides an intuitive interface for users to browse vehicles, manage rentals, and handle their account operations.

## ✨ Features

### 🚀 Core Functionality
- **Vehicle Fleet Management** - Browse available vehicles with search and filtering
- **Rental Booking System** - Book vehicles with date selection and special requests
- **User Authentication** - Secure JWT-based authentication system
- **Profile Management** - View rental history and manage account details
- **Balance Management** - Add funds and view transaction history
- **Late Fee Management** - View and pay outstanding late fees
- **Vehicle Return System** - Return vehicles and complete rental cycles

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Built with shadcn/ui component library
- **Interactive Elements** - Hover effects, loading states, and smooth transitions
- **Accessibility** - Semantic HTML and ARIA labels

### 🤖 AI Integration
- **Voiceflow Chatbot** - Intelligent customer support with user context
- **JWT Authentication** - Secure API communication for chatbot operations
- **Real-time Context** - Dynamic user information and rental status

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library

### Authentication & State
- **JWT Tokens** - Secure authentication
- **Local Storage** - Client-side token storage
- **Protected Routes** - Route-level authentication

### API Integration
- **RESTful APIs** - Backend communication
- **Fetch API** - Modern HTTP client
- **Error Handling** - Comprehensive error management

## 📁 Project Structure

```
vehicle_project_frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── signin/             # Sign in page
│   │   ├── signup/             # Sign up page
│   │   └── email-verification/ # Email verification
│   ├── balance/                 # Balance management
│   ├── book-vehicle/           # Vehicle booking
│   ├── fleet/                  # Vehicle fleet display
│   ├── late-fees/              # Late fee management
│   ├── profile/                # User profile
│   ├── return-vehicle/         # Vehicle return
│   └── page.tsx                # Home page
├── components/                  # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── auth/                   # Authentication components
│   └── BackendStatus.tsx       # Backend connectivity status
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication utilities
│   ├── config.ts               # API configuration
│   └── utils.ts                # Helper functions
├── public/                     # Static assets
└── styles/                     # Global styles
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle_project_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://vehicle-rental-backend-deployment.onrender.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Backend URLs
The application is configured to use the production backend by default:
- **Production**: `https://vehicle-rental-backend-deployment.onrender.com`
- **Development**: `http://localhost:8080` (configurable)

### API Endpoints
All API endpoints are centralized in `lib/config.ts`:
- User management and authentication
- Vehicle fleet operations
- Rental management
- Balance and payment operations
- Late fee handling

## 📱 Available Routes

### Public Routes
- **`/`** - Home page with vehicle showcase
- **`/signin`** - User authentication
- **`/signup`** - User registration
- **`/email-verification`** - Email verification process

### Protected Routes (Require Authentication)
- **`/profile`** - User profile and rental history
- **`/fleet`** - Browse available vehicles
- **`/book-vehicle`** - Book a specific vehicle
- **`/balance`** - Manage account balance
- **`/late-fees`** - View and pay late fees
- **`/return-vehicle`** - Return rented vehicles

## 🔐 Authentication

### JWT Token Management
- Tokens are stored in `localStorage`
- Automatic token validation on protected routes
- Secure API communication with Bearer tokens

### User Roles
- **Guest Users** - Can browse fleet and sign up
- **Authenticated Users** - Full access to all features
- **Admin Users** - Extended privileges (backend-dependent)

## 🤖 Chatbot Integration

### Voiceflow Configuration
- **Project ID**: `6897b9430a2a1fc690da3cde`
- **User Context**: Dynamic user information injection
- **API Access**: Secure backend communication
- **Authentication**: JWT token integration

### Chatbot Features
- User-specific rental assistance
- Fleet information queries
- Balance and payment support
- Real-time context updates

## 🎨 Customization

### Styling
- **Tailwind CSS** classes for rapid styling
- **CSS Variables** for consistent theming
- **Component variants** for different states

### Components
- **shadcn/ui** components for consistent design
- **Custom components** for specific functionality
- **Responsive layouts** for all screen sizes

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
npm run export
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables

### Vercel
1. Import your GitHub repository
2. Automatic deployment on push
3. Built-in Next.js optimization

### Other Platforms
- **AWS Amplify** - Full-stack deployment
- **DigitalOcean App Platform** - Scalable hosting
- **Heroku** - Container-based deployment

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
- Ensure Node.js version is 18+
- Clear `node_modules` and reinstall
- Check TypeScript compilation errors

#### Authentication Issues
- Verify JWT token storage
- Check backend connectivity
- Clear browser storage if needed

#### Chatbot Not Loading
- Verify Voiceflow project ID
- Check browser console for errors
- Ensure user is authenticated

### Debug Mode
The application includes a backend status component for development debugging.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional commits** for version control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Voiceflow** - AI chatbot platform
- **Lucide** - Beautiful icon library

## 📞 Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Issues
- Report bugs via GitHub Issues
- Feature requests welcome
- Security issues: please email directly

---

**Built with ❤️ using Next.js, React, and TypeScript**

*RentEasy - Your trusted partner for vehicle rentals* 
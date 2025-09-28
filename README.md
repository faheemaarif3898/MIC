
# 🎓 MIC Alumni Portal

A modern, responsive Alumni Portal application built with React, TypeScript, and Supabase. This platform connects alumni, facilitates networking, and provides various features for alumni engagement.

## 🌐 Live Demo

**[Visit the Live Application](https://allumini-portal.web.app/)**

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Login/Signup** - Email-based authentication with Supabase
- **User Profiles** - Comprehensive alumni profile management
- **Admin Dashboard** - Administrative controls and user management

### 👥 Alumni Network
- **Alumni Directory** - Browse and search through alumni profiles
- **Profile Management** - Detailed alumni information and contact details
- **Networking** - Connect with fellow alumni


### 📚 Information & Support
- **Guidelines** - Platform usage guidelines and policies
- **FAQ Section** - Common questions and answers
- **About Page** - Information about the platform and institution
- **Contact** - Get in touch with administrators

### 🛠️ Problem Statements
- **Innovation Hub** - Share and collaborate on problem statements
- **Detailed Views** - Comprehensive problem statement management

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Radix UI** - Headless, accessible UI primitives
- **shadcn/ui** - Beautiful, customizable component library
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications


### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- pnpm 

### Clone the Repository
```bash
git clone https://github.com/faheemaarif3898/MIC.git
cd MIC
```

### Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install
```

### Environment Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Update the Supabase configuration in `src/utils/supabase/info.tsx`
3. Configure your environment variables

### Start Development Server
```bash
# Using pnpm
pnpm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
MIC/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── figma/         # Custom Figma components
│   │   └── *.tsx          # Page components
│   ├── styles/            # CSS and styling
│   ├── supabase/          # Supabase configuration
│   │   └── functions/     # Server functions
│   ├── utils/             # Utility functions
│   ├── guidelines/        # Documentation
│   └── assets/           # Images and assets
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Component Library

The project uses a comprehensive component library built with Radix UI and shadcn/ui:

- **Form Components**: Input, Textarea, Select, Checkbox, Radio Group
- **Layout Components**: Card, Separator, Accordion, Tabs
- **Navigation**: Navbar, Menubar, Breadcrumb, Pagination
- **Feedback**: Alert, Dialog, Toast (Sonner), Progress
- **Data Display**: Table, Avatar, Badge, Chart (Recharts)
- **Overlays**: Popover, Tooltip, Hover Card, Context Menu

## 📱 Pages & Features

### Core Pages
- **Home** - Landing page with overview
- **Alumni Directory** - Browse all alumni
- **Alumni Profile** - Individual alumni details
- **Login** - Authentication portal

### Additional Features
- **Events** - Alumni events and gatherings
- **Admin Dashboard** - Administrative controls

### Information Pages
- **About** - Platform information
- **Guidelines** - Usage policies
- **FAQs** - Help and support
- **Contact** - Get in touch

## 🔧 Scripts

```bash
# Development
pnpm run dev          # Start development server

# Production
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Linting
pnpm run lint         # Run ESLint
```

## 🌐 Deployment

The application is deployed on Firebase Hosting and can be accessed at:
**[https://allumini-portal.web.app/](https://allumini-portal.web.app/)**

### Deploy to Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the project
pnpm run build

# Deploy
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Design Reference

The original design is available at: [Figma Design](https://www.figma.com/design/eTMH8DQl3D2KH3ImJ910s3/MIC-Alumni-Portal-Application)

## 📋 Guidelines

Please refer to the [Guidelines](src/guidelines/Guidelines.md) for detailed information about:
- Platform usage policies
- Code contribution guidelines
- Community standards

## 🐛 Issues & Support

If you encounter any issues or need support:
1. Check the [FAQ section](https://allumini-portal.web.app/) in the app
2. Open an issue on GitHub
3. Contact the development team through the platform

## 📄 License

This project is private and proprietary. All rights reserved.

## 🏢 About MIC

This Alumni Portal is developed for MIC (Management & Information Center) to facilitate alumni networking, engagement, and institutional support.

## 📞 Contact

- **Repository**: [MIC Alumni Portal](https://github.com/faheemaarif3898/MIC)
- **Live Application**: [https://allumini-portal.web.app/](https://allumini-portal.web.app/)
- **Owner**: [@faheemaarif3898](https://github.com/faheemaarif3898)

---

<div align="center">
  <p>Built with ❤️ for the MIC Alumni Community</p>
  <p>
    <a href="https://allumini-portal.web.app/">🌐 Visit Live Site</a> •
    <a href="#installation">📦 Installation</a> •
    <a href="#contributing">🤝 Contributing</a>
  </p>
</div>
import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Navbar } from './components/navbar';
import { HomePage } from './components/home-page';
import { AlumniDirectoryPage } from './components/alumni-directory-page';
import { AlumniProfilePage } from './components/alumni-profile-page';
import { EventsPage } from './components/events-page';
import { MentorshipPage } from './components/mentorship-page';
import { DonationsPage } from './components/donations-page';
import { CommunicationPage } from './components/communication-page';
import { AdminDashboard } from './components/admin-dashboard';
import { AboutPage } from './components/about-page';
import { GuidelinesPage } from './components/guidelines-page';
import { FAQsPage } from './components/faqs-page';
import { ContactPage } from './components/contact-page';
import { LoginPage } from './components/login-page';
import { Toaster } from './components/ui/sonner';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    initializeSampleData();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user data from backend
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/user-profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: userData.role || 'Alumni',
            name: userData.name
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: 'Alumni'
          });
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/init-sample-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata?.role || 'Alumni',
          name: data.user.user_metadata?.name
        });
        setCurrentPage('home');
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9b4de1de/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, userData }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error };
      }

      // Auto login after signup
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  const authValue = {
    user,
    login,
    signup,
    logout,
    loading
  };

  const handleViewAlumniProfile = (alumniId: string) => {
    setSelectedAlumniId(alumniId);
    setCurrentPage('alumni-profile');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'alumni-directory':
        return <AlumniDirectoryPage onViewProfile={handleViewAlumniProfile} />;
      case 'alumni-profile':
        return <AlumniProfilePage alumniId={selectedAlumniId} onBack={() => setCurrentPage('alumni-directory')} />;
      // case 'events':
      //   return <EventsPage />;
      // case 'mentorship':
      //   return <MentorshipPage />;
      // case 'donations':
      //   return <DonationsPage />;
      case 'communication':
        return <CommunicationPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'guidelines':
        return <GuidelinesPage />;
      case 'faqs':
        return <FAQsPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setCurrentPage('home')} />;
      default:
        return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={(page) => {
            if (page === 'alumni-profile') {
              setSelectedAlumniId(null);
              setCurrentPage('alumni-directory');
            } else {
              setCurrentPage(page);
            }
          }} 
        />
        <main>
          {renderPage()}
        </main>
        <Toaster />
      </div>
    </AuthContext.Provider>
  );
}
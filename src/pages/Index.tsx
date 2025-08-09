import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import TaskManager from "@/components/TaskManager";
import Translator from "@/components/Translator";
import StudyGroups from "@/components/StudyGroups";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Get active section from URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    } else {
      setActiveSection(null);
    }
  }, [location.hash]);

  // Check auth for protected sections
  useEffect(() => {
    if (!isLoading && !user) {
      const hash = window.location.hash;
      if (hash === '#upload' || hash === '#tasks' || hash === '#dashboard' || hash === '#translator' || hash === '#groups') {
        navigate('/auth');
      }
    }
  }, [user, isLoading, navigate]);

  // Render specific section if hash is present
  const renderSection = () => {
    if (!user) return null;
    
    switch (activeSection) {
      case 'upload':
        return <FileUpload />;
      case 'tasks':
        return <TaskManager />;
      case 'translator':
        return <Translator />;
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <StudyGroups />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Show specific section if hash is present and user is authenticated */}
      {activeSection && user ? (
        renderSection()
      ) : (
        /* Show default home page content */
        <>
          <Hero />
          <div id="features">
            <Features />
          </div>
          {!user && (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Sign in to access all features
              </h2>
              <p className="text-muted-foreground mb-8">
                Create an account to upload files, manage tasks, use the translator, view your dashboard, and join study groups
              </p>
              <button 
                onClick={() => navigate('/auth')} 
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;

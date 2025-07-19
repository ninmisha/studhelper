import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import TaskManager from "@/components/TaskManager";
import Translator from "@/components/Translator";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check auth for protected sections
  useEffect(() => {
    if (!isLoading && !user) {
      // Scroll to top if not authenticated when accessing protected sections
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#upload' || hash === '#tasks' || hash === '#dashboard' || hash === '#translator') {
          navigate('/auth');
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      {user && (
        <>
          <div id="upload">
            <FileUpload />
          </div>
          <div id="tasks">
            <TaskManager />
          </div>
          <div id="translator">
            <Translator />
          </div>
          <div id="dashboard">
            <Dashboard />
          </div>
        </>
      )}
      {!user && (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Sign in to access all features
          </h2>
          <p className="text-muted-foreground mb-8">
            Create an account to upload files, manage tasks, use the translator, and view your dashboard
          </p>
          <button 
            onClick={() => navigate('/auth')} 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;

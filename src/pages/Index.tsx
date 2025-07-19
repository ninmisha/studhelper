import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="upload">
        <FileUpload />
      </div>
      <div id="dashboard">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;

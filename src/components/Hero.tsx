import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Study Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Notes</span>
              <br />
              Into Smart
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"> Learning</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Upload your PDFs and lecture notes, and let StudySync AI create personalized summaries, 
              flashcards, and quizzes that adapt to your learning style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                variant="gradient" 
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4"
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                PDF Analysis
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Smart Summaries
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Auto Quizzes
              </div>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-medium overflow-hidden">
              <img 
                src={heroImage} 
                alt="StudySync AI Dashboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium shadow-soft">
              98% Accuracy
            </div>
            <div className="absolute -bottom-4 -left-4 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium shadow-soft">
              Save 5+ Hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
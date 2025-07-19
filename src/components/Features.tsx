import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Brain, Users, Clock, Trophy } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Smart Upload",
    description: "Drop your PDFs, lecture notes, or any study material. Our AI processes multiple formats instantly.",
    color: "text-primary"
  },
  {
    icon: FileText,
    title: "Intelligent Summaries",
    description: "Get concise, well-structured summaries that capture key concepts and important details.",
    color: "text-accent"
  },
  {
    icon: Brain,
    title: "Auto Flashcards",
    description: "Automatically generate flashcards and MCQs from your content with varying difficulty levels.",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "Spaced Repetition",
    description: "Scientifically-backed scheduling ensures you review material at optimal intervals.",
    color: "text-success"
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Share your quiz decks with classmates and study together with collaborative features.",
    color: "text-accent"
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics and performance insights.",
    color: "text-warning"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Study Smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From uploading your materials to mastering the content, StudySync AI handles 
            every step of your learning journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
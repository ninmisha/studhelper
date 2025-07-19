import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Clock, TrendingUp, FileText, Play } from "lucide-react";

const Dashboard = () => {
  const recentStudyMaterials = [
    {
      id: 1,
      title: "Advanced Calculus - Chapter 3",
      type: "PDF",
      flashcards: 24,
      quizzes: 3,
      progress: 75,
      lastStudied: "2 hours ago"
    },
    {
      id: 2,
      title: "Physics Lecture Notes - Week 5",
      type: "Notes",
      flashcards: 18,
      quizzes: 2,
      progress: 45,
      lastStudied: "1 day ago"
    },
    {
      id: 3,
      title: "Chemistry Lab Report Guidelines",
      type: "PDF",
      flashcards: 12,
      quizzes: 1,
      progress: 90,
      lastStudied: "3 days ago"
    }
  ];

  const stats = [
    {
      icon: BookOpen,
      label: "Study Materials",
      value: "12",
      change: "+3 this week",
      color: "text-primary"
    },
    {
      icon: Brain,
      label: "Flashcards Generated",
      value: "156",
      change: "+24 today",
      color: "text-accent"
    },
    {
      icon: Clock,
      label: "Study Time",
      value: "47h",
      change: "+5h this week",
      color: "text-success"
    },
    {
      icon: TrendingUp,
      label: "Quiz Accuracy",
      value: "87%",
      change: "+5% improvement",
      color: "text-warning"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Study Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Track your progress and access your personalized study materials
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Study Materials */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Study Materials
                </CardTitle>
                <CardDescription>
                  Continue where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudyMaterials.map((material) => (
                    <div key={material.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{material.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">{material.type}</Badge>
                            <span>•</span>
                            <span>{material.flashcards} flashcards</span>
                            <span>•</span>
                            <span>{material.quizzes} quizzes</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4 mr-1" />
                          Study
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground font-medium">{material.progress}%</span>
                        </div>
                        <Progress value={material.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">Last studied {material.lastStudied}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Materials
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump into your study routine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Upload New Material
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Practice Flashcards
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Take Quick Quiz
                </Button>
                <Button className="w-full justify-start" variant="gradient">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Goal</CardTitle>
                <CardDescription>
                  Stay on track with your study plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Study Time</span>
                    <span className="text-foreground font-medium">2h 15m / 3h</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-muted-foreground">45 minutes remaining to reach your goal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
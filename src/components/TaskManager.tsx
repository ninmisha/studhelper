import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Check, Clock, AlertCircle, Play, Pause, RotateCcw, BarChart3, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  created_at: string;
  due_date?: string;
  updated_at: string;
  user_id: string;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  
  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(0);
  const [tasksCompletedInSession, setTasksCompletedInSession] = useState(0);
  
  const { toast } = useToast();

  const timerModes = {
    focus: { duration: 25 * 60, label: "Focus Sesh" },
    short: { duration: 5 * 60, label: "Short Break" }, 
    long: { duration: 30 * 60, label: "Long Break" }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    if (timerMode === 'focus') {
      setFocusSessionsCompleted(prev => prev + 1);
      toast({
        title: "Focus session complete!",
        description: "Time for a break. Great work!",
      });
    } else {
      toast({
        title: "Break complete!",
        description: "Ready for another focus session?",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerModes[timerMode].duration);
  };

  const changeTimerMode = (mode: 'focus' | 'short' | 'long') => {
    setTimerMode(mode);
    setTimeLeft(timerModes[mode].duration);
    setIsTimerRunning(false);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .insert({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        user_id: user.id,
      });

    if (error) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority('medium');
      fetchTasks();
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
    }
    setIsLoading(false);
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (!completed && timerMode === 'focus') {
        setTasksCompletedInSession(prev => prev + 1);
      }
      fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchTasks();
      toast({
        title: "Task deleted",
        description: "Your task has been deleted",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return Clock;
      default: return Clock;
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Focus Tasks & Pomodoro Timer
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay organized, track your daily to-dos, and use the Pomodoro technique to stay focused
          </p>
        </div>

        {/* Pomodoro Timer Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Pomodoro Timer
            </CardTitle>
            <CardDescription>
              Use different study techniques with timed focus sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              {/* Timer Mode Selector */}
              <div className="flex gap-2">
                <Button
                  variant={timerMode === 'focus' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeTimerMode('focus')}
                >
                  Focus Sesh
                </Button>
                <Button
                  variant={timerMode === 'short' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeTimerMode('short')}
                >
                  Short Break
                </Button>
                <Button
                  variant={timerMode === 'long' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeTimerMode('long')}
                >
                  Long Break
                </Button>
              </div>

              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-bold text-foreground mb-4">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex gap-4 justify-center">
                  {!isTimerRunning ? (
                    <Button onClick={startTimer} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="lg" variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">{tasksCompletedInSession}/{tasks.filter(t => !t.completed).length}</div>
                  <div className="text-sm text-muted-foreground">Tasks Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{focusSessionsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Focus Sessions Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{Math.floor(focusSessionsCompleted * 25 / 60)}h {(focusSessionsCompleted * 25) % 60}m</div>
                  <div className="text-sm text-muted-foreground">Time Focused</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              Create a new task to stay organized and focused
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Textarea
              placeholder="Task description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant={newTaskPriority === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewTaskPriority('low')}
              >
                Low Priority
              </Button>
              <Button
                variant={newTaskPriority === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewTaskPriority('medium')}
              >
                Medium Priority
              </Button>
              <Button
                variant={newTaskPriority === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewTaskPriority('high')}
              >
                High Priority
              </Button>
            </div>
            <Button onClick={addTask} disabled={isLoading || !newTaskTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks ({pendingTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending tasks. Great job!
                </p>
              ) : (
                pendingTasks.map((task) => {
                  const PriorityIcon = getPriorityIcon(task.priority);
                  return (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="flex-shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks ({completedTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No completed tasks yet
                </p>
              ) : (
                completedTasks.map((task) => {
                  const PriorityIcon = getPriorityIcon(task.priority);
                  return (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg opacity-60">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="flex-shrink-0 text-success"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground line-through">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TaskManager;
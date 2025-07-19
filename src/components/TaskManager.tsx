import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Check, Clock, AlertCircle } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

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
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Focus Tasks
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay organized and track your daily to-dos
          </p>
        </div>

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
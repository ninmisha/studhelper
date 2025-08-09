import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageCircle, Share2, Calendar, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  member_count: number;
  whatsapp_link?: string;
  is_admin: boolean;
  created_at: string;
}

const StudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching study groups",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGroups(data || []);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create study groups",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('study_groups')
      .insert({
        name: newGroupName,
        description: newGroupDescription,
        subject: newGroupSubject,
        whatsapp_link: whatsappLink,
        admin_id: user.id,
      });

    if (error) {
      toast({
        title: "Error creating study group",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupSubject("");
      setWhatsappLink("");
      fetchGroups();
      toast({
        title: "Study group created",
        description: "Your study group has been created successfully",
      });
    }
    setIsLoading(false);
  };

  const joinGroup = async (groupId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join study groups",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('study_group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
      });

    if (error) {
      toast({
        title: "Error joining group",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchGroups();
      toast({
        title: "Joined group",
        description: "You have successfully joined the study group",
      });
    }
  };

  const openWhatsApp = (whatsappLink: string) => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    } else {
      toast({
        title: "No WhatsApp link",
        description: "This group doesn't have a WhatsApp link set up",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Study Groups
          </h2>
          <p className="text-xl text-muted-foreground">
            Connect with classmates, share materials, and study together via WhatsApp
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Study Group</CardTitle>
            <CardDescription>
              Start a new study group and invite your classmates via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="Subject (e.g., Calculus, Physics)"
                value={newGroupSubject}
                onChange={(e) => setNewGroupSubject(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Group description (optional)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <Input
              placeholder="WhatsApp group invite link (optional)"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
            />
            <Button onClick={createGroup} disabled={isLoading || !newGroupName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Study Group
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No study groups yet. Create the first one!
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <Card key={group.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {group.name}
                        {group.is_admin && <Crown className="w-4 h-4 text-warning" />}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {group.subject}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {group.description || "No description provided"}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Users className="w-4 h-4" />
                    {group.member_count} members
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => joinGroup(group.id)}
                      className="flex-1"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                    {group.whatsapp_link && (
                      <Button 
                        size="sm" 
                        onClick={() => openWhatsApp(group.whatsapp_link!)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default StudyGroups;
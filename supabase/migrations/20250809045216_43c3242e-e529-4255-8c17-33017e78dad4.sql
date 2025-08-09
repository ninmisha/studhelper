-- Create study_groups table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 1,
  whatsapp_link TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study_group_members table
CREATE TABLE public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- Study Groups policies
CREATE POLICY "Anyone can view study groups" 
ON public.study_groups 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create study groups" 
ON public.study_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" 
ON public.study_groups 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" 
ON public.study_groups 
FOR DELETE 
USING (auth.uid() = created_by);

-- Study Group Members policies
CREATE POLICY "Anyone can view group memberships" 
ON public.study_group_members 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can join groups" 
ON public.study_group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups they joined" 
ON public.study_group_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
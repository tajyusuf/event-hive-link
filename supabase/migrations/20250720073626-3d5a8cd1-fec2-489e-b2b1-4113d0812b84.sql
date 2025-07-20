-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('organizer', 'sponsor');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organizer profiles table
CREATE TABLE public.organizer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  club_name TEXT NOT NULL,
  college TEXT NOT NULL,
  social_links JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsor profiles table
CREATE TABLE public.sponsor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT NOT NULL,
  marketing_goals TEXT[],
  target_audience TEXT[],
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  audience_size INTEGER,
  demographics JSONB DEFAULT '{}',
  themes TEXT[],
  social_reach JSONB DEFAULT '{}',
  pitch_deck_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sponsored')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsor interests table
CREATE TABLE public.sponsor_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID NOT NULL REFERENCES public.sponsor_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'sponsored', 'passed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sponsor_id, event_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for organizer profiles
CREATE POLICY "Anyone can view organizer profiles" ON public.organizer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Organizers can manage their own profile" ON public.organizer_profiles
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id::text = auth.uid()::text AND role = 'organizer'
    )
  );

-- Create RLS policies for sponsor profiles
CREATE POLICY "Anyone can view sponsor profiles" ON public.sponsor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Sponsors can manage their own profile" ON public.sponsor_profiles
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id::text = auth.uid()::text AND role = 'sponsor'
    )
  );

-- Create RLS policies for events
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR organizer_id IN (
    SELECT op.id FROM public.organizer_profiles op
    JOIN public.profiles p ON op.profile_id = p.id
    WHERE p.user_id::text = auth.uid()::text
  ));

CREATE POLICY "Organizers can manage their own events" ON public.events
  FOR ALL USING (
    organizer_id IN (
      SELECT op.id FROM public.organizer_profiles op
      JOIN public.profiles p ON op.profile_id = p.id
      WHERE p.user_id::text = auth.uid()::text
    )
  );

-- Create RLS policies for sponsor interests
CREATE POLICY "Sponsors can view their own interests" ON public.sponsor_interests
  FOR SELECT USING (
    sponsor_id IN (
      SELECT sp.id FROM public.sponsor_profiles sp
      JOIN public.profiles p ON sp.profile_id = p.id
      WHERE p.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Sponsors can manage their own interests" ON public.sponsor_interests
  FOR ALL USING (
    sponsor_id IN (
      SELECT sp.id FROM public.sponsor_profiles sp
      JOIN public.profiles p ON sp.profile_id = p.id
      WHERE p.user_id::text = auth.uid()::text
    )
  );

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id::text = auth.uid()::text) OR
    recipient_id IN (SELECT id FROM public.profiles WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id::text = auth.uid()::text)
  );

-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-decks', 'pitch-decks', false);

-- Create storage policies for pitch decks
CREATE POLICY "Authenticated users can upload pitch decks" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pitch-decks' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view pitch decks" ON storage.objects
  FOR SELECT USING (bucket_id = 'pitch-decks' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own pitch decks" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizer_profiles_updated_at
  BEFORE UPDATE ON public.organizer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sponsor_profiles_updated_at
  BEFORE UPDATE ON public.sponsor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
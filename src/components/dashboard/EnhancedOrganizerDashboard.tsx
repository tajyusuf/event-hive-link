import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar,
  MapPin, 
  Users, 
  Eye,
  Plus,
  Upload,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  audience_size: number;
  themes: string[];
  status: string;
  view_count: number;
  pitch_deck_url?: string;
}

interface OrganizerProfile {
  id: string;
  club_name: string;
  college: string;
  description: string;
  social_links: any;
}

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_date: '',
    location: '',
    audience_size: '',
    themes: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchEvents();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profiles) {
        const { data: orgProfile } = await supabase
          .from('organizer_profiles')
          .select('*')
          .eq('profile_id', profiles.id)
          .single();

        setProfile(orgProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get organizer profile first
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profiles) {
        const { data: orgProfile } = await supabase
          .from('organizer_profiles')
          .select('id')
          .eq('profile_id', profiles.id)
          .single();

        if (orgProfile) {
          const { data: eventsData } = await supabase
            .from('events')
            .select('*')
            .eq('organizer_id', orgProfile.id)
            .order('created_at', { ascending: false });

          setEvents(eventsData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      const themes = formData.themes.split(',').map(t => t.trim()).filter(t => t);
      
      const { error } = await supabase
        .from('events')
        .insert({
          organizer_id: profile.id,
          name: formData.name,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location,
          audience_size: parseInt(formData.audience_size) || null,
          themes,
          status: 'draft'
        });

      if (error) throw error;

      toast.success('Event created successfully!');
      setShowEventForm(false);
      setFormData({
        name: '',
        description: '',
        event_date: '',
        location: '',
        audience_size: '',
        themes: ''
      });
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const publishEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event published successfully!');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Organizer Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {profile?.club_name || 'Organizer'}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, event) => sum + (event.view_count || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === 'published').length}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === 'draft').length}
                </p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Events</h2>
        <Button onClick={() => setShowEventForm(!showEventForm)} variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Event Creation Form */}
      {showEventForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tech Summit 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Main Auditorium, Campus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience_size">Expected Audience Size</Label>
                  <Input
                    id="audience_size"
                    type="number"
                    value={formData.audience_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, audience_size: e.target.value }))}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your event, what makes it special, and why sponsors should be interested..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="themes">Themes/Categories</Label>
                <Input
                  id="themes"
                  value={formData.themes}
                  onChange={(e) => setFormData(prev => ({ ...prev, themes: e.target.value }))}
                  placeholder="Technology, Innovation, Networking (comma-separated)"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="gradient">
                  Create Event
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEventForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first event to start attracting sponsors
              </p>
              <Button onClick={() => setShowEventForm(true)} variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {event.view_count || 0} views
                      </div>
                    </div>
                  </div>
                  <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                {event.themes && event.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.themes.map((theme, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {event.status === 'draft' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => publishEvent(event.id)}
                    >
                      Publish Event
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!event.pitch_deck_url && (
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Pitch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
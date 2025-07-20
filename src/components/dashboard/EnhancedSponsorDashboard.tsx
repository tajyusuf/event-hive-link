import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AccountMenu from '@/components/profile/AccountMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Search,
  Filter,
  Heart,
  Eye,
  MapPin,
  Calendar,
  Users,
  Building,
  MessageCircle,
  Star,
  TrendingUp
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  audience_size: number;
  themes: string[];
  view_count: number;
  organizer_profile: {
    club_name: string;
    college: string;
  };
}

interface SponsorProfile {
  id: string;
  company_name: string;
  industry: string;
  marketing_goals: any[];
  target_audience: any[];
}

const SponsorDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [profile, setProfile] = useState<SponsorProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchEvents();
      fetchInterests();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedTheme, selectedLocation]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profiles) {
        const { data: sponsorProfile } = await supabase
          .from('sponsor_profiles')
          .select('*')
          .eq('profile_id', profiles.id)
          .single();

        setProfile(sponsorProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data: eventsData } = await supabase
        .from('events')
        .select(`
          *,
          organizer_profiles!inner(
            club_name,
            college
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      const formattedEvents = eventsData?.map(event => ({
        ...event,
        organizer_profile: {
          club_name: event.organizer_profiles.club_name,
          college: event.organizer_profiles.college
        }
      })) || [];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterests = async () => {
    if (!user || !profile) return;

    try {
      const { data: interestsData } = await supabase
        .from('sponsor_interests')
        .select('event_id')
        .eq('sponsor_id', profile.id);

      setInterests(interestsData?.map(i => i.event_id) || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer_profile.club_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer_profile.college.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTheme) {
      filtered = filtered.filter(event => 
        event.themes?.includes(selectedTheme)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleInterest = async (eventId: string) => {
    if (!profile) return;

    try {
      const isInterested = interests.includes(eventId);

      if (isInterested) {
        await supabase
          .from('sponsor_interests')
          .delete()
          .eq('sponsor_id', profile.id)
          .eq('event_id', eventId);

        setInterests(prev => prev.filter(id => id !== eventId));
        toast.success('Removed from interests');
      } else {
        await supabase
          .from('sponsor_interests')
          .insert({
            sponsor_id: profile.id,
            event_id: eventId,
            status: 'interested'
          });

        setInterests(prev => [...prev, eventId]);
        toast.success('Added to interests');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update interest');
    }
  };

  const incrementViewCount = async (eventId: string) => {
    try {
      await supabase.rpc('increment_view_count', { event_id: eventId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const getUniqueThemes = () => {
    const themes = events.flatMap(event => event.themes || []);
    return [...new Set(themes)];
  };

  const getUniqueLocations = () => {
    const locations = events.map(event => event.location);
    return [...new Set(locations)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sponsor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover events perfect for {profile?.company_name || 'your company'}
          </p>
        </div>
        <AccountMenu />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-muted-foreground">Available Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{interests.length}</p>
                <p className="text-sm text-muted-foreground">Your Interests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(events.reduce((sum, event) => sum + (event.audience_size || 0), 0) / events.length) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Audience</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(events.map(e => e.organizer_profile.college)).size}
                </p>
                <p className="text-sm text-muted-foreground">Universities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, clubs, universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Themes</SelectItem>
                {getUniqueThemes().map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {getUniqueLocations().map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedTheme('');
                setSelectedLocation('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <Card className="lg:col-span-2 xl:col-span-3">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find more events
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => incrementViewCount(event.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {event.organizer_profile.club_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.organizer_profile.college}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      {event.audience_size && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.audience_size.toLocaleString()} attendees
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={interests.includes(event.id) ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterest(event.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${interests.includes(event.id) ? 'fill-current' : ''}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                {event.themes && event.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.themes.slice(0, 3).map((theme, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                    {event.themes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.themes.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {event.view_count || 0} views
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recommended Events Section */}
      {profile && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Based on your industry ({profile.industry}) and marketing goals
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents
              .filter(event => 
                event.themes?.some(theme => 
                  profile.marketing_goals?.some(goal => 
                    theme.toLowerCase().includes(goal.toLowerCase()) ||
                    goal.toLowerCase().includes(theme.toLowerCase())
                  )
                )
              )
              .slice(0, 3)
              .map((event) => (
                <Card 
                  key={`rec-${event.id}`} 
                  className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
                >
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {event.organizer_profile.club_name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Matches your {profile.industry} focus and marketing goals
                    </p>
                    <Button size="sm" variant="default" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorDashboard;
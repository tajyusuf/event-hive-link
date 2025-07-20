import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calendar, MapPin, Users, Globe, Heart, Eye, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  event_date: string;
  audience_size: number | null;
  themes: string[] | null;
  view_count: number;
  organizer_id: string;
  organizer_profiles?: {
    club_name: string;
    college: string;
  };
}

interface Sponsor {
  id: string;
  company_name: string;
  industry: string;
  website: string | null;
  budget_range: string | null;
  marketing_goals: string[] | null;
  target_audience: string[] | null;
  profiles?: {
    full_name: string;
  };
}

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch published events with organizer info
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          organizer_profiles:organizer_profiles!inner(
            club_name,
            college
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch sponsors with profile info
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from('sponsor_profiles')
        .select(`
          *,
          profiles:profiles!inner(
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (sponsorsError) throw sponsorsError;

      setEvents(eventsData || []);
      setSponsors(sponsorsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load explore data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventView = async (eventId: string) => {
    try {
      await supabase.rpc('increment_view_count', { event_id: eventId });
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, view_count: event.view_count + 1 }
          : event
      ));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleSponsorInterest = async (eventId: string) => {
    try {
      // Get current user's sponsor profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) return;

      const { data: sponsorProfile } = await supabase
        .from('sponsor_profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (!sponsorProfile) {
        toast({
          title: "Access Required",
          description: "You need to be a sponsor to express interest",
          variant: "destructive",
        });
        return;
      }

      // Check if already interested
      const { data: existing } = await supabase
        .from('sponsor_interests')
        .select('id')
        .eq('sponsor_id', sponsorProfile.id)
        .eq('event_id', eventId)
        .single();

      if (existing) {
        toast({
          title: "Already Interested",
          description: "You've already expressed interest in this event",
        });
        return;
      }

      // Create interest record
      const { error } = await supabase
        .from('sponsor_interests')
        .insert({
          sponsor_id: sponsorProfile.id,
          event_id: eventId,
          status: 'interested'
        });

      if (error) throw error;

      toast({
        title: "Interest Recorded",
        description: "Your interest has been sent to the organizer",
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to express interest",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer_profiles?.club_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = !selectedTheme || event.themes?.includes(selectedTheme);
    return matchesSearch && matchesTheme;
  });

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || sponsor.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const allThemes = [...new Set(events.flatMap(event => event.themes || []))];
  const allIndustries = [...new Set(sponsors.map(sponsor => sponsor.industry))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading explore page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Explore</h1>
              <p className="text-muted-foreground">Discover amazing events and potential sponsors</p>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, sponsors, or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="events" className="text-lg">
              Events ({filteredEvents.length})
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="text-lg">
              Sponsors ({filteredSponsors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Theme Filter for Events */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTheme === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTheme('')}
              >
                All Themes
              </Button>
              {allThemes.map(theme => (
                <Button
                  key={theme}
                  variant={selectedTheme === theme ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTheme(theme)}
                >
                  {theme}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {event.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">{event.view_count}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      by {event.organizer_profiles?.club_name} • {event.organizer_profiles?.college}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      {event.audience_size && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{event.audience_size.toLocaleString()} attendees</span>
                        </div>
                      )}
                    </div>

                    {event.themes && event.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.themes.slice(0, 3).map((theme) => (
                          <Badge key={theme} variant="secondary" className="text-xs">
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

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleEventView(event.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSponsorInterest(event.id)}
                        className="flex-1"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Interested
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-6">
            {/* Industry Filter for Sponsors */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedIndustry === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedIndustry('')}
              >
                All Industries
              </Button>
              {allIndustries.map(industry => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry)}
                >
                  {industry}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSponsors.map((sponsor) => (
                <Card key={sponsor.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {sponsor.company_name}
                    </CardTitle>
                    <CardDescription>
                      {sponsor.industry} • Contact: {sponsor.profiles?.full_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sponsor.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-primary" />
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {sponsor.budget_range && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Budget Range</h4>
                        <Badge variant="outline">{sponsor.budget_range}</Badge>
                      </div>
                    )}

                    {sponsor.marketing_goals && sponsor.marketing_goals.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Marketing Goals</h4>
                        <div className="flex flex-wrap gap-1">
                          {sponsor.marketing_goals.slice(0, 3).map((goal) => (
                            <Badge key={goal} variant="secondary" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                          {sponsor.marketing_goals.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{sponsor.marketing_goals.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {sponsor.target_audience && sponsor.target_audience.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Target Audience</h4>
                        <div className="flex flex-wrap gap-1">
                          {sponsor.target_audience.slice(0, 3).map((audience) => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                          {sponsor.target_audience.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{sponsor.target_audience.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-4" size="sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSponsors.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sponsors found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
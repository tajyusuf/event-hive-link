import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  TrendingUp,
  LogOut,
  Settings,
  Filter,
  Building
} from 'lucide-react';

interface Profile {
  id: string;
  role: string;
  full_name: string;
  email: string;
}

interface SponsorDashboardProps {
  profile: Profile;
}

export const SponsorDashboard: React.FC<SponsorDashboardProps> = ({ profile }) => {
  const { signOut } = useAuth();

  const stats = [
    { label: 'Events Viewed', value: '0', icon: Search, color: 'text-primary' },
    { label: 'Interests Sent', value: '0', icon: Heart, color: 'text-red-600' },
    { label: 'Active Chats', value: '0', icon: MessageSquare, color: 'text-blue-600' },
    { label: 'Sponsored Events', value: '0', icon: TrendingUp, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-white shadow-soft border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">EventEye</h1>
              <Badge variant="outline" className="text-accent-blue border-accent-blue">Sponsor</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Welcome, {profile.full_name}</span>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Find Events</CardTitle>
                <CardDescription>Discover events that match your sponsorship goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search events by name, location, or theme..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Events Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Events</CardTitle>
                <CardDescription>Events that match your company profile and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                  <p className="text-muted-foreground mb-4">Complete your company profile to see recommended events</p>
                  <Button variant="gradient">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Complete your profile for better matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Company Info</span>
                    <Badge variant="secondary">Incomplete</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent-blue h-2 rounded-full w-1/4"></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Interests */}
            <Card>
              <CardHeader>
                <CardTitle>My Interests</CardTitle>
                <CardDescription>Events you've shown interest in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No interests yet</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
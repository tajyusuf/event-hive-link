import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Save, 
  X,
  Mail,
  Calendar,
  Building,
  Users,
  Globe,
  Target,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'organizer' | 'sponsor';
  avatar_url: string | null;
  created_at: string;
}

interface OrganizerProfile {
  club_name: string;
  college: string;
  description: string | null;
  social_links: any;
}

interface SponsorProfile {
  company_name: string;
  industry: string;
  website: string | null;
  budget_range: string | null;
  marketing_goals: string[] | null;
  target_audience: string[] | null;
}

const AccountMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roleProfile, setRoleProfile] = useState<OrganizerProfile | SponsorProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch role-specific profile
      if (profileData.role === 'organizer') {
        const { data: orgData, error: orgError } = await supabase
          .from('organizer_profiles')
          .select('*')
          .eq('profile_id', profileData.id)
          .single();

        if (orgError) throw orgError;
        setRoleProfile(orgData as OrganizerProfile);
        setEditData({
          full_name: profileData.full_name,
          club_name: orgData.club_name,
          college: orgData.college,
          description: orgData.description,
          social_links: orgData.social_links,
        });
      } else {
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsor_profiles')
          .select('*')
          .eq('profile_id', profileData.id)
          .single();

        if (sponsorError) throw sponsorError;
        setRoleProfile(sponsorData as SponsorProfile);
        setEditData({
          full_name: profileData.full_name,
          company_name: sponsorData.company_name,
          industry: sponsorData.industry,
          website: sponsorData.website,
          budget_range: sponsorData.budget_range,
          marketing_goals: sponsorData.marketing_goals,
          target_audience: sponsorData.target_audience,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Update basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: editData.full_name })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update role-specific profile
      if (profile.role === 'organizer') {
        const { error: orgError } = await supabase
          .from('organizer_profiles')
          .update({
            club_name: editData.club_name,
            college: editData.college,
            description: editData.description,
            social_links: editData.social_links,
          })
          .eq('profile_id', profile.id);

        if (orgError) throw orgError;
      } else {
        const { error: sponsorError } = await supabase
          .from('sponsor_profiles')
          .update({
            company_name: editData.company_name,
            industry: editData.industry,
            website: editData.website,
            budget_range: editData.budget_range,
            marketing_goals: editData.marketing_goals,
            target_audience: editData.target_audience,
          })
          .eq('profile_id', profile.id);

        if (sponsorError) throw sponsorError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
      await fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!profile) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
              <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/explore')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Explore</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </DialogTitle>
            <DialogDescription>
              View and manage your account details and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={editData.full_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <User className="h-4 w-4" />
                        {profile.full_name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role-Specific Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {profile.role === 'organizer' ? <Users className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                  {profile.role === 'organizer' ? 'Organizer Details' : 'Sponsor Details'}
                </CardTitle>
                <CardDescription>
                  {profile.role === 'organizer' 
                    ? 'Your organization and event details' 
                    : 'Your company and sponsorship information'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.role === 'organizer' && roleProfile ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="club_name">Club/Organization Name</Label>
                        {isEditing ? (
                          <Input
                            id="club_name"
                            value={editData.club_name || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, club_name: e.target.value }))}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded">{(roleProfile as OrganizerProfile).club_name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="college">College/Institution</Label>
                        {isEditing ? (
                          <Input
                            id="college"
                            value={editData.college || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, college: e.target.value }))}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded">{(roleProfile as OrganizerProfile).college}</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="description"
                          value={editData.description || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Tell us about your organization..."
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded min-h-[80px]">
                          {(roleProfile as OrganizerProfile).description || 'No description provided'}
                        </div>
                      )}
                    </div>
                  </>
                ) : profile.role === 'sponsor' && roleProfile ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company_name">Company Name</Label>
                        {isEditing ? (
                          <Input
                            id="company_name"
                            value={editData.company_name || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, company_name: e.target.value }))}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded">{(roleProfile as SponsorProfile).company_name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        {isEditing ? (
                          <Input
                            id="industry"
                            value={editData.industry || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded">{(roleProfile as SponsorProfile).industry}</div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        {isEditing ? (
                          <Input
                            id="website"
                            value={editData.website || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://..."
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                            <Globe className="h-4 w-4" />
                            {(roleProfile as SponsorProfile).website || 'Not provided'}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget_range">Budget Range</Label>
                        {isEditing ? (
                          <Input
                            id="budget_range"
                            value={editData.budget_range || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, budget_range: e.target.value }))}
                            placeholder="e.g., $10,000 - $50,000"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                            <DollarSign className="h-4 w-4" />
                            {(roleProfile as SponsorProfile).budget_range || 'Not specified'}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountMenu;
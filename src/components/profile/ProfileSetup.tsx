import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';

interface ProfileSetupProps {
  role: 'organizer' | 'sponsor';
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    description: '',
    
    // Organizer fields
    clubName: '',
    college: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    },
    
    // Sponsor fields
    companyName: '',
    website: '',
    industry: '',
    budgetRange: '',
    marketingGoals: [] as string[],
    targetAudience: [] as string[]
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinksChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleArrayChange = (field: 'marketingGoals' | 'targetAudience', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: formData.fullName,
          role
        });

      if (profileError) throw profileError;

      // Create role-specific profile
      if (role === 'organizer') {
        const { error: orgError } = await supabase
          .from('organizer_profiles')
          .insert({
            profile_id: user.id,
            club_name: formData.clubName,
            college: formData.college,
            description: formData.description,
            social_links: formData.socialLinks
          });

        if (orgError) throw orgError;
      } else {
        const { error: sponsorError } = await supabase
          .from('sponsor_profiles')
          .insert({
            profile_id: user.id,
            company_name: formData.companyName,
            website: formData.website,
            industry: formData.industry,
            budget_range: formData.budgetRange,
            marketing_goals: formData.marketingGoals,
            target_audience: formData.targetAudience
          });

        if (sponsorError) throw sponsorError;
      }

      toast.success('Profile created successfully!');
      navigate('/explore');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Complete Your {role === 'organizer' ? 'Organizer' : 'Sponsor'} Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={role === 'organizer' ? 
                "Tell sponsors about your club and events..." : 
                "Describe your company and sponsorship interests..."
              }
              rows={3}
            />
          </div>

          {/* Organizer Specific Fields */}
          {role === 'organizer' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clubName">Club/Organization Name *</Label>
                  <Input
                    id="clubName"
                    value={formData.clubName}
                    onChange={(e) => handleInputChange('clubName', e.target.value)}
                    placeholder="e.g., Tech Club, Drama Society"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College/University *</Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    placeholder="e.g., MIT, Stanford University"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.socialLinks).map(([platform, value]) => (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={platform} className="capitalize">{platform}</Label>
                      <Input
                        id={platform}
                        value={value}
                        onChange={(e) => handleSocialLinksChange(platform, e.target.value)}
                        placeholder={`https://${platform}.com/your-handle`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sponsor Specific Fields */}
          {role === 'sponsor' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., TechCorp Inc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g., Technology, Finance, Healthcare"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Input
                    id="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                    placeholder="e.g., $1,000 - $5,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketingGoals">Marketing Goals</Label>
                <Input
                  id="marketingGoals"
                  onChange={(e) => handleArrayChange('marketingGoals', e.target.value)}
                  placeholder="e.g., Brand Awareness, Lead Generation, Product Launch (comma-separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  onChange={(e) => handleArrayChange('targetAudience', e.target.value)}
                  placeholder="e.g., Students, Young Professionals, Tech Enthusiasts (comma-separated)"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Complete Profile Setup
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
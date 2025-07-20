import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Building, Loader2 } from 'lucide-react';

const RoleSelection = () => {
  const [role, setRole] = useState<'organizer' | 'sponsor'>('organizer');
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth
    if (!user || !session) {
      navigate('/auth');
      return;
    }

    // Check if user already has a profile
    const checkProfile = async () => {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        // If profile exists, redirect to dashboard
        if (existingProfile) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user, session, navigate]);

  const handleRoleSelection = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          role
        });

      if (profileError) {
        toast.error('Failed to create profile');
        console.error('Error creating profile:', profileError);
        return;
      }

      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EventEye</h1>
          <p className="text-white/80">Complete your profile setup</p>
        </div>
        
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Choose Your Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as 'organizer' | 'sponsor')} 
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <RadioGroupItem value="organizer" id="organizer" />
                    <Label htmlFor="organizer" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Event Organizer</div>
                        <div className="text-sm text-muted-foreground">
                          I organize events and need sponsorship
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <RadioGroupItem value="sponsor" id="sponsor" />
                    <Label htmlFor="sponsor" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building className="h-5 w-5 text-accent-blue" />
                      <div>
                        <div className="font-medium">Sponsor</div>
                        <div className="text-sm text-muted-foreground">
                          I want to sponsor events and reach audiences
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={handleRoleSelection}
                variant="gradient" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
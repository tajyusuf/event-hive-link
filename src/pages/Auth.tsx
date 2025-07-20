import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user && session && !loading) {
        try {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            // User has profile, redirect to dashboard
            navigate('/dashboard');
          } else {
            // User doesn't have profile, redirect to role selection
            navigate('/role-selection');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          // If there's an error, redirect to role selection as fallback
          navigate('/role-selection');
        }
      }
    };

    checkUserAndRedirect();
  }, [user, session, loading, navigate]);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">EventEye</h1>
            <p className="text-white/80">Smart matchmaking for events and sponsors</p>
          </div>
        </div>
        
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  );
};

export default Auth;
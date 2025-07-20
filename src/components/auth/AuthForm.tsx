import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Users, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'organizer' | 'sponsor'>('organizer');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          toast.error('Please enter your full name');
          return;
        }
        const { error } = await signUp(email, password, role, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
          } else {
            toast.error(error.message || 'Failed to create account');
          }
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message || 'Failed to sign in');
          }
        } else {
          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error('Failed to sign in with Google');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {mode === 'signin' ? 'Welcome Back' : 'Join EventEye'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Sign in to your account to continue' 
            : 'Create your account and start connecting'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          type="button"
          variant="outline" 
          size="lg" 
          className="w-full mb-4"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'organizer' | 'sponsor')} className="flex gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <RadioGroupItem value="organizer" id="organizer" />
                    <Label htmlFor="organizer" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4 text-primary" />
                      Event Organizer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <RadioGroupItem value="sponsor" id="sponsor" />
                    <Label htmlFor="sponsor" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4 text-accent-blue" />
                      Sponsor
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button 
            variant="link" 
            onClick={onToggleMode}
            className="text-primary hover:text-primary-deep"
          >
            {mode === 'signin' ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
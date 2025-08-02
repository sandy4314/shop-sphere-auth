import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(email, password)) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-gray-500">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <Button 
              type="button" 
              variant="link" 
              className="p-0 text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </Button>
          </div>
          
          <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90">
            Sign In
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 text-primary hover:text-primary/80"
              onClick={onSwitchToRegister}
            >
              Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
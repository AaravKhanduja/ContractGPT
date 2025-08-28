'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw new Error(error.message);

        // Simple redirect after successful sign in
        window.location.href = '/';
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { error } = await signUp(formData.email, formData.password);
        if (error) throw new Error(error.message);

        // Show verification message and redirect to sign in
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setLoading(false);

        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) throw new Error(error.message);
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ContractGPT</span>
        </Link>
        <div className="text-sm text-muted-foreground">AI-Powered Contract Generation</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="shadow-2xl border-0 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                        disabled={loading}
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </div>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                variant="outline"
                className="w-full h-12 bg-background hover:bg-accent border-border hover:border-border transition-all duration-200"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              {/* Toggle between login/signup */}
              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <Link
                    href={isLogin ? '/auth/signup' : '/auth/signin'}
                    className="ml-2 text-primary hover:underline font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-6 text-sm text-muted-foreground border-t border-border/30">
        <p>
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

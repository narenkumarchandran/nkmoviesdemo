import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'login') {
        // Placeholder API call for Login
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
        if (username === 'error') throw new Error('Invalid credentials');
        
        const data = { token: 'sample-jwt-token', username };
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/';
      } 
      else if (view === 'signup') {
        // Placeholder API call for Sign Up
        await new Promise(resolve => setTimeout(resolve, 800));
        
        import('react-hot-toast').then(t => t.default.success('Sign up successful! Please log in.'));
        setView('login');
        setPassword('');
      } 
      else if (view === 'forgot') {
        // Placeholder API call for Forgot Password
        await new Promise(resolve => setTimeout(resolve, 800));
        
        import('react-hot-toast').then(t => t.default.success(`Password reset link sent to ${resetEmail}`));
        setView('login');
        setResetEmail('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (view === 'login' || view === 'signup') return username.trim() && password.trim();
    return resetEmail.trim();
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center bg-background font-sans text-foreground"
      style={{
        backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/42df4e1f-bef6-499e-87ff-c990584de314/5e7c3858-d6c6-49c0-8f10-14ba0a9fd2a6/IN-en-20230904-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Gradient Overlay equivalent to Netflix setup using standard variables */}
      <div className="absolute inset-0 bg-background/50 bg-gradient-to-b from-background/90 via-background/40 to-background/90 sm:bg-background/40" />
      
      {/* Container simulating Netflix's login card but maintaining standard variables */}
      <div className="relative z-10 w-full max-w-[450px] rounded-lg bg-card/85 p-8 sm:p-14 shadow-2xl backdrop-blur-sm border border-border/50 text-card-foreground">
        
        <h1 className="mb-7 text-3xl font-bold tracking-wide">
          {view === 'login' && 'Sign In'}
          {view === 'signup' && 'Sign Up'}
          {view === 'forgot' && 'Reset Password'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          
          {view !== 'forgot' && (
            <div className="space-y-1">
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                className="h-[50px] bg-input border-0 focus-visible:ring-2 focus-visible:ring-ring rounded font-medium text-base text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {view === 'forgot' && (
            <div className="space-y-1">
              <Input
                id="resetEmail"
                type="email"
                placeholder="Email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={loading}
                required
                className="h-[50px] bg-input border-0 focus-visible:ring-2 focus-visible:ring-ring rounded font-medium text-base text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {view !== 'forgot' && (
            <div className="space-y-1 relative">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="h-[50px] bg-input border-0 focus-visible:ring-2 focus-visible:ring-ring rounded font-medium text-base text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="mt-6 h-[50px] w-full rounded bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Processing...' : (
              view === 'login' ? 'Sign In' :
              view === 'signup' ? 'Sign Up' : 'Send Reset Link'
            )}
          </Button>

          {/* Login Actions Row */}
          {view === 'login' && (
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-ring focus:ring-offset-background" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button
                type="button"
                onClick={() => { setView('forgot'); setError(''); }}
                className="hover:underline hover:text-foreground"
              >
                Need help?
              </button>
            </div>
          )}
        </form>

        <div className="mt-16 text-muted-foreground">
          {view === 'login' && (
            <p className="text-base">
              New to our app?{' '}
              <button 
                type="button"
                onClick={() => { setView('signup'); setError(''); }} 
                className="font-medium text-foreground hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
              >
                Sign up now.
              </button>
            </p>
          )}

          {view === 'signup' && (
            <p className="text-base">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setView('login'); setError(''); }} 
                className="font-medium text-foreground hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded"
              >
                Sign in.
              </button>
            </p>
          )}

          {view === 'forgot' && (
            <p className="text-base text-center mt-[-2rem]">
              Remembered your password?{' '}
              <br className="sm:hidden" />
              <button 
                type="button"
                onClick={() => { setView('login'); setError(''); }} 
                className="font-medium text-foreground hover:underline mt-2 sm:mt-0 focus:outline-none focus:ring-1 focus:ring-ring rounded"
              >
                Sign in safely.
              </button>
            </p>
          )}

          <p className="mt-4 text-xs">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <button className="text-primary hover:underline">Learn more.</button>
          </p>
        </div>
      </div>
    </div>
  );
}

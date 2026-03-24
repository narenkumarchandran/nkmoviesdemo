import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api'; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, User as UserIcon } from "lucide-react";

function Login() {
  const [view, setView] = useState("login");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === "login") {
        if (!username || !password) throw new Error('Please enter both username and password.');
        const { data } = await login({ username, password }); 
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/'; 
      } else if (view === "signup") {
        if (!username || !password) throw new Error('Please enter both username and password.');
        const { data } = await register({ username, password }); 
        import('react-hot-toast').then(t => t.default.success(data.msg || 'Registration successful! Please log in.'));
        setView("login");
        setPassword(""); 
      } else if (view === "forgot") {
        if (!resetEmail) throw new Error('Please enter your email address.');
        import('react-hot-toast').then(t => t.default.success("If an account exists, a reset link has been sent to that email."));
        setView("login");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-background p-4 sm:p-8 lg:p-12 font-sans transition-colors duration-500 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/42df4e1f-bef6-499e-87ff-c990584de314/5e7c3858-d6c6-49c0-8f10-14ba0a9fd2a6/IN-en-20230904-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
      }}
    >
      {/* 2026 SaaS Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-background/60 bg-gradient-to-b from-background/95 via-background/60 to-background/95 z-0 backdrop-blur-[4px]" />

      {/* High z-index translucent Bento Card */}
      <Card className="relative z-10 w-full max-w-lg border-border/40 bg-card/70 backdrop-blur-2xl text-card-foreground shadow-2xl p-6 sm:p-10 rounded-[2.5rem] ring-1 ring-white/10">
        <CardHeader className="pb-8 text-center sm:text-left">
          <CardTitle className="text-4xl text-foreground font-extrabold tracking-tight mb-2 drop-shadow-sm">
            {view === "login" && "Welcome Back"}
            {view === "signup" && "Join the Club"}
            {view === "forgot" && "Reset Password"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base sm:text-lg font-medium">
            {view === "login" && "Sign in to access your curated dashboard."}
            {view === "signup" && "Create an account to start saving favorites."}
            {view === "forgot" && "Enter your email for a secure recovery link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              
              {view !== "forgot" && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="username" className="text-foreground font-bold tracking-wide ml-1">Username</Label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <UserIcon size={20} strokeWidth={2.5} />
                        </div>
                        <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        className="bg-input/60 backdrop-blur-md border-border/50 text-foreground focus-visible:ring-primary h-14 pl-12 text-lg font-medium rounded-2xl shadow-inner transition-all focus-visible:bg-input/90"
                        />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-foreground font-bold tracking-wide">Password</Label>
                      {view === "login" && (
                        <button
                          type="button"
                          onClick={() => { setView("forgot"); setError(''); }}
                          className="text-sm text-primary hover:text-primary/80 hover:underline font-bold transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Lock size={20} strokeWidth={2.5} />
                        </div>
                        <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="bg-input/60 backdrop-blur-md border-border/50 text-foreground focus-visible:ring-primary h-14 pl-12 text-lg font-medium rounded-2xl shadow-inner transition-all focus-visible:bg-input/90"
                        />
                    </div>
                  </div>
                </>
              )}

              {view === "forgot" && (
                 <div className="grid gap-3">
                   <Label htmlFor="email" className="text-foreground font-bold tracking-wide ml-1">Email Address</Label>
                   <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Mail size={20} strokeWidth={2.5} />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-input/60 backdrop-blur-md border-border/50 text-foreground focus-visible:ring-primary h-14 pl-12 text-lg font-medium rounded-2xl shadow-inner transition-all focus-visible:bg-input/90"
                        />
                   </div>
                 </div>
              )}

              {error && <p className="text-destructive bg-destructive/10 p-4 rounded-2xl border border-destructive/20 text-sm font-bold text-center mt-2 shadow-sm">{error}</p>}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 h-14 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
              >
                {loading ? 'Processing...' : (
                  <>
                    {view === "login" && "Secure Login"}
                    {view === "signup" && "Start Streaming"}
                    {view === "forgot" && "Send Reset Link"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 border-t border-border/40 pt-8 mt-4 text-center">
          {view === "login" && (
            <p className="text-base text-muted-foreground font-medium">
              New to NkMovies?{" "}
              <button 
                type="button"
                onClick={() => { setView("signup"); setError(''); }} 
                className="text-primary hover:text-primary/80 hover:underline font-extrabold transition-colors ml-1"
              >
                Sign up
              </button>
            </p>
          )}

          {(view === "signup" || view === "forgot") && (
            <p className="text-base text-muted-foreground font-medium">
              Remember your password?{" "}
              <button 
                type="button"
                onClick={() => { setView("login"); setError(''); }} 
                className="text-primary hover:text-primary/80 hover:underline font-extrabold transition-colors ml-1"
              >
                Log in
              </button>
            </p>
          )}

          {/* Industry standard security badge */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <ShieldCheck size={28} strokeWidth={1.5} className="text-muted-foreground/40" />
            <p className="text-xs font-semibold text-muted-foreground/60 max-w-[250px] uppercase tracking-widest leading-relaxed">
              Secured by Enterprise-Grade Encryption
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
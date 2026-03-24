import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Sun, Moon, Menu, X as CloseIcon, Home, Heart, LogOut, User } from "lucide-react";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token"); 
  const username = localStorage.getItem("username");

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("username"); 
    window.location.href = '/'; 
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none flex justify-center">
      <header className="pointer-events-auto w-full max-w-6xl rounded-full border border-border/40 bg-background/70 backdrop-blur-xl shadow-sm transition-colors duration-500">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          
          {/* Left Side: Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transform -rotate-6">
                <Film size={20} strokeWidth={2.5} />
              </div>
              <span className="hidden sm:inline-block">NkMovies</span>
            </Link>
          </div>

          {/* Middle: Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {(!token || location.pathname !== "/") && (
              <Link to="/">
                <Button variant="ghost" className="rounded-full px-5 font-semibold text-muted-foreground hover:text-foreground">
                  Home
                </Button>
              </Link>
            )}
            {token && (
              <Link to="/favorites">
                <Button variant="ghost" className="rounded-full px-5 font-semibold text-muted-foreground hover:text-foreground">
                  Favorites
                </Button>
              </Link>
            )}
          </div>

          {/* Right Side: Theme & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary/80 transition-all shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon size={18} className="text-yellow-400" /> : <Sun size={18} className="text-orange-500" />}
            </button>

            {token ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-3 pl-5 border-l border-border/50">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border/50 shadow-inner">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">{username}</span>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full font-bold ml-2 border-border/50 h-9">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="ml-4">
                <Button className="rounded-full px-7 font-bold shadow-sm shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/30 transition-all">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-all shrink-0"
            >
              {theme === 'dark' ? <Moon size={18} className="text-yellow-400" /> : <Sun size={18} className="text-orange-500" />}
            </button>
            <button 
              className="p-2 text-foreground rounded-full hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto absolute top-20 left-4 right-4 rounded-3xl border border-border/40 bg-background/95 backdrop-blur-2xl p-6 shadow-2xl animate-in slide-in-from-top-4 md:hidden flex flex-col gap-2">
          {token && (
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/40">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shadow-inner">
                <User size={24} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Signed in as</span>
                <span className="font-extrabold text-foreground text-lg">{username}</span>
              </div>
            </div>
          )}

          {(!token || location.pathname !== "/") && (
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-bold h-14 rounded-2xl bg-secondary/20 hover:bg-secondary/60">
                <Home className="mr-3 text-primary" size={20} /> Home
              </Button>
            </Link>
          )}

          {token && (
            <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-bold h-14 rounded-2xl bg-secondary/20 hover:bg-secondary/60 mt-2">
                <Heart className="mr-3 text-red-500" size={20} /> Favorites
              </Button>
            </Link>
          )}

          <div className="mt-4 pt-4 border-t border-border/40">
            {token ? (
              <Button onClick={handleLogout} variant="outline" className="w-full h-14 rounded-2xl font-bold text-lg border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                <LogOut className="mr-3" size={20} /> Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-primary/20 shadow-lg">
                  Log In Securely
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
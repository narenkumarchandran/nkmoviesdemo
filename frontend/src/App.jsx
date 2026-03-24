import { Routes, Route, Navigate } from "react-router-dom"; 
import { MovieProvider } from "./context/MovieContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import WatchMovie from "./pages/WatchMovie";
import MovieDetails from "./pages/MovieDetails";

function App() {
  const token = localStorage.getItem("token");

  return (
    <MovieProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }} 
      />
      <Routes>
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/favorites" 
          element={token ? <Favorites /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/movie/:id" 
          element={<MovieDetails />} 
        />
        <Route 
          path="/watch/:id" 
          element={token ? <WatchMovie /> : <Navigate to="/login" />} 
        />
      </Routes>
    </MovieProvider>
  );
}

export default App;
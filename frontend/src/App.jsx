import { Routes, Route, Navigate } from "react-router-dom"; 
import { MovieProvider } from "./context/MovieContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import WatchMovie from "./pages/WatchMovie";
import MovieDetails from "./pages/MovieDetails";

function App() {
  const token = localStorage.getItem("token");

  return (
    <MovieProvider>
      {/* Notice there is no <Router> tag here anymore! */}
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
          element={token ? <MovieDetails /> : <Navigate to="/" />} 
        />
        <Route 
          path="/watch/:id" 
          element={token ? <WatchMovie /> : <Navigate to="/" />} 
        />
      </Routes>
    </MovieProvider>
  );
}

export default App;
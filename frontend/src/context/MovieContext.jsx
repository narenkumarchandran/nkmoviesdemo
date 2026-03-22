import { createContext, useState, useContext, useEffect } from "react";
// 1. Updated these imports to match your api.js exactly!
import { getFavorites, addFavorite, removeFavorite } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites when the app loads (if logged in)
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 2. Updated function call here
          const response = await getFavorites();
          // Axios puts the backend response inside '.data'
          setFavorites(response.data || []);
        } catch (error) {
          console.error("Failed to load favorites", error);
        }
      }
    };
    fetchFavorites();
  }, []);

  // Add a movie to favorites
  const addToFavorites = async (movie) => {
    try {
      const movieData = {
        movieId: movie.id.toString(), 
        title: movie.title,
        posterPath: movie.poster_path
      };
      
      // 3. Updated function call here
      const response = await addFavorite(movieData);
      setFavorites(response.data); 
    } catch (error) {
      console.error("Failed to add favorite", error);
      alert("Please log in to add movies to your favorites.");
    }
  };

  // Remove a movie from favorites
  const removeFromFavorites = async (movieId) => {
    try {
      // 4. Updated function call here
      const response = await removeFavorite(movieId);
      setFavorites(response.data); 
    } catch (error) {
      console.error("Failed to remove favorite", error);
    }
  };

  // Check if a movie is already favorited
  const isFavorite = (movieId) => {
    if (!movieId) return false;
    return favorites.some((fav) => fav.movieId === movieId.toString() || fav.id === movieId);
  };

  return (
    <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};
import axios from "axios";

export const API = axios.create({ baseURL: import.meta.env.VITE_API_URL||"http://localhost:5000/api" });

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Handle 401 Expired Tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
// Corrected API calls
export const getFavorites = () => API.get("/favorites");

export const addFavorite = (movie) => API.post("/favorites", movie);

export const removeFavorite = (movieId) => API.delete(`/favorites/${movieId}`);


const API_KEY=import.meta.env.VITE_TMDB_KEY;

export const getPopularMovie= async (page = 1)=> {
    const response=await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data=await response.json();
    return { results: data.results, totalPages: data.total_pages };
};


export const getSearchMovie= async (query, page = 1)=> {
    const response=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    const data=await response.json();
    return { results: data.results, totalPages: data.total_pages };
};


export const getGenreMovie= async (genreid, page = 1)=> {
    const response=await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreid}&primary_release_year=2024&sort_by=popularity.desc&page=${page}`);
    const data=await response.json();
    return { results: data.results, totalPages: data.total_pages };
};

// --- Deep Metadata & Details Endpoints ---

export const getMovieDetails = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
    return await response.json();
};

export const getMovieVideos = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results; // Array of videos
};

export const getMovieProviders = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results; // Object with country codes (US, IN, etc.)
};

export const getMovieCredits = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`);
    return await response.json(); // Contains .cast and .crew arrays
};

export const getMovieRecommendations = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results; // Array of recommended movies
};


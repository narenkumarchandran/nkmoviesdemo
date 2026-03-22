import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../css/MovieDetails.css";

import {
  getMovieDetails,
  getMovieVideos,
  getMovieProviders,
  getMovieCredits,
  getMovieRecommendations,
} from "../services/api";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [providers, setProviders] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [det, vid, prov, cre, rec] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getMovieProviders(id),
          getMovieCredits(id),
          getMovieRecommendations(id),
        ]);

        setDetails(det);
        
        // Find Official Trailer
        const trailer = vid.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailerKey(trailer ? trailer.key : null);

        // Find IN (India) providers, fallback to US if empty
        const regionData = prov.IN || prov.US || null;
        setProviders(regionData);

        setCast(cre.cast.slice(0, 10)); // Top 10 cast
        setRecommendations(rec.slice(0, 10)); // 10 recommendations

      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0); // Scroll to top when page changes
  }, [id]);

  if (loading) {
    return (
      <div className="movie-details-page">
        <NavBar />
        <Skeleton height={500} baseColor="#141414" highlightColor="#222" />
      </div>
    );
  }

  if (!details) {
    return <div style={{ color: "white", padding: "50px", textAlign: "center" }}>Movie not found.</div>;
  }

  const formatRuntime = (mins) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="movie-details-page">
      <NavBar />
      
      {/* Hero Section */}
      <div 
        className="details-hero" 
        style={{ backgroundImage: details.backdrop_path ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})` : 'none' }}
      >
        <div className="details-hero-overlay"></div>
        <div className="details-content">
          <div className="details-poster">
            <img src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "https://via.placeholder.com/500x750/141414/00f3ff?text=No+Poster+Available"} alt={details.title} />
          </div>
          
          <div className="details-info">
            <h1>{details.title}</h1>
            {details.tagline && <div className="tagline">"{details.tagline}"</div>}
            
            <button 
              className="watch-it-btn" 
              onClick={() => navigate(`/watch/${id}`)}
            >
              ▶ Watch It Now
            </button>
            
            <div className="metadata-pills" style={{ marginTop: '20px' }}>
              <span className="pill">{details.release_date?.substring(0, 4)}</span>
              <span className="pill">{formatRuntime(details.runtime)}</span>
              <span className="pill">{details.status}</span>
              <span className="pill">★ {Number(details.vote_average).toFixed(1)}</span>
            </div>

            <div className="metadata-pills">
               {details.genres.map(g => <span key={g.id} className="pill" style={{ borderColor: '#00f3ff', color: '#00f3ff' }}>{g.name}</span>)}
            </div>

            <h3>Overview</h3>
            <p>{details.overview}</p>

             <div className="metadata-pills">
                {details.budget > 0 && <span className="pill">Budget: {formatCurrency(details.budget)}</span>}
                {details.revenue > 0 && <span className="pill">Revenue: {formatCurrency(details.revenue)}</span>}
            </div>

          </div>

          {/* Trailer Embedding */}
          {trailerKey && (
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Where to Watch */}
      {providers && (providers.flatrate || providers.rent || providers.buy) && (
        <div className="section-container">
          <h2>Stream / Rent / Buy</h2>
          <div className="providers-container">
            {['flatrate', 'rent', 'buy'].map((type) => (
              providers[type]?.map(provider => (
                <img 
                  key={provider.provider_id + type}
                  src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`} 
                  alt={provider.provider_name}
                  className="provider-logo"
                  title={`${provider.provider_name} (${type})`}
                />
              ))
            ))}
          </div>
        </div>
      )}

      {/* Cast & Crew */}
      {cast.length > 0 && (
        <div className="section-container">
          <h2>Top Billed Cast</h2>
          <div className="horizontal-scroll">
            {cast.map(person => (
              <div key={person.cast_id} className="cast-card">
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'} 
                  alt={person.name} 
                />
                <div className="cast-info">
                  <h4>{person.name}</h4>
                  <p>{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="section-container">
          <h2>You Might Also Like</h2>
          <div className="horizontal-scroll">
            {recommendations.map(movie => (
              <img 
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="rec-poster"
                onClick={() => navigate(`/movie/${movie.id}`)}
                title={movie.title}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default MovieDetails;

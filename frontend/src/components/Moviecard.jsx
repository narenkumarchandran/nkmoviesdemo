import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Moviecard.css";
// 1. Import your context
import { useMovieContext } from "../context/MovieContext";

function Moviecard({ movie }) {
  const [showModal, setShowModal] = useState(false);
  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const navigate = useNavigate();
  // 2. Destructure the functions and state we need from the context
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  // 3. Determine if THIS specific movie is a favorite
  const favorite = isFavorite(movie.id || movie.movieId);

  // 4. Handle the heart click using context functions
  async function onFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent opening modal when clicking favorite
    
    if (isHeartLoading) return;
    setIsHeartLoading(true);

    try {
        if (favorite) {
          await removeFromFavorites(movie.id || movie.movieId);
        } else {
          await addToFavorites(movie);
        }
    } finally {
        setIsHeartLoading(false);
    }
  }

  // 5. Handle the image path. 
  // TMDB uses 'poster_path'. Your backend uses 'posterPath'. This checks for both.
  const imagePath = movie.poster_path || movie.posterPath;
  const posterSrc = imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : "https://via.placeholder.com/500x750/141414/00f3ff?text=No+Poster+Available";
  
  // Safely format the rating, handling cases where it might not exist yet
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : "N/A";

  return (
    <>
      <div className="movie-card" onClick={() => setShowModal(true)}>
      <div className="movie-poster">
        <Link to={`/movie/${movie.id || movie.movieId}`} onClick={(e) => e.stopPropagation()}>
          <img
            src={posterSrc}
            alt={movie.title}
          />
        </Link>
        <div className="movie-overlay">
          <button
            className={`fav-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ❤︎
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-des">
          <span className="rating">
            <i>★ </i>
            {rating}
          </span>
        </div>
      </div>
      </div>

      {/* Modal for Movie Details */}
      {showModal && (
        <div className="movie-modal-overlay" onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
        }}>
          <div className="movie-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className={`fav-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
              style={{ position: 'absolute', top: '15px', left: '20px', background: 'rgba(0,0,0,0.5)', zIndex: 10, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              ❤︎
            </button>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>✖</button>
            <div className="modal-body">
              <img 
                src={posterSrc} 
                alt={movie.title} 
                className="modal-poster"
              />
              <div className="modal-info">
                <h2>{movie.title}</h2>
                <div className="modal-rating">★ {rating}</div>
                <div className="modal-overview">
                  <h3>Overview</h3>
                  <p>{movie.overview || "No description available for this movie."}</p>
                </div>
                <button 
                  className="more-info-btn"
                  onClick={() => {
                    navigate(`/movie/${movie.id || movie.movieId}`);
                    setShowModal(false); /* Close modal upon navigation */
                  }}
                >
                  View More Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Moviecard;
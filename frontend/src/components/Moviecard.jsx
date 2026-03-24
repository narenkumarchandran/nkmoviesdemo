import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import { Button } from "@/components/ui/button";
import { Heart, Star, X, Info } from "lucide-react";

function Moviecard({ movie }) {
  const [showModal, setShowModal] = useState(false);
  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const favorite = isFavorite(movie.id || movie.movieId);

  async function onFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
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

  const imagePath = movie.poster_path || movie.posterPath;
  const posterSrc = imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : "https://via.placeholder.com/500x750/141414/00f3ff?text=No+Poster+Available";
  
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : "N/A";

  return (
    <>
      {/* SaaS Style Movie Card */}
      <div 
        className="relative group overflow-hidden rounded-2xl bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer flex flex-col h-full w-full mx-auto"
        onClick={() => setShowModal(true)}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary">
          <Link to={`/movie/${movie.id || movie.movieId}`} onClick={(e) => e.stopPropagation()}>
            <img
              src={posterSrc}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Minimal Favorite Toggle */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-[-10px] group-hover:translate-y-0">
            <button
              className={`p-2.5 rounded-full backdrop-blur-xl transition-all shadow-sm ${favorite ? "bg-primary/95 text-primary-foreground shadow-primary/20" : "bg-black/60 text-white hover:bg-background/90 hover:text-primary border border-white/10 hover:border-border"}`}
              onClick={onFavoriteClick}
              disabled={isHeartLoading}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart size={18} className={`${favorite ? "fill-current" : ""} ${isHeartLoading ? "animate-pulse" : ""}`} strokeWidth={favorite ? 2.5 : 2} />
            </button>
          </div>
        </div>

        {/* Card Info Box */}
        <div className="p-5 flex flex-col flex-grow justify-between bg-card z-10">
          <h3 className="font-bold text-foreground text-base tracking-tight line-clamp-1 mb-2">{movie.title}</h3>
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <Star size={14} className="text-primary mr-1.5 fill-primary/20" strokeWidth={2.5} /> {rating}
          </div>
        </div>
      </div>

      {/* Detail Modal (Bento Expand) */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="relative w-full max-w-4xl bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              className="absolute top-5 right-5 z-20 p-2.5 bg-background/50 backdrop-blur-md hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors border border-border/40"
              onClick={() => setShowModal(false)}
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Poster Half */}
            <div className="relative md:w-5/12 lg:w-2/5 flex-shrink-0 bg-secondary">
              <img 
                src={posterSrc} 
                alt={movie.title} 
                className="w-full h-[40vh] md:h-full object-cover"
              />
              <button
                className={`absolute top-5 left-5 p-3.5 rounded-full backdrop-blur-xl transition-all shadow-xl z-20 border hover:scale-105 active:scale-95 ${favorite ? "bg-primary/95 text-primary-foreground border-primary shadow-primary/20" : "bg-black/60 text-white hover:bg-background/90 hover:text-primary border-white/20 hover:border-border"}`}
                onClick={onFavoriteClick}
                disabled={isHeartLoading}
              >
                <Heart size={20} className={`${favorite ? "fill-current" : ""} ${isHeartLoading ? "animate-pulse" : ""}`} strokeWidth={favorite ? 2.5 : 2} />
              </button>
            </div>

            {/* Content Half */}
            <div className="p-8 md:p-10 flex flex-col overflow-y-auto md:w-7/12 lg:w-3/5 bg-card">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3 pr-8 leading-tight">{movie.title}</h2>
              <div className="flex items-center text-primary font-bold text-lg mb-8">
                <Star size={18} className="fill-primary/20 mr-2" strokeWidth={2.5} /> 
                <span className="text-foreground">{rating}</span>
                {movie.release_date && (
                  <>
                    <span className="mx-3 text-muted-foreground/30">•</span>
                    <span className="text-sm font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">{movie.release_date.substring(0, 4)}</span>
                  </>
                )}
              </div>
              
              <div className="mb-10 flex-1">
                <h3 className="text-sm uppercase tracking-widest font-extrabold text-muted-foreground mb-3">Overview</h3>
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed">{movie.overview || "No description available for this movie."}</p>
              </div>

              <div className="mt-auto pt-4 shrink-0">
                <Button 
                  className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/10 hover:shadow-primary/30 rounded-2xl transition-all hover:-translate-y-0.5 bg-primary text-primary-foreground"
                  onClick={() => {
                    navigate(`/movie/${movie.id || movie.movieId}`);
                    setShowModal(false);
                  }}
                >
                  <Info size={20} className="mr-2" strokeWidth={2.5} />
                  View Full Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Moviecard;
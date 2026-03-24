import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "@/components/ui/button";
import { Play, Film, Star, Clock, Activity, DollarSign, TrendingUp, Users, Tv, Compass } from "lucide-react";
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
        
        const trailer = vid.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailerKey(trailer ? trailer.key : null);

        const regionData = prov.IN || prov.US || null;
        setProviders(regionData);

        setCast(cre.cast.slice(0, 10)); 
        setRecommendations(rec.slice(0, 10)); 

      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pt-32">
        <NavBar />
        <div className="container mx-auto px-4 max-w-7xl">
            <Skeleton height={600} borderRadius={32} baseColor="var(--card)" highlightColor="var(--border)" className="opacity-40" />
        </div>
      </div>
    );
  }

  if (!details) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8 text-2xl font-bold tracking-tight">Movie not found.</div>;
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
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans transition-colors duration-500">
      <NavBar />
      
      {/* SaaS Hero Section */}
      <div 
        className="relative w-full lg:h-[85vh] min-h-[700px] flex items-center bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: details.backdrop_path ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})` : 'none' }}
      >
        <div className="absolute inset-0 bg-background/95 lg:bg-gradient-to-r lg:from-background lg:via-background/90 lg:to-background/30 z-0 backdrop-blur-[4px] lg:backdrop-blur-sm transition-all duration-500"></div>
        
        <div className="container mx-auto px-6 sm:px-8 z-10 relative mt-32 lg:mt-16 max-w-[1600px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-center">
            
            {/* Poster Bento */}
            <div className="w-64 sm:w-72 lg:w-[400px] flex-shrink-0 rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl shadow-primary/20 bg-card ring-1 ring-white/10 group relative">
              <img src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "https://via.placeholder.com/500x750/141414/00f3ff?text=No+Poster"} alt={details.title} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            {/* Info Content */}
            <div className="flex-1 flex flex-col py-4 text-center lg:text-left max-w-5xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-4 drop-shadow-lg leading-none">
                {details.title}
              </h1>
              
              {details.tagline && <p className="text-2xl sm:text-3xl text-primary font-medium mb-8 drop-shadow-md opacity-90 tracking-wide italic leading-snug">"{details.tagline}"</p>}
              
              {/* Vitals Ribbon */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-2xl font-bold tracking-wider shadow-sm backdrop-blur-md">
                    <Star size={20} className="fill-current" strokeWidth={2.5} /> 
                    <span className="text-lg">{Number(details.vote_average).toFixed(1)}</span>
                </div>
                
                {details.release_date && (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-secondary/60 text-foreground font-bold rounded-2xl border border-border/50 shadow-sm backdrop-blur-md text-lg">
                        {details.release_date.substring(0, 4)}
                    </div>
                )}

                <div className="flex items-center gap-2 px-5 py-2.5 bg-secondary/60 text-muted-foreground hover:text-foreground font-bold rounded-2xl border border-border/50 shadow-sm backdrop-blur-md transition-colors">
                    <Clock size={18} strokeWidth={2.5} /> {formatRuntime(details.runtime)}
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-secondary/60 text-muted-foreground hover:text-foreground font-bold rounded-2xl border border-border/50 shadow-sm backdrop-blur-md uppercase tracking-wider text-sm transition-colors">
                    <Activity size={18} strokeWidth={2.5} /> {details.status}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                {details.genres.map(g => (
                  <span key={g.id} className="px-5 py-2 text-sm font-bold tracking-wide border border-border/40 rounded-full bg-background/60 backdrop-blur-xl text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all shadow-sm cursor-default">
                    {g.name}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Button 
                  size="lg" 
                  className="rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all w-full sm:w-auto border border-primary/20 bg-primary/95 text-primary-foreground hover:bg-primary group"
                  onClick={() => {
                      if (!localStorage.getItem("token")) {
                          import('react-hot-toast').then(m => m.default.error("Login to access the movie"));
                      } else {
                          navigate(`/watch/${id}`);
                      }
                  }}
                >
                  <Play size={22} strokeWidth={3} className="mr-3 fill-current group-hover:scale-110 transition-transform" /> Watch It Now
                </Button>
                {trailerKey && (
                  <Button 
                    variant="outline"
                    size="lg"
                    className="rounded-full px-10 h-16 text-lg font-bold bg-background/40 backdrop-blur-xl border-white/20 hover:border-border hover:bg-secondary w-full sm:w-auto hover:-translate-y-1 transition-all text-white hover:text-foreground group"
                    onClick={() => {
                      document.getElementById('trailer-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Film size={22} className="mr-3 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={2.5} /> View Trailer
                  </Button>
                )}
              </div>
              
              <div className="mb-8 bg-card/60 p-8 rounded-[2rem] backdrop-blur-xl border border-border/50 shadow-xl max-w-4xl">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Compass size={18} className="text-primary" /> Storyline Overview
                </h3>
                <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-medium">{details.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Below Hero - Bento Grid */}
      <div className="container mx-auto px-4 sm:px-8 mt-16 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            
            {/* Left Column (Span 2) - Trailer & Cast */}
            <div className="lg:col-span-2 space-y-8 xl:space-y-12">
                
                {/* Official Trailer Bento Box */}
                {trailerKey && (
                  <div id="trailer-section" className="scroll-mt-32 bg-card/40 border border-border/50 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Film className="text-primary" size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Official Trailer</h2>
                    </div>
                    <div className="w-full aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-inner bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                        title="YouTube video player"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Top Billed Cast Bento Box */}
                {cast.length > 0 && (
                  <div className="bg-card/40 border border-border/50 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center border border-border/40 shadow-inner">
                            <Users className="text-muted-foreground" size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Top Billed Cast</h2>
                    </div>
                    <div className="flex overflow-x-auto gap-6 pb-8 pt-2 px-2 scrollbar-hide snap-x -mx-2">
                      {cast.map(person => (
                        <div key={person.cast_id} className="min-w-[160px] sm:min-w-[180px] max-w-[180px] bg-card rounded-[2rem] border border-border/60 overflow-hidden shadow-lg flex-shrink-0 snap-center hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col group cursor-crosshair">
                          <img 
                            src={person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : 'https://via.placeholder.com/200x300/141414/ffffff?text=No+Image'} 
                            alt={person.name} 
                            className="w-full h-[220px] sm:h-[260px] object-cover bg-secondary group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="p-5 flex-1 flex flex-col items-center text-center bg-card z-10 relative">
                            <h4 className="font-extrabold text-base sm:text-lg text-foreground leading-tight mb-1.5">{person.name}</h4>
                            <p className="text-xs sm:text-sm text-primary font-bold line-clamp-2">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

            </div>
            
            {/* Right Column (Span 1) - Providers & Stats */}
            <div className="space-y-8 xl:space-y-12">
                
                {/* Financial/Meta Stats Bento */}
                {(details.budget > 0 || details.revenue > 0) && (
                    <div className="bg-card/40 border border-border/50 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight mb-8">Box Office</h3>
                        <div className="flex flex-col gap-6">
                            {details.budget > 0 && (
                                <div className="flex items-center gap-5 p-5 bg-card rounded-2xl border border-border/60 shadow-sm relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5">
                                        <DollarSign size={100} />
                                    </div>
                                    <div className="h-14 w-14 rounded-full bg-secondary text-muted-foreground flex items-center justify-center border border-border/40 shrink-0">
                                        <DollarSign size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="z-10">
                                        <span className="text-muted-foreground block text-xs font-extrabold tracking-widest uppercase mb-1">Production Budget</span>
                                        <span className="font-extrabold text-foreground text-2xl">{formatCurrency(details.budget)}</span>
                                    </div>
                                </div>
                            )}
                            {details.revenue > 0 && (
                                <div className="flex items-center gap-5 p-5 bg-card/80 rounded-2xl border border-primary/20 shadow-md relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 text-primary">
                                        <TrendingUp size={100} />
                                    </div>
                                    <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shrink-0 group-hover:scale-110 transition-transform">
                                        <TrendingUp size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="z-10">
                                        <span className="text-primary/80 block text-xs font-extrabold tracking-widest uppercase mb-1">Worldwide Revenue</span>
                                        <span className="font-extrabold text-foreground text-2xl">{formatCurrency(details.revenue)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Streaming Providers Bento Box */}
                {providers && (providers.flatrate || providers.rent || providers.buy) && (
                  <div className="bg-card/40 border border-border/50 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <Tv className="text-foreground" size={28} strokeWidth={2.5} />
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Stream Access</h2>
                    </div>
                    <div className="flex flex-wrap gap-5">
                      {['flatrate', 'rent', 'buy'].map((type) => (
                        providers[type]?.map(provider => (
                          <div key={provider.provider_id + type} className="group relative flex flex-col items-center">
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`} 
                              alt={provider.provider_name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md border border-border/60 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300"
                            />
                            <span className="absolute -top-12 scale-0 group-hover:scale-100 transition-all duration-200 bg-popover text-popover-foreground text-xs font-bold px-3 py-1.5 rounded-lg border border-border shadow-2xl whitespace-nowrap z-20">
                              {provider.provider_name} <span className="text-primary italic ml-1">({type})</span>
                            </span>
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* Full-width Recommendations Row Below Bento Grid */}
        {recommendations.length > 0 && (
          <div className="pb-16 mt-16 border-t border-border/40 pt-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-10 tracking-tight flex items-center gap-3">
                <Star className="text-yellow-500 fill-yellow-500/20" size={32} /> 
                Recommended For You
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 scrollbar-hide snap-x -mx-4">
              {recommendations.map(movie => (
                <div 
                  key={movie.id} 
                  className="min-w-[180px] sm:min-w-[220px] max-w-[220px] flex-shrink-0 snap-center rounded-[2rem] overflow-hidden border border-border/50 shadow-md hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-500 cursor-pointer bg-card group"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  title={movie.title}
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MovieDetails;

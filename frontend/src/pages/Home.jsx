import Moviecard from "../components/Moviecard"
import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getSearchMovie, getPopularMovie, getGenreMovie } from "../services/api";
import NavBar from "../components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Popcorn, Star, Compass, AlertCircle, ChevronLeft, ChevronRight, SearchX } from "lucide-react";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [genreQuery, setGenreQuey] = useState(null);
    const [movies, setMovies] = useState([]);
    const [err, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentMode, setCurrentMode] = useState("popular");

    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        if (hoveredMovie || movies.length === 0) return;
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % Math.min(movies.length, 10));
        }, 5000);
        return () => clearInterval(interval);
    }, [hoveredMovie, movies]);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                let data;
                if (currentMode === "popular") {
                    data = await getPopularMovie(page);
                } else if (currentMode === "genre" && genreQuery !== null) {
                    data = await getGenreMovie(genreQuery, page);
                } else if (currentMode === "search" && submittedSearch.trim() !== "") {
                    data = await getSearchMovie(submittedSearch, page);
                }

                if (data) {
                    setMovies(data.results);
                    setTotalPages(data.totalPages || 1);
                    setError(null);
                }
            } catch (err) {
                console.log(err);
                setError("Failed to load movies....");
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, currentMode, genreQuery, submittedSearch]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                setSubmittedSearch(searchQuery);
                setCurrentMode("search");
                setPage(1);
            } else {
                if (currentMode === "search") {
                    setCurrentMode("popular");
                    setSubmittedSearch("");
                    setPage(1);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, currentMode]);

    const genres = [
        { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 16, name: 'Animation' },
        { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }, { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
        { id: 9648, name: 'Mystery' }, { id: 10402, name: 'Music' }, { id: 37, name: 'Western' },
        { id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
        { id: 10752, name: 'War' }, { id: 36, name: 'History' },
    ];

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setSubmittedSearch(searchQuery);
        setCurrentMode("search");
        setPage(1);
    };

    const handleGenreClick = (e, id) => {
        e.preventDefault();
        setGenreQuey(id);
        setCurrentMode("genre");
        setPage(1);
    };

    const activeBgMovie = hoveredMovie || movies[bgIndex];
    const bgUrl = activeBgMovie ? `https://image.tmdb.org/t/p/original${activeBgMovie.backdrop_path || activeBgMovie.poster_path}` : "";

    return (
        <div className="relative min-h-screen font-sans text-foreground bg-background transition-colors duration-500 bg-cover bg-center bg-fixed" style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
        }}>
            <div className="fixed inset-0 bg-background/90 backdrop-blur-[2px] z-0 transition-opacity duration-700"></div>

            <div className="relative z-10 w-full flex flex-col min-h-screen pt-32 pb-24">
                <NavBar />
                
                {/* Hero Search Section - Massive padding, airy bento feel */}
                <div className="container mx-auto px-4 sm:px-8 mb-16 flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 drop-shadow-sm">
                        Find your next <span className="text-primary italic pr-2">obsession.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium">
                        Explore thousands of cinematic experiences, discover new genres, and curate your perfect watchlist.
                    </p>
                    <form onSubmit={handleSearch} className="flex w-full max-w-3xl items-center gap-3 sm:gap-4 group transform transition-all duration-500 hover:scale-[1.01] focus-within:scale-[1.02]">
                        <div className="relative flex-1">
                            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                                <Search size={26} strokeWidth={2.5} />
                            </div>
                            <Input 
                                type="text" 
                                placeholder="Search moving pictures..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full h-14 sm:h-16 pl-14 sm:pl-16 pr-6 bg-card/85 backdrop-blur-3xl border-border/80 focus-visible:ring-primary focus-visible:ring-2 rounded-full text-lg sm:text-xl font-semibold tracking-tight placeholder:text-muted-foreground/60 text-foreground shadow-lg hover:shadow-primary/20 transition-all focus-visible:bg-card"
                            />
                        </div>
                        <Button type="submit" className="h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/40 font-extrabold text-lg sm:text-xl hover:-translate-y-0.5 active:scale-95 transition-all shrink-0">
                            Explore
                        </Button>
                    </form>
                </div>

                <div className="container mx-auto flex flex-col xl:flex-row gap-12 px-4 sm:px-8 flex-1 w-full max-w-[1600px]">
                    
                    {/* Left Sidebar / Bento Genres */}
                    <div className="xl:w-72 flex-shrink-0">
                        <div className="sticky top-32 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
                                <Compass className="text-primary" size={24} strokeWidth={2.5} />
                                <h2 className="text-xl font-extrabold tracking-tight text-foreground">Explore</h2>
                            </div>
                            
                            <div className="flex flex-wrap xl:flex-col gap-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setGenreQuey(null);
                                        setSearchQuery("");
                                        setSubmittedSearch("");
                                        setCurrentMode("popular");
                                        setPage(1);
                                    }}
                                    className={`flex items-center gap-3 text-left px-5 py-3.5 rounded-2xl font-bold transition-all ${currentMode === "popular" ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                                >
                                    <Star size={18} strokeWidth={2.5} className={currentMode === "popular" ? "" : "text-yellow-500"} />
                                    Popular Center
                                </button>
                                
                                <div className="w-full h-px bg-border/40 my-2 hidden xl:block"></div>
                                
                                {genres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        onClick={(e) => handleGenreClick(e, genre.id)}
                                        className={`text-left px-5 py-3 rounded-2xl font-semibold transition-all text-sm ${currentMode === "genre" && genreQuery === genre.id ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Movie List Canvas - High padding, responsive grids */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center tracking-tight">
                                {genreQuery === null ? "Trending Globally" : `Top in ${genres.find(g => g.id === genreQuery)?.name}`}
                            </h2>
                            <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 hidden sm:inline-block">
                                Page {page} of {totalPages}
                            </span>
                        </div>
                        
                        {err && (
                            <div className="flex items-start gap-4 text-destructive bg-destructive/10 p-6 rounded-3xl mb-10 border border-destructive/20 shadow-sm">
                                <AlertCircle size={24} className="shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Error Loading Content</h3>
                                    <p className="text-destructive/80 font-medium">{err}</p>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                                {Array(10).fill().map((_, index) => (
                                    <div key={index} className="aspect-[2/3] w-full bg-card/40 rounded-3xl overflow-hidden border border-border/30 shadow-sm">
                                        <Skeleton height="100%" baseColor="var(--card)" highlightColor="var(--border)" className="opacity-40" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 min-h-[400px]">
                                {movies.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center p-16 bg-card/40 rounded-3xl border border-border/50 backdrop-blur-xl shadow-sm mt-4 text-center">
                                        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-inner">
                                            <SearchX size={40} className="text-muted-foreground" strokeWidth={2} />
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">No Matches Found</h2>
                                        <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">We couldn't track down any movies matching your search. Try different keywords.</p>
                                    </div>
                                ) : (
                                    movies.map((movie) => (
                                        <div
                                            key={movie.id || movie.movieId}
                                            onMouseEnter={() => setHoveredMovie(movie)}
                                            onMouseLeave={() => setHoveredMovie(null)}
                                        >
                                            <Moviecard movie={movie} />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Pagination Bento Pill */}
                        {!loading && movies.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-6 mt-16 bg-card/60 p-3 rounded-full backdrop-blur-xl border border-border/50 w-max mx-auto shadow-2xl">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-full h-12 w-12 p-0 bg-background border border-border hover:bg-secondary text-foreground flex items-center justify-center"
                                >
                                    <ChevronLeft size={24} />
                                </Button>
                                
                                <span className="text-foreground font-bold text-lg px-2">
                                    {page} <span className="text-muted-foreground mx-1">/</span> {totalPages}
                                </span>
                                
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage(p => p < totalPages ? p + 1 : p)}
                                    disabled={page === totalPages}
                                    className="rounded-full h-12 w-12 p-0 bg-background border border-border hover:bg-secondary text-foreground flex items-center justify-center"
                                >
                                    <ChevronRight size={24} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home
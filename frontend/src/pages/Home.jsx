import Moviecard from "../components/Moviecard"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getSearchMovie, getPopularMovie, getGenreMovie } from "../services/api";
import NavBar from "../components/NavBar";
import "../css/home.css"
import "../css/NavBar.css"

function Home() {

    const [searchQuery, setSearchQuery] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [genreQuery, setGenreQuey] = useState(null);
    const [movies, setMovies] = useState([]);
    const [err, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pagination and Mode state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentMode, setCurrentMode] = useState("popular"); // 'popular', 'genre', 'search'

    // Dynamic Background State
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);

    // Background Rotation Effect
    useEffect(() => {
        if (hoveredMovie || movies.length === 0) return;
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % Math.min(movies.length, 10)); // Rotate through top 10
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
    }, [page, currentMode, genreQuery, submittedSearch]);

    // Live search debounce
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
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, currentMode]);

    const genres = [
        { id: 12, name: 'Adventure' },
        { id: 14, name: 'Fantasy' },
        { id: 16, name: 'Animation' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Horror' },
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 9648, name: 'Mystery' },
        { id: 10402, name: 'Music' },
        { id: 37, name: 'Western' },
        { id: 53, name: 'Thriller' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 10752, name: 'War' },
        { id: 36, name: 'History' },
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

    // Calculate Background
    const activeBgMovie = hoveredMovie || movies[bgIndex];
    const bgUrl = activeBgMovie ? `https://image.tmdb.org/t/p/original${activeBgMovie.backdrop_path || activeBgMovie.poster_path}` : "";

    return (

        <div className="home" style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            transition: 'background-image 0.5s ease-in-out'
        }}>
            <div className="home-bg-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.70)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <NavBar />
                <div className="search-container" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <form onSubmit={handleSearch} className="search-form" style={{ width: '100%', maxWidth: '600px', display: 'flex' }}>
                        <input type="text" placeholder="Search any Movies..." className="search-input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" className="search-button" style={{ padding: '10px 20px', borderRadius: '0 5px 5px 0', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>🔍︎</button>
                    </form>
                </div>
                <div className="fullmovie-list">
                    <div className="Genre-list">
                        <h2 className="sidebar-title">Genre</h2>
                        <div className="genres">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setGenreQuey(null);
                                    setSearchQuery("");
                                    setSubmittedSearch("");
                                    setCurrentMode("popular");
                                    setPage(1);
                                }}
                                style={{
                                    color: currentMode === "popular" ? '#fff' : '',
                                    borderLeft: currentMode === "popular" ? '4px solid #00f3ff' : '',
                                    backgroundColor: currentMode === "popular" ? 'rgba(255,255,255,0.1)' : '',
                                    paddingLeft: currentMode === "popular" ? '1rem' : ''
                                }}
                            >
                                🌟 Popular Movies
                            </a>
                            {genres.map((genre) => (
                                <a
                                    href="#"
                                    key={genre.id}
                                    onClick={(e) => handleGenreClick(e, genre.id)}
                                    style={{
                                        color: currentMode === "genre" && genreQuery === genre.id ? '#fff' : '',
                                        borderLeft: currentMode === "genre" && genreQuery === genre.id ? '4px solid #00f3ff' : '',
                                        backgroundColor: currentMode === "genre" && genreQuery === genre.id ? 'rgba(255,255,255,0.1)' : '',
                                        paddingLeft: currentMode === "genre" && genreQuery === genre.id ? '1rem' : ''
                                    }}
                                >
                                    {genre.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="movie-list">
                        <h1>{genreQuery === null ? "Popular Movies" : `All ${genres.find(g => g.id === genreQuery)?.name} Movies`}</h1>
                        {err && <div className="error-msg">{err}</div>}

                        {loading ? (
                            <div className="movie-grid">
                                {Array(8)
                                    .fill()
                                    .map((_, index) => (
                                        // FIX: Added the key prop here
                                        <Skeleton key={index} height={300} borderRadius={10} baseColor="#243624ff" />
                                    ))}
                            </div>) :
                            (<div className="movie-grid" style={{ minHeight: '300px' }}>
                                {movies.length == 0 ? (
                                    <div className="no-data" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: 'rgba(20,20,20,0.8)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                                        <div style={{ fontSize: '4rem', margin: '0 0 10px 0' }}>🍿🤔</div>
                                        <h2 style={{ color: '#00f3ff', margin: '0 0 10px 0' }}>No Movies Found!</h2>
                                        <p style={{ color: '#888', margin: 0 }}>We couldn't find any films matching your search.<br />Try another keyword.</p>
                                    </div>
                                ) : (
                                    movies.map((movie) => (
                                        <div
                                            key={movie.id}
                                            onMouseEnter={() => setHoveredMovie(movie)}
                                            onMouseLeave={() => setHoveredMovie(null)}
                                            style={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Moviecard movie={movie} />
                                        </div>
                                    )))}
                            </div>)
                        }

                        {/* Pagination Controls */}
                        {!loading && movies.length > 0 && totalPages > 1 && (
                            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ padding: '10px 20px', cursor: page === 1 ? 'not-allowed' : 'pointer', background: 'transparent', color: '#00f3ff', border: '1px solid #00f3ff', borderRadius: '5px', fontWeight: 'bold' }}
                                >
                                    Previous
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#fff' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => p < totalPages ? p + 1 : p)}
                                    disabled={page === totalPages}
                                    style={{ padding: '10px 20px', cursor: page === totalPages ? 'not-allowed' : 'pointer', background: 'transparent', color: '#00f3ff', border: '1px solid #00f3ff', borderRadius: '5px', fontWeight: 'bold' }}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>

    )
}
export default Home
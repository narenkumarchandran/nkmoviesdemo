import "../css/favorites.css";
import { useMovieContext } from "../context/MovieContext";
import Moviecard from "../components/Moviecard";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites.length !== 0) {
    return (
      <div className="favorites">
        <NavBar />
        <h2>Your Favorites</h2>
        <div className="movie-grid1">
          {favorites.map((movie) => (
            <Moviecard movie={movie} key={movie.movieId || movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <Link to="/" className="back">
        Back to home...
      </Link>
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding Movies to your favorites and they will appear here</p>
    </div>
  );
}

export default Favorites;

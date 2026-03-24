import { useMovieContext } from "../context/MovieContext";
import Moviecard from "../components/Moviecard";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartOff, Heart } from "lucide-react";

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites.length !== 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-500 pt-32 pb-24">
        <NavBar />
        <div className="container mx-auto px-4 sm:px-8 flex-1 w-full max-w-[1600px]">
          <div className="flex items-center gap-5 mb-12 pb-8 border-b border-border/40">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                <Heart size={28} className="text-primary fill-primary/20" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight drop-shadow-sm">Your Favorites</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
            {favorites.map((movie) => (
              <Moviecard movie={movie} key={movie.movieId || movie.id} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pt-32 pb-24">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-12 sm:p-24 text-center bg-card/60 mx-4 my-auto rounded-[3rem] border border-border/50 shadow-2xl backdrop-blur-2xl max-w-4xl self-center w-full relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-background flex items-center justify-center mb-10 shadow-lg border border-border/50">
                <HeartOff size={56} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 tracking-tight drop-shadow-sm">No Collection Built</h2>
            <p className="text-muted-foreground mb-12 text-xl max-w-2xl font-medium leading-relaxed">
              Your digital vault is currently empty. Start exploring our massive library and curate your own list of premium entertainment to appear here.
            </p>
            <Link to="/">
            <Button size="lg" className="rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all text-lg px-12 h-16 font-bold tracking-wide border border-primary/20 bg-primary/95 text-primary-foreground hover:bg-primary">
                Return to Library
            </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Favorites;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { ArrowLeft, AlertCircle } from 'lucide-react';

function WatchMovie() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 flex flex-col pt-32 pb-12">
            <NavBar />
            
            <div className="container mx-auto flex-1 flex flex-col p-4 sm:p-8 lg:p-12 max-w-7xl">
                <div className="mb-10 flex items-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground font-bold text-lg shadow-sm hover:shadow-md transition-all border border-border/40 backdrop-blur-xl"
                    >
                        <ArrowLeft className="w-5 h-5 mr-3" strokeWidth={2.5} />
                        Back to Library
                    </Link>
                </div>

                {/* Cinematic Player Bento Box */}
                <div className="relative w-full mx-auto aspect-video shadow-2xl rounded-[2rem] overflow-hidden border border-border/40 bg-black flex-shrink-0 group ring-1 ring-white/5">
                    <iframe 
                        src={`https://www.vidking.net/embed/movie/${id}?color=e50914&autoPlay=true`} 
                        title="Vidking Movie Player"
                        className="w-full h-full absolute inset-0 z-10"
                        frameBorder="0" 
                        allow="autoplay; fullscreen" 
                        allowFullScreen
                    ></iframe>
                    
                    {/* Glowing effect behind the player for SaaS feel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[120px] rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                </div>
                
                {/* Status Box Bento */}
                <div className="mt-12 max-w-3xl mx-auto flex items-start gap-5 p-6 sm:p-8 bg-card/60 rounded-3xl border border-destructive/20 backdrop-blur-xl shadow-lg">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 border border-destructive/20 shadow-inner">
                        <AlertCircle className="text-destructive w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="pt-1">
                        <h4 className="font-extrabold text-lg text-foreground mb-2 tracking-tight">Stream Availability Notice</h4>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base leading-relaxed">
                            If the video fails to load or returns an error, this title might be restricted in your region or not yet indexed on external streaming servers. <span className="text-primary cursor-pointer hover:underline font-bold ml-1 transition-all">Report Issue</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchMovie;

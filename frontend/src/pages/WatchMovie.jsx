import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

function WatchMovie() {
    const { id } = useParams();

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
            <NavBar />
            
            <div style={{ padding: '20px 40px' }}>
                <Link 
                    to="/" 
                    style={{ 
                        display: 'inline-block', 
                        marginBottom: '20px', 
                        color: '#00f3ff', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}
                >
                    ← Back to Movies
                </Link>

                <div 
                    style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '1200px', 
                        margin: '0 auto', 
                        aspectRatio: '16/9',
                        boxShadow: '0 0 30px #00f3ff',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}
                >
                    <iframe 
                        src={`https://www.vidking.net/embed/movie/${id}?autoPlay=true`} 
                        title="Vidking Movie Player"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allow="autoplay; fullscreen" 
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    ></iframe>
                </div>
                
                <p style={{ marginTop: '15px', color: '#888', fontStyle: 'italic', textAlign: 'center', fontSize: '0.9rem' }}>
                    If the video does not load or returns an error, this title may be too obscure or not yet available on our streaming servers.
                </p>
            </div>
        </div>
    );
}

export default WatchMovie;

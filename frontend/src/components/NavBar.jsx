import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css"; // Ensure your CSS path is correct

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token"); // Check if user is logged in
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Delete the token
    localStorage.removeItem("username"); // Delete the username
    navigate("/login"); // Send them back to the login page
    window.location.reload(); // Refresh to clear the context state
  };

  return (
    <header className="navbar">
      <div className="left-content">
        <Link to="/">🎬NkMovies</Link>
      </div>
      
      {/* You can move your search bar here if you want it globally, 
          or leave it in Home.js */}

      <div className="right-content">
        {(!token || location.pathname !== "/") && <Link to="/">Home</Link>}
        {token && <span className="welcome-msg">Welcome, {username}</span>}
        {token && <Link to="/favorites">Favorites</Link>}
        
        {/* Conditionally render Login or Logout */}
        {token ? (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </header>
  );
}

export default NavBar;
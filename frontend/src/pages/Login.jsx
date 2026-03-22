import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api'; 
import '../css/login.css'; 

function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = { username, password };
      const { data } = await login(formData); 
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      
      // FIX: Hard redirect so the context remounts and fetches data
      window.location.href = '/'; 

    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
        const formData = { username, password };
        const { data } = await register(formData); 

        alert(data.msg || 'Registration successful! Please log in.');

    } catch (err) {
        const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Registration error:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome to NkMovies</h2>
        <p>Login or Register to continue</p>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button onClick={handleRegister} disabled={loading} className="register-btn">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
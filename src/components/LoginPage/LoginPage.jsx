import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleLogin = () => {
    const apiUrl = 'https://localhost:7091/api/user/login';

    const requestData = {
      userName: username,
      password: password,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          setError('Invalid credentials');
        } else {
          throw new Error('Login failed');
        }
      })
      .then((data) => {
        login(data.token);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  return (
    <div className="loginPageContainer">
        <div className="login_form">
          <h2 className="login">Login</h2>
          <form className="loginForm">
            <label className="loginLabel">
              Username:
              <input
                className="loginInput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <br />
            <label className="loginLabel">
              Password:
              <input
                className="loginInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <div className="error">{error}</div>}
            <br />
            <button className="loginButton" type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
    </div>
  );
};

export default LoginPage;

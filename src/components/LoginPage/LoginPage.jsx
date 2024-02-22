import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          navigate('/dashboard');
        } else if (response.status === 401) {
          setError('Invalid credentials');
        } else {
          throw new Error('Login failed');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  return (
    <div className="loginPageContainer">
        <div className="login_form">
          <h2 className="login">Login</h2>
          <form class="loginForm">
            <label class="loginLabel">
              Username:
              <input
                class="loginInput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <br />
            <label class="loginLabel">
              Password:
              <input
                class="loginInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <div class="error">{error}</div>}
            <br />
            <button class="loginButton" type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
        navigate('/dashboard');
        }
    }, [token, navigate]);

    const loginUser = async (username, password) => {
        const apiUrl = 'https://localhost:7091/api/user/login';
        const requestData = {
        userName: username,
        password: password,
        };

        try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            throw new Error('Invalid credentials');
        } else {
            throw new Error('Login failed');
        }
        } catch (error) {
        throw error;
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const data = await loginUser(username, password);
            login(data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
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
            {error && <div className="error">Incorrect username or password.</div>}
            <br />
            <button
                className="loginButton"
                type="button"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>
        </div>
        </div>
    );
};

export default LoginPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';
import { useProjectContext } from './Context';

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { setCurrentUser, setCurrentUserRole } = useProjectContext();
    const { login, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const loginUser = async (username: string, password: string): Promise<{ token: string, user: string, role: string }> => {
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

    const handleLogin = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await loginUser(username, password);
            login(data.token);
            setCurrentUser(data.user);
            setCurrentUserRole(data.role);
            navigate('/dashboard');
        } catch (error:any) {
            setError(error.message);
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission on Enter key
            handleLogin();
        }
    };

    return (
        <div className="loginPageContainer">
            <div className="login_form">
                <h2 className="login">Login</h2>
                <form className="loginForm" onKeyDown={handleKeyDown}>
                    <label className="loginLabel">
                        Username:
                        <input
                            className="loginInput"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={error ? { border: '1px solid red' } : { border: '1px solid black' }}
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
                            style={error ? { border: '1px solid red' } : { border: '1px solid black' }}
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

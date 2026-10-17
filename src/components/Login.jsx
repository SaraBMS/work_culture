
// Origin Login:

import React,{useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import loginImg from '../assets/images/login.png';
import api from '../api/SignUpAPI.js';
import './login.css';
import Transition from '../Transition';
import PasswordLogin from './PasswordLogin';
import { useEmail, useAuth, useRole } from '../hook/EmailProvider.js';
import {login} from '../api/auth.js';

const Login = () => {
    const { email, setEmail, check, setCheck, password, setPassword, setName, setAgency } = useEmail();
    const { setAuthToken, setUser } = useAuth(); // Access context functions for authentication and role
    const { setRole } = useRole();
    const navigate = useNavigate(); // For navigation after login
    const location = useLocation();
    const [loginError, setLoginError] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

 // Update document title based on the current path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/login') {
            document.title = "Work Culture | Login";
        } else {
            document.title = "Work Culture";
        }
    }, [location.pathname]);

    const handleCheckbox = () => {
        setCheck(!check);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginStatus('');

        try {
            const response = await api.get('/SignUpAPI');
            const users = Array.isArray(response.data) ? response.data : [];
            const normalizedEmail = email.trim().toLowerCase();
            const matchedUser = users.find((user) => (
                String(user.email || '').toLowerCase() === normalizedEmail
                && String(user.password || '') === password
            ));

            if (!matchedUser) {
                setLoginError('Login failed. Check the email and password, then try again.');
                return;
            }

            const token = await login(normalizedEmail, password);
            const detectedRole = matchedUser.role || (normalizedEmail.includes('admin') ? 'admin' : 'user');
            const currentUser = { ...matchedUser, role: detectedRole };

            localStorage.setItem('token', token);
            localStorage.setItem('workCultureUser', JSON.stringify(currentUser));

            setAuthToken(token);
            setUser(currentUser);
            setRole(detectedRole);
            setName(currentUser.name || '');
            setEmail(currentUser.email || email);
            setAgency(currentUser.selectedOption2 || '');
            setLoginStatus('Login successful. Redirecting now...');
            resetForm();
            navigate(detectedRole === 'admin' ? '/admin/control-panel' : '/admin/home');
        } catch (err) {
            setLoginError(`Login failed: ${err.message}`);
        }
    };

    const resetForm = () => {
        setPassword('');
        setCheck(false);
    };

    return (
        <div className='log__container' id='login'>
            <div className="log__container-image">
                <img src={loginImg} alt="illustration" />
            </div>
            <div className="log__container-content">
                <div className="log__container-content-header">
                    <img src={logo} alt="logo" />
                    <h1>Login</h1>
                </div>
                <div className="log__container-content-inputs">
                    <form onSubmit={handleSubmit}>
                        <div className='auth_hint_card'>
                            <p><strong>Admin demo:</strong> <code>admin@admin.com</code> / <code>admin99999</code></p>
                            <p><strong>User demo:</strong> <code>maya@business.com</code> / <code>Password123</code></p>
                        </div>
                        {loginError && <div className='auth_status auth_status-error'>{loginError}</div>}
                        {loginStatus && <div className='auth_status auth_status-success'>{loginStatus}</div>}
                        <label htmlFor="email" className='log_label'>Email Address</label>
                        <input
                            className='log_input'
                            type="email"
                            id="email"
                            required
                            placeholder='Email Address (admin@admin.com)'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordLogin />
                        <div className='log__container-content-forget_password'>
                            <label htmlFor="check" className='cl-checkbox'>
                                <input
                                    type="checkbox"
                                    id="check"
                                    checked={check}
                                    onChange={handleCheckbox}
                                />
                                <span></span>
                                Remember me
                            </label>
                            <Link to="/forgetpassword">
                                <span className='forget_link'>Forget Password</span>
                            </Link>
                        </div>
                        <button type="submit" className='button'>
                            Log In
                        </button>
                        <div className="log__container-content-account_create">
                            Don't have an account yet?
                            <Link to="/signup">
                                <span>Create account</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transition(Login);

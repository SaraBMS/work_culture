import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import signUp from '../assets/images/Signup.png';
import PasswordInput from './PasswordInput';
import './signup.css';
import Transition from '../Transition';
import profile_pic from '../assets/images/profile_pic.svg';
import Select from './Select.jsx';
import { useImage } from '../hook/EmailProvider.js';
import { useEmail } from '../hook/EmailProvider.js';

const SignUp = () => {
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfiError, setPasswordConfiError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitStatus, setSubmitStatus] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        name, setName, email, setEmail, password, passwordConf, setPasswordConf, setPassword,
        currentStep, setCurrentStep, selectedOption1,
        selectedOption2, selectedOption3, handleSubmit 
    } = useEmail();
    const { image, inputRef, handleImageClick, handleImageChange } = useImage();
    
    // Document title based on path name 
    useEffect(() => {
        const path = location.pathname;
        if (path === '/signup') {
            document.title = "Work Culture | Sign up";
        } else {
            document.title = "Work Culture";
        }
    }, [location.pathname]);

    const handleNextClick = () => {
        let valid = true;
    
        // Validate full name
        if (name.trim() === '') {
            setNameError('Full name is required');
            valid = false;
        } else {
            setNameError('');
        }
    
        // Validate email
        if (email.trim() === '') {
            setEmailError('Email is required');
            valid = false;
        } else if (!email.includes('@')) {
            setEmailError('Email is not valid');
            valid = false;
        } else {
            setEmailError('');
        }
    
        // Validate password and password confirmation
        if (password.trim() === '' || passwordConf.trim() === '') {
            setPasswordError('Password is required');
            setPasswordConfiError('Password confirmation is required');
            valid = false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            valid = false;
        } else if (password !== passwordConf) {
            setPasswordConfiError('Passwords must match');
            valid = false;
        } else {
            setPasswordError('');
            setPasswordConfiError('');
        }

        if (valid) {
            setCurrentStep(2);
        }
    }

    const handleNextClickTo = () => {
        let valid = true;

        if (!selectedOption1) {
            setError1('Please select an option for BackPoint.');
            valid = false;
        } else {
            setError1('');
        }
    
        if (!selectedOption2) {
            setError2('Please select an option for Agency.');
            valid = false;
        } else {
            setError2('');
        }
    
        if (!selectedOption3) {
            setError3('Please select an option for Interested Agencies.');
            valid = false;
        } else {
            setError3('');
        }

        if (valid) {
            setCurrentStep(3);
        }
    };
    // Progress Bar Click Handling:
    const handleProgressClick = (step) => {
        setCurrentStep(step);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (e.target.value.trim() !== '') {
            setNameError('');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (e.target.value.trim() !== '' || e.target.value.includes('@')) {
            setEmailError('');
        }
    };

    const onSubmit = async (e) => {
        setSubmitError('');
        setSubmitStatus('');
        const result = await handleSubmit(e);

        if (result?.success) {
            setSubmitStatus('Account created successfully. Redirecting now...');
            navigate(result.role === 'admin' ? '/admin/control-panel' : '/admin/home');
        } else if (result?.error) {
            setSubmitError(result.error);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length >= 8) {
            setPasswordError('');
        }
    };

    const handlePasswordConfChange = (e) => {
        setPasswordConf(e.target.value);
        if (e.target.value === password) {
            setPasswordConfiError('');
        }
    };

    return (
        <div className='sign__container' id='signUp'>
            <div className="sign__container-content">
                <div className="sign__container-content-header">
                    <img src={logo} alt="logo" />
                    <h1>Sign Up</h1>
                    <div className="progress-bar">
                        <div
                            className={`progress-dot ${currentStep === 1 ? 'active' : ''}`}
                            onClick={() => handleProgressClick(1)}  // Go to Step 1
                        ></div>
                        <div
                            className={`progress-dot ${currentStep === 2 ? 'active' : ''}`}
                            onClick={() => handleProgressClick(2)}  // Go to Step 2
                        ></div>
                        <div
                            className={`progress-dot ${currentStep === 3 ? 'active' : ''}`}
                            onClick={() => handleProgressClick(3)}  // Go to Step 3
                        ></div>
                    </div>
                </div>

                <div className="sign__container-content-inputs">
                    <form onSubmit={onSubmit} className='signup_form'>
                        {currentStep === 1 && (
                            <>
                                <div className='auth_hint_card'>
                                    <p><strong>New account:</strong> use any new email with <code>@</code>.</p>
                                    <p><strong>Admin rule:</strong> any email containing <code>admin</code> opens the admin panel after signup.</p>
                                </div>
                                {submitError && <div className='auth_status auth_status-error'>{submitError}</div>}
                                {submitStatus && <div className='auth_status auth_status-success'>{submitStatus}</div>}
                                {nameError && <div className="error">{nameError}</div>}
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    required
                                    placeholder='Full Name'
                                    value={name}
                                    onChange={handleNameChange}
                                />

                                {emailError && <div className="error">{emailError}</div>}
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    placeholder='Email Address (admin@new.com or user@new.com)'
                                    value={email}
                                    onChange={handleEmailChange}
                                />

                                {passwordError && <div className="error">{passwordError}</div>}
                                <PasswordInput 
                                    handlePasswordChange={handlePasswordChange}
                                    handlePasswordConfChange={handlePasswordConfChange}
                                />

                                {passwordConfiError && <div className="error error_passwordconfi">{passwordConfiError}</div>}
                               
                                <button 
                                    type="button" 
                                    className='button' 
                                    onClick={handleNextClick}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <Select
                                    error1={error1}
                                    error2={error2}
                                    error3={error3}
                                    setError1={setError1}
                                    setError2={setError2}
                                    setError3={setError3}
                                />
                                <button 
                                    type="button" 
                                    className='button' 
                                    onClick={handleNextClickTo}
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <div className='sign__container-content-header-profile' onClick={handleImageClick}>
                                    <img src={image || profile_pic} alt="your_image" />
                                    <h4>Upload Your Photo</h4>
                                    <label htmlFor="imgUpload">Upload image</label>
                                    <input
                                        id='imgUpload'
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                        ref={inputRef} 
                                    />
                                </div>
                                <button 
                                    onSubmit={handleSubmit}
                                    type="submit" 
                                    className='button' 
                                >
                                    Sign Up
                                </button>
                            </>
                        )}

                        <div className="sign__container-content-account">
                            Already have an account?
                            <Link to="/login">
                                <span>Login</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="sign__container-image">
                <img src={signUp} alt="illustration" />
            </div>
        </div>
    );
};

export default Transition(SignUp);

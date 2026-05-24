import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [userName,setUserName] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const data = {
   username: userName,
   password: password
}

  async function submitHandler(e){
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post("https://notes-api-4ked.onrender.com/auth/login", data)
      console.log(response.data)
      localStorage.setItem("token", response.data.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response.data.message)
      console.error(error)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <rect x="12" y="8" width="24" height="32" rx="5" />
            <line x1="18" y1="16" x2="32" y2="16" />
            <line x1="18" y1="22" x2="32" y2="22" />
            <line x1="18" y1="28" x2="28" y2="28" />
            <line x1="16" y1="12" x2="16" y2="36" />
          </svg>
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your notes and stay focused.</p>

        <form className="login-form" onSubmit={submitHandler}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-with-icon">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M3 5l18 14" />
                    <path d="M2 12s4-6 10-6c2.4 0 4.6.8 6.4 2" />
                    <path d="M22 12s-4 6-10 6c-2.4 0-4.6-.8-6.4-2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-button${loading ? ' is-loading' : ''}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading && <span className="login-spinner" aria-hidden="true" />}
            <span className="login-button__text">{loading ? 'Logging in...' : 'Login'}</span>
          </button>

          {error && (
            <div className="login-error" role="alert">
              <div className="login-error__content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 14.167q.354 0 .593-.24.24-.24.24-.594a.8.8 0 0 0-.24-.593.8.8 0 0 0-.594-.24.8.8 0 0 0-.593.24.8.8 0 0 0-.24.593q0 .354.24.594t.593.24m-.834-3.334h1.667v-5H9.166zm.833 7.5a8.1 8.1 0 0 1-3.25-.656 8.4 8.4 0 0 1-2.645-1.781 8.4 8.4 0 0 1-1.782-2.646A8.1 8.1 0 0 1 1.666 10q0-1.73.656-3.25a8.4 8.4 0 0 1 1.782-2.646 8.4 8.4 0 0 1 2.645-1.781A8.1 8.1 0 0 1 10 1.667q1.73 0 3.25.656a8.4 8.4 0 0 1 2.646 1.781 8.4 8.4 0 0 1 1.781 2.646 8.1 8.1 0 0 1 .657 3.25 8.1 8.1 0 0 1-.657 3.25 8.4 8.4 0 0 1-1.78 2.646 8.4 8.4 0 0 1-2.647 1.781 8.1 8.1 0 0 1-3.25.656" fill="currentColor"/>
                </svg>
                <p className="login-error__message">{error}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss error"
                className="login-error__close"
                onClick={() => setError("")}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5 5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </form>

        <p className="login-footer">
          New here?{' '}
          <Link className="login-register" to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
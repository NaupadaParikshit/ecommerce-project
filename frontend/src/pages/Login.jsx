import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/users/login/`, form)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('username', res.data.username || form.username)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      {/* Animated circles background */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            width: `${(i + 1) * 150}px`,
            height: `${(i + 1) * 150}px`,
            top: `${i * 10}%`,
            left: `${i * 15}%`,
            animation: `float ${3 + i}s ease-in-out infinite alternate`
          }} />
        ))}
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '420px',
        padding: '20px'
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              margin: '0 auto 15px'
            }}>🛒</div>
            <h1 style={{ color: 'white', margin: '0 0 5px', fontSize: '24px', fontWeight: '700' }}>
              Welcome Back!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px' }}>
              Sign in to your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Username
            </label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>

          {/* Register Link */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
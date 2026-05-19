import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
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
      const res = await axios.post(`${API_URL}/api/users/register/`, form)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('username', res.data.username)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      {/* Background circles */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(34, 211, 238, 0.08)',
            width: `${(i + 1) * 120}px`,
            height: `${(i + 1) * 120}px`,
            bottom: `${i * 10}%`,
            right: `${i * 15}%`,
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
              background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              margin: '0 auto 15px'
            }}>✨</div>
            <h1 style={{ color: 'white', margin: '0 0 5px', fontSize: '24px', fontWeight: '700' }}>
              Create Account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px' }}>
              Join us today for free!
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

          {/* Form Fields */}
          {[
            { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '18px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
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
          ))}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'rgba(6,182,212,0.5)' : 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              marginTop: '5px'
            }}>
            {loading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>

          {/* Login Link */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: '600' }}>
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
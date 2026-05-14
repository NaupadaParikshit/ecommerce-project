import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/users/login/', form)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('username', res.data.username || form.username)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={styles.container}>
      <h2>🔐 Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <input style={styles.input} name="username" placeholder="Username" onChange={handleChange} />
      <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button style={styles.button} onClick={handleSubmit}>Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  )
}

const styles = {
  container: { maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', textAlign: 'center' },
  input: { display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red' }
}

export default Login
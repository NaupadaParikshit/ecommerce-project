import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyBookings from './pages/MyBookings'
import API_URL from './config'

function Store({ cart, setCart }) {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  useEffect(() => {
    axios.get(`${API_URL}/api/products/`)
      .then(res => setProducts(res.data))
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div style={{ padding: '20px' }}>
      {/* Navbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px',
        flexWrap: 'wrap', gap: '10px'
      }}>
        <h1>🛒 My E-commerce Store</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {username ? (
            <>
              <span>👋 Hello, {username}!</span>
              <button onClick={() => navigate('/events')}
                style={{ padding: '8px 16px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                🎟️ Events
              </button>
              <button onClick={() => navigate('/my-bookings')}
                style={{ padding: '8px 16px', background: '#00BCD4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                🎫 My Bookings
              </button>
              <button onClick={() => navigate('/orders')}
                style={{ padding: '8px 16px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                📦 My Orders
              </button>
              <button onClick={() => navigate('/cart')}
                style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                🛒 Cart ({cartCount})
              </button>
              <button onClick={handleLogout}
                style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ marginRight: '10px' }}>Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: '1px solid #ccc', borderRadius: '10px',
            padding: '20px', textAlign: 'center'
          }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{product.price}</p>
            <p>{product.in_stock ? '✅ In Stock' : '❌ Out of Stock'}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => setCart([])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
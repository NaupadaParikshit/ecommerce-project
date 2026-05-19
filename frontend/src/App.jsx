import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyBookings from './pages/MyBookings'
import ProductDetail from './pages/ProductDetail'
import API_URL from './config'

function Store({ cart, setCart }) {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  useEffect(() => {
    axios.get(`${API_URL}/api/products/`)
      .then(res => setProducts(res.data))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 30px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: '65px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>🛒</div>
          <span style={{ fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ShopZone
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {username ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>👋 {username}</span>
              <button onClick={() => navigate('/events')} style={navBtn('#7c3aed')}>🎟️ Events</button>
              <button onClick={() => navigate('/my-bookings')} style={navBtn('#0891b2')}>🎫 Bookings</button>
              <button onClick={() => navigate('/cart')} style={{ ...navBtn('#1d4ed8'), position: 'relative' }}>
                🛒 Cart
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ef4444', color: 'white',
                    borderRadius: '50%', width: '20px', height: '20px',
                    fontSize: '11px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                  }}>{cartCount}</span>
                )}
              </button>
              <button onClick={handleLogout} style={navBtn('#dc2626')}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                padding: '8px 20px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px'
              }}>Login</button>
              <button onClick={() => navigate('/register')} style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '8px',
                color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        textAlign: 'center', padding: '80px 20px 60px',
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 70%)'
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px',
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '20px', fontSize: '13px',
          color: '#a78bfa', marginBottom: '20px'
        }}>
          ✨ Shop, Book & Pay — All in One Place
        </div>
        <h1 style={{
          fontSize: '52px', fontWeight: '800', margin: '0 0 20px',
          background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2
        }}>
          Welcome to ShopZone
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '500px', margin: '0 auto 35px' }}>
          Shop products, book event tickets and pay securely — all in one place!
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/events')} style={{
            padding: '14px 30px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>🎟️ Book Tickets</button>
          <button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} style={{
            padding: '14px 30px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px', color: 'white', fontSize: '16px', cursor: 'pointer'
          }}>🛍️ Shop Now</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '40px', padding: '30px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap'
      }}>
        {[
          { icon: '🛍️', value: `${products.length}+`, label: 'Products' },
          { icon: '🎟️', value: '10+', label: 'Events' },
          { icon: '💳', value: '100%', label: 'Secure Pay' },
          { icon: '⚡', value: '24/7', label: 'Available' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#a78bfa' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div id="products" style={{ padding: '60px 30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px' }}>🛍️ Featured Products</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Handpicked items just for you</p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🛍️</div>
            <p style={{ fontSize: '18px' }}>No products yet!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}>

                {/* Product Image */}
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '60px'
                }}>
                  {product.variants && product.variants.length > 0 ? '🎽' : '🛍️'}
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600' }}>
                    {product.name}
                  </h3>
                  {product.variants && product.variants.length > 0 && (
                    <div style={{
                      display: 'inline-block', padding: '3px 10px',
                      background: 'rgba(99,102,241,0.2)',
                      borderRadius: '20px', fontSize: '11px',
                      color: '#a78bfa', marginBottom: '8px'
                    }}>
                      {product.variants.length} variants available
                    </div>
                  )}
                  <p style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: '14px',
                    margin: '0 0 15px', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '700', color: '#a78bfa' }}>
                      ₹{product.price}
                    </span>
                    <span style={{ fontSize: '12px', color: product.in_stock ? '#4ade80' : '#f87171' }}>
                      {product.in_stock ? '● In Stock' : '● Out of Stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{
                      width: '100%', padding: '12px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none', borderRadius: '10px',
                      color: 'white', fontSize: '14px',
                      fontWeight: '600', cursor: 'pointer'
                    }}>
                    {product.variants && product.variants.length > 0 ? 'Select Jersey →' : 'View Product →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events CTA */}
      <div style={{
        margin: '0 auto 60px', maxWidth: '1140px', padding: '0 30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px', padding: '50px 40px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎟️</div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 12px' }}>Book Event Tickets</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 25px', fontSize: '16px' }}>
            IPL matches, Movies and more — book your seats now!
          </p>
          <button onClick={() => navigate('/events')} style={{
            padding: '14px 35px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>Browse Events →</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '30px', textAlign: 'center',
        color: 'rgba(255,255,255,0.3)', fontSize: '14px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛒</div>
        <p style={{ margin: '0 0 5px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>ShopZone</p>
        <p style={{ margin: 0 }}>Built with Django + React ❤️</p>
      </footer>
    </div>
  )
}

function navBtn(bg) {
  return {
    padding: '8px 16px', background: bg,
    border: 'none', borderRadius: '8px',
    color: 'white', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', position: 'relative'
  }
}

function App() {
  const [cart, setCart] = useState([])
  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId))
  const clearCart = () => setCart([])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store cart={cart} setCart={setCart} />} />
        <Route path="/product/:id" element={<ProductDetail setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
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
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function Events() {
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch categories
    axios.get(`${API_URL}/api/tickets/categories/`)
      .then(res => {
        setCategories(res.data)
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].id)
        }
      })
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true)
      axios.get(`${API_URL}/api/tickets/events/category/${selectedCategory}/`)
        .then(res => {
          setEvents(res.data)
          setLoading(false)
        })
    }
  }, [selectedCategory])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🎟️ Book Tickets</h1>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '5px' }}>
          ← Back to Store
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '10px 25px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              background: selectedCategory === cat.id ? '#2196F3' : '#333',
              color: 'white',
              fontWeight: selectedCategory === cat.id ? 'bold' : 'normal'
            }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '20px' }}>No events available!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              style={{
                border: '1px solid #444',
                borderRadius: '15px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                background: '#1a1a1a'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Poster */}
              <div style={{
                height: '200px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px'
              }}>
                {event.category.icon}
              </div>

              {/* Event Info */}
              <div style={{ padding: '15px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{event.name}</h2>
                <p style={{ color: '#888', margin: '4px 0', fontSize: '14px' }}>
                  📍 {event.venue}
                </p>
                <p style={{ color: '#888', margin: '4px 0', fontSize: '14px' }}>
                  📅 {new Date(event.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    From ₹{Math.min(...event.seats.map(s => s.seat_category.price))}
                  </span>
                  <button style={{
                    padding: '8px 15px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
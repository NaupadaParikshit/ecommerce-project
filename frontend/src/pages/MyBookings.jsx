import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API_URL}/api/tickets/bookings/my/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => { setBookings(res.data); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Loading bookings...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', borderRadius: '5px' }}>
        ← Back to Store
      </button>

      <h1>🎟️ My Bookings</h1>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '20px' }}>No bookings yet!</p>
          <button
            onClick={() => navigate('/events')}
            style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Browse Events
          </button>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} style={{
            border: '1px solid #444',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '15px',
            background: '#1a1a1a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>🎟️ {booking.event_name}</h3>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: booking.is_paid ? '#4CAF50' : '#FF9800',
                color: 'white',
                fontSize: '14px'
              }}>
                {booking.is_paid ? '✅ Confirmed' : '⏳ Pending'}
              </span>
            </div>
            <p style={{ color: '#888', margin: '5px 0' }}>
              💺 Seats: {booking.seat_numbers.join(', ')}
            </p>
            <p style={{ color: '#888', margin: '5px 0' }}>
              📅 {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '10px 0 0 0', color: '#4CAF50' }}>
              Total: ₹{parseFloat(booking.total_price).toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default MyBookings
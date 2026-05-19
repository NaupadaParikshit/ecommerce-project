import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import API_URL from '../config'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const token = localStorage.getItem('access')

  useEffect(() => {
    axios.get(`${API_URL}/api/tickets/events/${id}/`)
      .then(res => {
        setEvent(res.data)
        setLoading(false)
      })
  }, [id])

  const toggleSeat = (seat) => {
    if (seat.is_booked) return
    setSelectedSeats(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    )
  }

  const getSeatColor = (seat) => {
    if (seat.is_booked) return '#ff4444'
    if (selectedSeats.find(s => s.id === seat.id)) return '#FFD700'
    return seat.seat_category.color || '#4CAF50'
  }

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + parseFloat(seat.seat_category.price), 0
  )

  const handleBooking = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat!')
      return
    }

    setBooking(true)
    try {
      const res = await axios.post(
        `${API_URL}/api/tickets/bookings/create/`,
        {
          event_id: id,
          seat_ids: selectedSeats.map(s => s.id)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { booking_id, razorpay_order_id, amount, currency, key } = res.data

      const options = {
        key,
        amount,
        currency,
        name: event.name,
        description: `${selectedSeats.length} seat(s) booked`,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_URL}/api/tickets/bookings/verify/`,
              {
                booking_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('🎉 Booking Confirmed!')
            navigate('/my-bookings')
          } catch {
            alert('Payment verification failed!')
          }
        },
        prefill: { name: localStorage.getItem('username') },
        theme: { color: '#2196F3' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed!')
    }
    setBooking(false)
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading event...</p>
  if (!event) return <p style={{ padding: '20px' }}>Event not found!</p>

  // Group seats by row
  const seatsByRow = event.seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = []
    acc[seat.row].push(seat)
    return acc
  }, {})

  // Get unique seat categories
  const seatCategories = [...new Map(
    event.seats.map(s => [s.seat_category.name, s.seat_category])
  ).values()]

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/events')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', borderRadius: '5px' }}>
        ← Back to Events
      </button>

      {/* Event Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>{event.name}</h1>
        <p style={{ margin: '5px 0' }}>📍 {event.venue}</p>
        <p style={{ margin: '5px 0' }}>
          📅 {new Date(event.date).toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric',
            month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
        <p style={{ margin: '5px 0', opacity: 0.9 }}>{event.description}</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {seatCategories.map(cat => (
          <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: cat.color }}></div>
            <span>{cat.name} — ₹{cat.price}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#ff4444' }}></div>
          <span>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#FFD700' }}></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Screen */}
      <div style={{
        textAlign: 'center',
        padding: '10px',
        background: 'linear-gradient(to bottom, #fff, #ccc)',
        borderRadius: '5px',
        marginBottom: '30px',
        color: '#333',
        fontWeight: 'bold',
        letterSpacing: '5px'
      }}>
        🎬 SCREEN / FIELD
      </div>

      {/* Seat Map */}
      <div style={{ marginBottom: '30px' }}>
        {Object.keys(seatsByRow).sort().map(row => (
          <div key={row} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            justifyContent: 'center'
          }}>
            <span style={{ width: '20px', fontWeight: 'bold', color: '#888' }}>{row}</span>
            {seatsByRow[row].sort((a, b) =>
              parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1))
            ).map(seat => (
              <button
                key={seat.id}
                onClick={() => toggleSeat(seat)}
                disabled={seat.is_booked}
                title={`${seat.seat_number} - ${seat.seat_category.name} ₹${seat.seat_category.price}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  background: getSeatColor(seat),
                  cursor: seat.is_booked ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: 'bold',
                  opacity: seat.is_booked ? 0.6 : 1
                }}>
                {seat.seat_number}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          background: '#1a1a1a',
          borderTop: '2px solid #2196F3',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold' }}>
              {selectedSeats.length} Seat(s): {selectedSeats.map(s => s.seat_number).join(', ')}
            </p>
            <p style={{ margin: '0', color: '#4CAF50', fontSize: '20px', fontWeight: 'bold' }}>
              Total: ₹{totalPrice.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleBooking}
            disabled={booking}
            style={{
              padding: '12px 30px',
              background: booking ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: booking ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
            {booking ? 'Processing...' : '💳 Proceed to Pay'}
          </button>
        </div>
      )}
    </div>
  )
}

export default EventDetail
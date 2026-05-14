import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    axios.get(`${API_URL}/api/orders/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrders(res.data)
      setLoading(false)
    })
    .catch(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Loading orders...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back to Store
      </button>

      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '20px' }}>No orders yet!</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{
            border: '1px solid #ccc', borderRadius: '10px',
            padding: '20px', marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3>Order #{order.id}</h3>
              <span style={{
                padding: '4px 12px', borderRadius: '20px',
                background: order.is_paid ? '#4CAF50' : '#FF9800',
                color: 'white', fontSize: '14px'
              }}>
                {order.is_paid ? '✅ Paid' : '⏳ Pending'}
              </span>
            </div>

            <p style={{ color: '#888', marginBottom: '10px' }}>
              📅 {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>

            {order.items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #eee'
              }}>
                <span>{item.product_name} x {item.quantity}</span>
                <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <strong>Total</strong>
              <strong>₹{parseFloat(order.total_price).toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders
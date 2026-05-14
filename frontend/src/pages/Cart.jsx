import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import API_URL from '../config'

function Cart({ cart, removeFromCart, clearCart }) {
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  const token = localStorage.getItem('access')

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    setOrdering(true)
    try {
      const res = await axios.post(
        `${API_URL}/api/orders/create/`,
        { items: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { order_id, razorpay_order_id, amount, currency, key } = res.data

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'My E-commerce Store',
        description: 'Order Payment',
        order_id: razorpay_order_id,

        handler: async function (response) {
          try {
            await axios.post(
              `${API_URL}/api/orders/verify/`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order_id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            clearCart()
            navigate('/orders')
            alert('🎉 Payment Successful! Order placed.')
          } catch {
            alert('Payment verification failed!')
          }
        },

        prefill: {
          name: localStorage.getItem('username'),
        },
        theme: { color: '#2196F3' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      alert('Order creation failed! Please try again.')
    }
    setOrdering(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back to Store
      </button>

      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '20px' }}>Your cart is empty!</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginBottom: '10px'
            }}>
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ padding: '8px 12px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{
            borderTop: '2px solid #ccc', marginTop: '20px', paddingTop: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h2>Total: ₹{total.toFixed(2)}</h2>
            <button
              onClick={handleCheckout}
              disabled={ordering}
              style={{
                padding: '12px 30px',
                background: ordering ? '#ccc' : '#2196F3',
                color: 'white', border: 'none', borderRadius: '5px',
                cursor: ordering ? 'not-allowed' : 'pointer', fontSize: '16px'
              }}>
              {ordering ? 'Processing...' : '💳 Pay with Razorpay'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
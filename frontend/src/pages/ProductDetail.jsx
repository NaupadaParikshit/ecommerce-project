import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import API_URL from '../config'

function ProductDetail({ setCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}/`)
      .then(res => {
        setProduct(res.data)
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0])
        }
        setLoading(false)
      })
  }, [id])

  const addToCart = () => {
    const itemToAdd = selectedVariant ? {
      id: `${product.id}-${selectedVariant.id}`,
      name: `${product.name} - ${selectedVariant.player_name} #${selectedVariant.jersey_number}`,
      price: selectedVariant.price,
      quantity: 1
    } : {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === itemToAdd.id)
      if (existing) {
        return prev.map(item =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, itemToAdd]
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  )

  if (!product) return null

  const playerEmojis = { '18': '🏏', '7': '🧤', '45': '🏏', '93': '⚡', '228': '💪' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', fontFamily: 'sans-serif', padding: '30px' }}>
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '30px', padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>
        ← Back to Store
      </button>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

        {/* Left — Image */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '350px', padding: '30px'
        }}>
          <div style={{ fontSize: '100px', marginBottom: '15px' }}>🎽</div>
          {selectedVariant && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#a78bfa' }}>
                #{selectedVariant.jersey_number}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '5px' }}>
                {selectedVariant.player_name}
              </div>
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 10px' }}>
            {product.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', fontSize: '16px', lineHeight: '1.6' }}>
            {product.description}
          </p>

          {/* Price */}
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#a78bfa', marginBottom: '25px' }}>
            ₹{selectedVariant ? selectedVariant.price : product.price}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', fontWeight: '600', letterSpacing: '1px' }}>
                SELECT PLAYER JERSEY:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {product.variants.map(variant => (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: '15px',
                      borderRadius: '12px',
                      border: selectedVariant?.id === variant.id
                        ? '2px solid #6366f1'
                        : '1px solid rgba(255,255,255,0.1)',
                      background: selectedVariant?.id === variant.id
                        ? 'rgba(99,102,241,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}>
                    <div style={{ fontSize: '35px', marginBottom: '8px' }}>
                      {playerEmojis[variant.jersey_number] || '🎽'}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>
                      {variant.player_name}
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '12px', marginBottom: '6px'
                    }}>
                      #{variant.jersey_number}
                    </div>
                    <div style={{ color: '#a78bfa', fontWeight: '700', fontSize: '15px' }}>
                      ₹{variant.price}
                    </div>
                    {selectedVariant?.id === variant.id && (
                      <div style={{ color: '#4ade80', fontSize: '11px', marginTop: '4px' }}>
                        ✅ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            style={{
              width: '100%', padding: '16px',
              background: added
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '12px',
              color: 'white', fontSize: '16px',
              fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.3s', marginBottom: '10px'
            }}>
            {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
          </button>

          <button
            onClick={() => { addToCart(); navigate('/cart') }}
            style={{
              width: '100%', padding: '16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', color: 'white',
              fontSize: '16px', cursor: 'pointer'
            }}>
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
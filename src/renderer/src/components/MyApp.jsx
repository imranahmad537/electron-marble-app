import { useState, useEffect } from 'react';

function App() {
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  const API_URL = 'http://localhost:3001/api'; // backend port

  const getOrders = () => {
    fetch(`${API_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    getOrders();
  }, []);

  const addOrder = () => {
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, quantity })
    })
      .then(res => res.json())
      .then(() => {
        setProduct('');
        setQuantity('');
        getOrders();
      })
      .catch(err => console.error('Error adding order:', err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Orders</h1>
      <input
        placeholder="Product"
        value={product}
        onChange={e => setProduct(e.target.value)}
      />
      <input
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />
      <button onClick={addOrder}>Add Order</button>

      <ul>
        {orders.map(o => (
          <li key={o.id}>
            {o.product} - {o.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

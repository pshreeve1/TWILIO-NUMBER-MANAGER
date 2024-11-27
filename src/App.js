import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [areaCode, setAreaCode] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch Numbers
  const fetchNumbers = async () => {
    try {
      const response = await axios.get('/api/numbers');
      setNumbers(response.data);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  // Purchase Numbers
  const handlePurchase = async () => {
    try {
      const response = await axios.post('/api/purchase-number', { areaCode, quantity });
      alert(`Purchased Numbers: ${response.data.purchasedNumbers.join(', ')}`);
      fetchNumbers(); // Refresh list
    } catch (error) {
      console.error('Error purchasing numbers:', error);
    }
  };

  // Delete Number
  const handleDelete = async (sid) => {
    try {
      await axios.delete(`/api/delete-number/${sid}`);
      alert('Number deleted successfully.');
      fetchNumbers(); // Refresh list
    } catch (error) {
      console.error('Error deleting number:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Twilio Number Manager</h1>

      {/* Purchase Numbers */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Area Code"
          value={areaCode}
          onChange={(e) => setAreaCode(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handlePurchase} className="p-2 bg-blue-500 text-white rounded">
          Purchase
        </button>
      </div>

      {/* Active Numbers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Numbers</h2>
        <ul>
          {numbers.map((number) => (
            <li key={number.sid} className="mb-2 flex justify-between items-center">
              {number.phoneNumber}
              <button
                onClick={() => handleDelete(number.sid)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
<div className="text-red-500">Hello, Tailwind!</div>
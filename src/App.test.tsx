import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [areaCode, setAreaCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasedNumbers, setPurchasedNumbers] = useState<string[]>([]);

  // Fetch Purchased Numbers
  const fetchPurchasedNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchased-numbers');
      setPurchasedNumbers(response.data.purchasedNumbers);
    } catch (error) {
      console.error('Error fetching purchased numbers:', error);
    }
  };

  useEffect(() => {
    fetchPurchasedNumbers();
  }, []);

  // Purchase Numbers
  const handlePurchase = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/purchase-number', {
        areaCode,
        quantity,
      });
      alert(`Purchased Numbers: ${response.data.purchasedNumbers.join(', ')}`);
      fetchPurchasedNumbers(); // Refresh the list
    } catch (error) {
      console.error('Error purchasing numbers:', error);
      alert('Failed to purchase numbers. Check the console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Twilio Number Manager</h1>

      {/* Purchase Numbers Section */}
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
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handlePurchase} className="p-2 bg-blue-500 text-white rounded">
          Purchase Numbers
        </button>
      </div>

      {/* Purchased Numbers Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Purchased Numbers</h2>
        <ul>
          {purchasedNumbers.map((number, index) => (
            <li key={index} className="mb-2">
              {number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

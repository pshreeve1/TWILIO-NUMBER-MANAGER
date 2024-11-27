import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [areaCode, setAreaCode] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch purchased numbers from the backend
  const fetchPurchasedNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchased-numbers');
      setNumbers(response.data.purchasedNumbers);
    } catch (error) {
      console.error('Error fetching purchased numbers:', error);
    }
  };

  useEffect(() => {
    fetchPurchasedNumbers();
  }, []);

  // Handle purchasing numbers
  const handlePurchase = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/purchase-number', {
        areaCode,
        quantity,
      });
      alert(`Purchased Numbers: ${response.data.purchasedNumbers.join(', ')}`);
      fetchPurchasedNumbers(); // Refresh the list of purchased numbers
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuantity(Number(e.target.value))
          }
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
          {numbers.map((number, index) => (
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
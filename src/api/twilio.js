const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Twilio } = require('twilio');

// Set up Express
const app = express();
const PORT = 5000;

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const client = new Twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

let purchasedNumbersList = []; // Store purchased numbers

// Endpoint: Purchase Phone Numbers
app.post('/api/purchase-number', async (req, res) => {
  const { areaCode, quantity } = req.body;

  try {
    const availableNumbers = await client.availablePhoneNumbers('US')
      .local.list({ areaCode, limit: quantity });

    if (!availableNumbers.length) {
      return res.status(404).json({ message: 'No numbers available for the provided area code.' });
    }

    const purchasedNumbers = [];
    for (const number of availableNumbers) {
      const purchasedNumber = await client.incomingPhoneNumbers.create({
        phoneNumber: number.phoneNumber,
        voiceUrl: process.env.DIALER_WEBHOOK_URL || 'http://example.com/handle-calls',
      });
      purchasedNumbers.push(purchasedNumber.phoneNumber);
      purchasedNumbersList.push(purchasedNumber.phoneNumber); // Add to the list
    }

    res.status(200).json({ purchasedNumbers });
  } catch (error) {
    console.error('Error purchasing numbers:', error);
    res.status(500).json({ message: 'Failed to purchase numbers.', error: error.message });
  }
});

// Endpoint: Get List of Purchased Numbers
app.get('/api/purchased-numbers', (req, res) => {
  res.status(200).json({ purchasedNumbers: purchasedNumbersList });
});

// Run Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
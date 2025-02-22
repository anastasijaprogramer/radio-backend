import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({
  origin: 'https://www.pomodoroom.com',
  methods: ['GET', 'POST'],
  credentials: true
})); 

// Proxy route for fetching data from Radio Garden API
app.get('https://api.pomodoroom.com/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query paeter "q" is required by default' });
  }

  try {
    const response = await fetch(`https://radio.garden/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Radio Garden API');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Radio Garden API' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
 
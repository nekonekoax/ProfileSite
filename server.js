// Simple Node.js server to check Twitch stream status
// npm install express node-fetch dotenv
// node server.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Twitch API credentials
// Set these in your .env file or as environment variables
const CLIENT_ID = process.env.TWITCH_CLIENT_ID || 'yfn3fr0zxn89nxjv45h3x59oy4wq9';
const ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN || '';

app.use(cors());
app.use(express.json());

// Endpoint to check if a channel is live
app.get('/api/twitch/stream/:channel', async (req, res) => {
    try {
        const channel = req.params.channel;
        
        // Using Twitch API v5 (Kraken) - deprecated but still works
        // For production, use Helix API (v6)
        const response = await fetch(`https://api.twitch.tv/kraken/streams/${channel}?client_id=${CLIENT_ID}`, {
            headers: {
                'Client-ID': CLIENT_ID,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        });

        if (!response.ok) {
            // Try Helix API as fallback
            const helixResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            });

            if (!helixResponse.ok) {
                return res.status(404).json({ error: 'Channel not found' });
            }

            const data = await helixResponse.json();
            const isLive = data.data && data.data.length > 0;
            
            return res.json({
                channel: channel,
                isLive: isLive,
                timestamp: new Date().toISOString()
            });
        }

        const data = await response.json();
        const isLive = data.stream !== null;

        res.json({
            channel: channel,
            isLive: isLive,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error checking stream status:', error);
        res.status(500).json({ 
            error: 'Failed to check stream status',
            message: error.message 
        });
    }
});

// Endpoint to get recent videos
app.get('/api/twitch/videos/:channel', async (req, res) => {
    try {
        const channel = req.params.channel;
        
        // Get user info first to get user ID
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!userResponse.ok) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const userData = await userResponse.json();
        const userId = userData.data[0].id;

        // Get videos for this user
        const videosResponse = await fetch(
            `https://api.twitch.tv/helix/videos?user_id=${userId}&sort=time&first=10`,
            {
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        if (!videosResponse.ok) {
            return res.status(404).json({ error: 'Failed to get videos' });
        }

        const videosData = await videosResponse.json();
        
        res.json({
            channel: channel,
            videos: videosData.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error getting videos:', error);
        res.status(500).json({ 
            error: 'Failed to get videos',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Stream status API: GET /api/twitch/stream/nekonekoax');
    console.log('Recent videos API: GET /api/twitch/videos/nekonekoax');
});

// backend/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Weather route
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let url;

        if (city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
        } 
        else if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
        } 
        else {
            return res.status(400).json({ error: "City or coordinates required" });
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.response?.data?.message || "Error fetching weather" });
    }
});

// Forecast route
app.get('/forecast', async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let url;

        if (city) {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
        } 
        else if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
        } 
        else {
            return res.status(400).json({ error: "City or coordinates required" });
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        res.status(500).json({
            error: error.response?.data?.message || "Error fetching forecast"
        });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
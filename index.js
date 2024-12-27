require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY, 
});

// Chatbot Endpoint
app.post('/chat', async (req, res) => {
    var { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message Required',
        });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const botReply = response.choices[0].message.content;
        res.status(200).json({
            success: true,
            reply: botReply,
        });
    } catch (error) {
     
        res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message,
        });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running at PORT :${PORT}`);
});

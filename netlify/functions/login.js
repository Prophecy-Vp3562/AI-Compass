const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Simple hardcoded Dev/Admin user
        if (username === 'admin' && password === 'password123') {
            return res.json({ 
                success: true, 
                message: "Authentication successful.", 
                token: "dev-mock-jwt-token" 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: "Invalid username or password. (Hint: Use admin / password123)" 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error during authentication." 
        });
    }
});

module.exports.handler = serverless(app);

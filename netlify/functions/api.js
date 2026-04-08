const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// Set CORS wide open for mobile device testing
app.use(cors());
app.use(express.json());

// Import tools directly via require for bundler compatibility in Netlify
const tools = require('./tools.json');

// 1. GET /tools -> Return all AI tools
const router = express.Router();

router.get('/tools', (req, res) => {
    try {
        res.json(tools);
    } catch (error) {
        res.status(500).json({ message: "Error loading tools." });
    }
});

// 2. GET /search?q=keyword -> Return filtered tools (case-insensitive)
router.get('/search', (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const lowercaseQuery = query.toLowerCase();
        
        // Filter based on name, category, or description
        const results = tools.filter(tool => {
            const nameMatch = tool.name && tool.name.toLowerCase().includes(lowercaseQuery);
            const categoryMatch = tool.cat && tool.cat.toLowerCase().includes(lowercaseQuery);
            const descMatch = tool.desc && tool.desc.toLowerCase().includes(lowercaseQuery);
            const legacyCategoryMatch = tool.category && tool.category.toLowerCase().includes(lowercaseQuery);
            const legacyDescMatch = tool.description && tool.description.toLowerCase().includes(lowercaseQuery);

            return nameMatch || categoryMatch || descMatch || legacyCategoryMatch || legacyDescMatch;
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error performing search." });
    }
});

// 3. GET /tools/:id -> Return details of a specific tool
router.get('/tools/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        const tool = tools.find(t => t.id === id);
        
        if (tool) {
            res.json(tool);
        } else {
            res.status(404).json({ message: "Tool not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the tool." });
    }
});

// Health check endpoint (good for deployment testing)
router.get('/', (req, res) => {
    res.send('AI Compass Backend is running on Netlify Functions!');
});

// Map routes tightly to support local express or Netlify proxies natively
app.use('/api', router);
app.use('/.netlify/functions/api', router);

// Export wrapper for Netlify
module.exports.handler = serverless(app);

// Local Dev Environment support (Fallback Server)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Backend API running locally on http://localhost:${PORT}`);
    });
}

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend API and Frontend running locally on http://localhost:${PORT}`);
});

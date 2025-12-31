require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Finance Plan API is running');
});

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth.routes');
const { authenticateToken } = require('./middleware/auth.middleware');

app.use('/api/auth', authRoutes);
app.use('/api', authenticateToken, apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

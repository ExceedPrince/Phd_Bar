const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();
const cors = require('cors');
const allowCors = require('./middleware/allowCors');
const corsOptions = require('./utils/corsOptions');
const auth = require('./middleware/auth');
const notExists = require('./middleware/notExists');

const PORT = process.env.PORT || 8080;

const Opening = require('./models/Opening');

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(allowCors);
app.use(cors(corsOptions));

//GET - Basic route
//Public
app.get('/', async (req, res) => {
	res.send('Backend is on')
});

// Define Routes
app.use('/api/menu', require('./routes/api/menu'));
app.use('/api/openings', require('./routes/api/openings'));
app.use('/api/reservations', require('./routes/api/reservations'));

app.use(notExists);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));